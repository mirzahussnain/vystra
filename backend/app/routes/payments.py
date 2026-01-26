from fastapi import APIRouter, Depends, HTTPException, Query
import stripe

from ..database.schema import CheckoutRequest
from ..database.models import User
from ..dependencies import get_current_user
from ..core.config import settings
router=APIRouter()
stripe.api_key = settings.STRIPE_API_KEY


@router.post("/create-checkout-session")
def create_checkout_session(
    req: CheckoutRequest,                   # <--- Accept JSON body
    user: User = Depends(get_current_user),
):
    # 3. Validation
    price_id = settings.STRIPE_PRICES.get(req.plan)
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    try:
        if user.plan == req.plan:
                # Create a Portal Session instead (Manage Subscription)
                portal_session = stripe.billing_portal.Session.create(
                    customer=user.stripe_customer_id,
                    return_url=f"{settings.FRONTEND_URL}/dashboard"
                )
                return {"url": portal_session.url}
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='subscription',
            client_reference_id=user.id,
            customer_email=user.email,
            
            # Metadata helps us know WHICH plan they bought in the webhook
            metadata={"plan_type": req.plan}, 
            
            success_url=f'{settings.FRONTEND_URL}/dashboard?payment=success',
            cancel_url=f'{settings.FRONTEND_URL}/pricing?payment=cancelled',
        )
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail="Checkout failed")
        
        
@router.post("/create-customer-portal-session")
def create_customer_portal_session(
    user: User = Depends(get_current_user),
):
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url=f"{settings.FRONTEND_URL}/dashboard/settings"
        )
        return {"url": portal_session.url}
    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail="Portal session creation failed")