from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.user import User
from .auth import get_current_user

def get_current_db_user(current_user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == current_user_data["username"]).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found or inactive")
    return user

def get_current_admin(current_user: User = Depends(get_current_db_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user

def get_current_agent_or_admin(current_user: User = Depends(get_current_db_user)):
    if current_user.role not in ["admin", "agent"]:
        raise HTTPException(status_code=403, detail="Agent or admin privileges required")
    return current_user