from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class IssueStatus(str, Enum):
    REPORTED = "reported"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    ESCALATED = "escalated"

class IssuePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class IssueBase(BaseModel):
    family_id: int
    title: str
    description: str
    category: Optional[str] = None
    status: IssueStatus = IssueStatus.REPORTED
    priority: IssuePriority = IssuePriority.MEDIUM
    location_details: Optional[str] = None

class IssueCreate(IssueBase):
    booth_id: Optional[int] = None

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[IssueStatus] = None
    priority: Optional[IssuePriority] = None
    location_details: Optional[str] = None
    resolution_notes: Optional[str] = None

class IssueInDB(IssueBase):
    id: int
    booth_id: Optional[int] = None
    reported_by: int
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True