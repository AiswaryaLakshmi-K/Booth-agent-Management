from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas
from ..core.dependencies import get_db, get_current_agent_or_admin, get_current_admin
from ..models.user import User

router = APIRouter(prefix="/families", tags=["Families"])

@router.get("/", response_model=List[schemas.family.FamilyInDB])
def read_families(
    booth_id: Optional[int] = None,
    supporter_type: Optional[str] = Query(None, description="strong, lean, swing, opposition, undecided"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Get all families. 
    - Admin can see all families or filter by booth_id.
    - Agent can only see families from their assigned booth.
    """
    if current_user.role == "agent":
        booth_id = current_user.assigned_booth_id
        if not booth_id:
            return []  # Return empty list if agent has no booth
    
    families = crud.family.get_families(db, booth_id=booth_id, skip=skip, limit=limit)
    
    if supporter_type:
        families = [f for f in families if f.supporter_type == supporter_type]
    return families

@router.post("/", response_model=schemas.family.FamilyInDB)
def create_family(
    family: schemas.family.FamilyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Create a new family.
    - Agent can only create in their assigned booth.
    - Admin can create in any booth.
    """
    if current_user.role == "agent":
        if family.booth_id != current_user.assigned_booth_id:
            raise HTTPException(status_code=403, detail="You can only add families to your assigned booth")
    return crud.family.create_family(db=db, family=family, agent_id=current_user.id)

@router.get("/{family_id}", response_model=schemas.family.FamilyInDB)
def read_family(
    family_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Get a specific family by ID.
    - Agent can only access families in their assigned booth.
    """
    family = crud.family.get_family(db, family_id=family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    if current_user.role == "agent" and family.booth_id != current_user.assigned_booth_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this family")
    return family

@router.put("/{family_id}", response_model=schemas.family.FamilyInDB)
def update_family(
    family_id: int,
    family_update: schemas.family.FamilyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Update a family.
    - Agent can only update families in their assigned booth.
    """
    family = crud.family.get_family(db, family_id=family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    if current_user.role == "agent" and family.booth_id != current_user.assigned_booth_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this family")
    updated = crud.family.update_family(db, family_id=family_id, family_update=family_update)
    return updated

@router.delete("/{family_id}")
def delete_family(
    family_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Delete a family (Admin only).
    """
    success = crud.family.delete_family(db, family_id=family_id)
    if not success:
        raise HTTPException(status_code=404, detail="Family not found")
    return {"message": "Family deleted successfully"}