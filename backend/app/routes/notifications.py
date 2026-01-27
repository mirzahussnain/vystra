from fastapi import APIRouter
from fastapi import Depends,HTTPException,status
from sqlalchemy.orm import Session
from ..database.config import get_db
from ..database.models import Notification

router=APIRouter()

@router.get("/notifications")
def get_notifications(db:Session=Depends(get_db),user:User=Depends(get_current_user),limit:int=5):
    """Get the 5 most recent notifications"""
    notifications=db.query(Notification).filter(Notification.user_id==user.id).order_by(Notification.created_at.desc()).limit(limit).all()
    return notifications
    
@router.patch("/notifications/{id}/read")
def mark_read(id: int,user:User=Depends(get_current_user), db: Session = Depends(get_db)):
    """Mark a notification as read (turns off the red dot)"""
    notif = db.query(Notification).filter(Notification.id==id,Notification.user_id==user.id).first()
    
    if not notif:
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Notification not found"
        )
    
    notif.is_read = True
    db.commit()
    return {"status": True}

@router.put("/notifications/mark-all-read")
def mark_all_read(user:User=Depends(get_current_user),db: Session = Depends(get_db)):
    """Mark ALL unread notifications as read (for the 'Mark all' button)"""
    notif=db.query(Notification).filter(Notification.user_id==user.id,not Notification.is_read == False)
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No unread notifications"
        )
    notif.update({"is_read": True})
    db.commit()
    return {"status": True, "message": "All marked as read"}