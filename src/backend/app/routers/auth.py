from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import crud
from ..schemas.user import Token, UserCreate, UserInDB
from ..core.auth import create_access_token, verify_password
from ..core.dependencies import get_db, get_current_admin, get_current_agent_or_admin
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.user.get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "username": user.username}

@router.post("/register/agent", response_model=UserInDB)
def register_agent(agent: UserCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    db_user = crud.user.get_user_by_username(db, agent.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.user.get_user_by_email(db, agent.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    agent.role = "agent"
    return crud.user.create_user(db, agent)

@router.get("/me", response_model=UserInDB)
def read_users_me(db: Session = Depends(get_db), current_user: User = Depends(get_current_agent_or_admin)):
    return current_user