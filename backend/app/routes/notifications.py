from fastapi import APIRouter
from fastapi import Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.database.models import Notification

router=APIRouter()

@router.get("/notifications")
def get_notifications(db:Session=Depends(get_db),limit:int=5):
    """Get the 5 most recent notifications"""
    notifications=db.query(Notification).order_by(Notification.created_at.desc()).limit(limit).all()
    return notifications
    
@router.patch("/notifications/{id}/read")
def mark_read(id: int, db: Session = Depends(get_db)):
    """Mark a notification as read (turns off the red dot)"""
    notif = db.get(Notification,id)
    
    if not notif:
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Notification not found"
        )
    
    notif.is_read = True
    db.commit()
    return {"status": True}

@router.put("/notifications/mark-all-read")
def mark_all_read(db: Session = Depends(get_db)):
    """Mark ALL unread notifications as read (for the 'Mark all' button)"""
    db.query(Notification)\
      .filter(Notification.is_read == False)\
      .update({"is_read": True})
      
    db.commit()
    return {"status": True, "message": "All marked as read"}