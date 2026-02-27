from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BoothBase(BaseModel):
    booth_number: str
    booth_name: str
    area: str
    ward_number: Optional[str] = None
    assembly_constituency: Optional[str] = None
    parliamentary_constituency: Optional[str] = None
    total_voters: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    boundary_details: Optional[str] = None
    is_active: bool = True

class BoothCreate(BoothBase):
    pass

class BoothUpdate(BaseModel):
    booth_name: Optional[str] = None
    area: Optional[str] = None
    ward_number: Optional[str] = None
    assembly_constituency: Optional[str] = None
    parliamentary_constituency: Optional[str] = None
    total_voters: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    boundary_details: Optional[str] = None
    is_active: Optional[bool] = None

class BoothInDB(BoothBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True