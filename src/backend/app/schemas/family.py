from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

class FamilyMember(BaseModel):
    name: str
    age: int
    gender: str
    relation: str
    voter_id: Optional[str] = None
    is_voter: bool = True
    occupation: Optional[str] = None
    phone: Optional[str] = None
    party_preference: Optional[str] = None  # Party A, Party B, Party C, Others
    remarks: Optional[str] = None

class FamilyBase(BaseModel):
    booth_id: int
    head_name: str
    head_father_or_husband_name: Optional[str] = None
    head_phone: Optional[str] = None
    head_age: Optional[int] = None
    head_gender: Optional[str] = None
    head_occupation: Optional[str] = None
    total_family_members: int = 1
    eligible_voters: int = 0
    house_number: Optional[str] = None
    street: Optional[str] = None
    landmark: Optional[str] = None
    pincode: Optional[str] = None
    supporter_type: Optional[str] = None  # strong, lean, swing, opposition, undecided
    preferred_party: Optional[str] = None
    will_vote: bool = True
    voted_last_election: Optional[bool] = None
    has_issues: bool = False
    issues_description: Optional[str] = None
    notes: Optional[str] = None

class FamilyCreate(FamilyBase):
    family_members_details: Optional[List[FamilyMember]] = []

class FamilyUpdate(BaseModel):
    head_name: Optional[str] = None
    head_father_or_husband_name: Optional[str] = None
    head_phone: Optional[str] = None
    head_age: Optional[int] = None
    head_gender: Optional[str] = None
    head_occupation: Optional[str] = None
    total_family_members: Optional[int] = None
    eligible_voters: Optional[int] = None
    family_members_details: Optional[List[FamilyMember]] = None
    house_number: Optional[str] = None
    street: Optional[str] = None
    landmark: Optional[str] = None
    pincode: Optional[str] = None
    supporter_type: Optional[str] = None
    preferred_party: Optional[str] = None
    will_vote: Optional[bool] = None
    voted_last_election: Optional[bool] = None
    has_issues: Optional[bool] = None
    issues_description: Optional[str] = None
    last_contacted: Optional[datetime] = None
    contact_attempts: Optional[int] = None
    notes: Optional[str] = None

class FamilyInDB(FamilyBase):
    id: int
    agent_id: Optional[int] = None
    family_members_details: Optional[List[Dict]] = None
    last_contacted: Optional[datetime] = None
    contact_attempts: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True