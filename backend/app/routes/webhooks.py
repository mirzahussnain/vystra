from sqlalchemy import update
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from svix.webhooks import Webhook, WebhookVerificationError
from ..core.config import settings
from ..database.config import get_db
from ..database.enums import NotificationType, PlanType
from ..database.models import Notification, User

router = APIRouter()


@router.post("/clerk")
async def clerk_webhook(
    request: Request, 
    db: Session = Depends(get_db)
):
    """Handle Clerk webhooks"""
    # 1. Get the Secret from settings
    WEBHOOK_SECRET = settings.CLERK_WEBHOOK_SECRET
    if not WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    # 2. Get the Headers
    headers = request.headers
    svix_id = headers.get("svix-id")
    svix_timestamp = headers.get("svix-timestamp")
    svix_signature = headers.get("svix-signature")

    if not all([svix_id, svix_timestamp, svix_signature]):
        raise HTTPException(status_code=400, detail="Missing svix headers")

    # 3. Verify the Payload (Crucial: Use raw bytes)
    body = await request.body()
    payload = body.decode()
    
    wh = Webhook(WEBHOOK_SECRET)
    
    try:
        # This will raise an error if the signature is invalid
        evt = wh.verify(payload, headers)
    except WebhookVerificationError as e:
        print(f"❌ Webhook verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 4. Handle the "user.created" Event
    event_type = evt.get("type")
    data = evt.get("data")

    if event_type == "user.created":
        user_id = data.get("id")
        email_addresses = data.get("email_addresses", [])
        email = email_addresses[0].get("email_address") if email_addresses else None
        first_name = data.get("first_name") or ""
        last_name = data.get("last_name") or ""

        # 5. Sync to Database
        try:
            # Check if user already exists to avoid duplicates
            existing_user = db.query(User).filter(User.id == user_id).first()
            if not existing_user:
                print(f"👤 Creating new user in DB: {email}")
                new_user = User(
                    id=user_id,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    plan=PlanType.FREE.value,  # Default new users to Free
                    # Apply initial Free Tier limits here
                    max_minutes=settings.PLAN_LIMITS["free"]["max_minutes"],
                    max_ai_actions=settings.PLAN_LIMITS["free"]["max_ai_actions"],
                    max_storage_bytes=settings.PLAN_LIMITS["free"]["max_storage_bytes"]
                )
                db.add(new_user)
                db.commit()
            return {"status": "success", "message": "User created"}
            
        except Exception as e:
            db.rollback()
            print(f"❌ Database error: {e}")
            raise HTTPException(status_code=500, detail="Database sync failed")

    return {"status": "ignored"}
   
@router.post("/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_KEY
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 1. Handle Successful Payment (Upgrade)
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("client_reference_id")

        # Default to 'pro' if metadata is missing (safety net)
        metadata = session.get("metadata") or {}
        plan_type_str = metadata.get("plan_type", "pro") 
        
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                print(f"💰 Upgrading {user.email} to {plan_type_str.upper()}")

                # 1. Update User Plan String/Enum

                try:
                    new_plan_enum = PlanType(plan_type_str.lower())  # .lower() for safety
                    
                except ValueError:
                    # Fallback if an invalid string came through
                    print(f"⚠️ Unknown plan '{plan_type_str}', defaulting to PRO")
                    new_plan_enum = PlanType.PRO.value

                user.plan = new_plan_enum.value
                user.stripe_customer_id = session.get("customer")
                user.stripe_subscription_id = session.get("subscription")

                # Apply Pro Limits
                if user.plan in settings.PLAN_LIMITS:
                    limits = settings.PLAN_LIMITS[user.plan]

                    user.max_minutes = limits["max_minutes"]
                    user.max_ai_actions = limits["max_ai_actions"]
                    user.max_storage_bytes = limits["max_storage_bytes"]
                    
                db.add(
                       Notification(
                           user_id=user_id,
                           message=f"Welcome {user.first_name}: You're now a Pro.",
                           type=NotificationType.INFO.value,
                       )
                   )
                
                db.commit()

    # 2. Handle Cancellation (Downgrade)
    elif event["type"] == "customer.subscription.deleted":
        sub = event["data"]["object"]
        stripe_cust_id = sub.get("customer")
        user = db.query(User).filter(User.stripe_customer_id == stripe_cust_id).first()

        if user:
            print(f"📉 Downgrading {user.email} to FREE")
            user.plan = PlanType.FREE.value
            user.stripe_subscription_id = None

            # Apply Free Limits
            if PlanType.FREE.value in settings.PLAN_LIMITS:
                limits = settings.PLAN_LIMITS[PlanType.FREE.value]
                user.max_minutes = limits["max_minutes"]
                user.max_ai_actions = limits["max_ai_actions"]
                user.max_storage_bytes = limits["max_storage_bytes"]
            db.commit()

    elif event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]

        # Only care about subscription invoices (not one-off payments)
        if invoice.get("subscription"):
            stripe_cust_id = invoice.get("customer")

            # Find user
            user = (
                db.query(User).filter(User.stripe_customer_id == stripe_cust_id).first()
            )
            if user:
                print(f"🔄 Monthly Reset for {user.email}")
                
               
                # # Reset counters to 0
                user.used_minutes = 0.0
                user.used_ai_actions = 0

                db.commit()
    elif event["type"] == "customer.subscription.updated":
        session = event["data"]["object"]
        stripe_cust_id = session.get("customer")

        # 1. Get the new Price ID to figure out which plan it is
        # Stripe sends a list of items, usually just one for simple subs
        current_price_id = session["items"]["data"][0]["price"]["id"]

        # 2. Map Price ID back to  Plan Enum
        # Needed a reverse map or helper function here
        
        new_plan_enum = PlanType.FREE  # Default
        if current_price_id == settings.STRIPE_PRICES['pro']:
            new_plan_enum = PlanType.PRO
        elif current_price_id == settings.STRIPE_PRICES['enterprise']:
            new_plan_enum = PlanType.ENTERPRISE

        user = db.query(User).filter(User.stripe_customer_id == stripe_cust_id).first()

        if user and user.plan != new_plan_enum.value:
            print(
                f"🔄 Plan Changed for {user.email}: {user.plan} -> {new_plan_enum.value}"
            )

            user.plan = new_plan_enum.value

            # 3. Apply New Limits IMMEDIATELY
            if user.plan in settings.PLAN_LIMITS:
                limits = settings.PLAN_LIMITS[user.plan]
                user.max_minutes = limits["max_minutes"]
                user.max_ai_actions = limits["max_ai_actions"]
                user.max_storage_bytes = limits["max_storage_bytes"]

            db.commit()
    
    elif event["type"] == "invoice.payment_failed":
            # FIX: Added logging for failed payments so you can debug why renewals fail
            cust_id = data_obj.get("customer")
            print(f"⚠️ Payment failed for customer {cust_id}. Stripe will retry later.")
    return {"status": "success"}
