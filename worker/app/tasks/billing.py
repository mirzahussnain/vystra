from ..services.celery_client import celery_app
from backend.app.database.models import User
from backend.app.database.config import SessionLocal
from datetime import datetime, timedelta

@celery_app.task(name="reset_monthly_quotas")
def reset_monthly_quotas():
    print("📅 DAILY JOB: Checking for billing resets...")
    
    with SessionLocal() as db:
        now = datetime.utcnow()
        
        #  "Who is past their due date?"
        users_due = db.query(User).filter(User.next_billing_date <= now).all()
        
        count = 0
        for user in users_due:
            # 1. Reset Quota
            user.used_minutes = 0
            user.used_ai_actions = 0
            
            # 2. Advance Date (Strict Catch-Up)
            # If server was down and date is way in the past, loop until it's in the future.
            # Example: User due Jan 1. Today is Feb 15.
            # Loop 1: Jan 1 -> Jan 31 (Still past)
            # Loop 2: Jan 31 -> Mar 2 (Future! Stop.)
            while user.next_billing_date <= now:
                user.next_billing_date += timedelta(days=30)
            
            count += 1
            
        db.commit()
        print(f"✅ Reset {count} users.")