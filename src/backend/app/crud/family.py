from sqlalchemy.orm import Session
from ..models.family import Family
from ..schemas.family import FamilyCreate, FamilyUpdate
from typing import Optional, List

def get_family(db: Session, family_id: int):
    return db.query(Family).filter(Family.id == family_id).first()

def get_families(db: Session, booth_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Family)
    if booth_id:
        query = query.filter(Family.booth_id == booth_id)
    return query.offset(skip).limit(limit).all()

def create_family(db: Session, family: FamilyCreate, agent_id: int):
    db_family = Family(**family.dict(), agent_id=agent_id)
    db.add(db_family)
    db.commit()
    db.refresh(db_family)
    return db_family

def update_family(db: Session, family_id: int, family_update: FamilyUpdate):
    db_family = get_family(db, family_id)
    if db_family:
        for key, value in family_update.dict(exclude_unset=True).items():
            setattr(db_family, key, value)
        db.commit()
        db.refresh(db_family)
    return db_family

def delete_family(db: Session, family_id: int):
    db_family = get_family(db, family_id)
    if db_family:
        db.delete(db_family)
        db.commit()
        return True
    return False