from sqlalchemy.orm import Session
from ..models.booth import Booth
from ..schemas.booth import BoothCreate, BoothUpdate
from typing import Optional, List

def get_booth(db: Session, booth_id: int):
    return db.query(Booth).filter(Booth.id == booth_id).first()

def get_booth_by_number(db: Session, booth_number: str):
    return db.query(Booth).filter(Booth.booth_number == booth_number).first()

def get_booths(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Booth).offset(skip).limit(limit).all()

def create_booth(db: Session, booth: BoothCreate):
    db_booth = Booth(**booth.dict())
    db.add(db_booth)
    db.commit()
    db.refresh(db_booth)
    return db_booth

def update_booth(db: Session, booth_id: int, booth_update: BoothUpdate):
    db_booth = get_booth(db, booth_id)
    if db_booth:
        for key, value in booth_update.dict(exclude_unset=True).items():
            setattr(db_booth, key, value)
        db.commit()
        db.refresh(db_booth)
    return db_booth

def delete_booth(db: Session, booth_id: int):
    db_booth = get_booth(db, booth_id)
    if db_booth:
        db.delete(db_booth)
        db.commit()
        return True
    return False