from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..core.dependencies import get_db, get_current_admin, get_current_agent_or_admin
from ..models.user import User

router = APIRouter(prefix="/booths", tags=["Booths"])

@router.get("/", response_model=List[schemas.booth.BoothInDB])
def read_booths(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """Get all booths (admin or agent)"""
    booths = crud.booth.get_booths(db, skip=skip, limit=limit)
    return booths

@router.post("/", response_model=schemas.booth.BoothInDB)
def create_booth(
    booth: schemas.booth.BoothCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create new booth (admin only)"""
    return crud.booth.create_booth(db=db, booth=booth)

@router.get("/{booth_id}", response_model=schemas.booth.BoothInDB)
def read_booth(
    booth_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """Get booth by ID"""
    booth = crud.booth.get_booth(db, booth_id=booth_id)
    if not booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    return booth

@router.put("/{booth_id}", response_model=schemas.booth.BoothInDB)
def update_booth(
    booth_id: int,
    booth_update: schemas.booth.BoothUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update booth (admin only)"""
    booth = crud.booth.update_booth(db, booth_id=booth_id, booth_update=booth_update)
    if not booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    return booth

@router.delete("/{booth_id}")
def delete_booth(
    booth_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete booth (admin only)"""
    success = crud.booth.delete_booth(db, booth_id=booth_id)
    if not success:
        raise HTTPException(status_code=404, detail="Booth not found")
    return {"message": "Booth deleted successfully"}