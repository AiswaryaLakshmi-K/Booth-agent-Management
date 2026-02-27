from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..core.dependencies import get_db, get_current_admin
from ..models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.user.UserInDB)
def create_user(user: schemas.user.UserCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Create new user/agent (admin only)"""
    db_user = crud.user.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    db_user = crud.user.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    return crud.user.create_user(db, user)

@router.get("/", response_model=List[schemas.user.UserInDB])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return crud.user.get_users(db, skip=skip, limit=limit)

@router.get("/{user_id}", response_model=schemas.user.UserInDB)
def read_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    db_user = crud.user.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=schemas.user.UserInDB)
def update_user(user_id: int, user_update: schemas.user.UserUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    db_user = crud.user.update_user(db, user_id, user_update)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    success = crud.user.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}