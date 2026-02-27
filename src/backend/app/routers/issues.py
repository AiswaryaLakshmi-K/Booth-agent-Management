from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas
from ..core.dependencies import get_db, get_current_agent_or_admin, get_current_admin
from ..models.user import User

router = APIRouter(prefix="/issues", tags=["Issues"])

@router.get("/", response_model=List[schemas.issue.IssueInDB])
def read_issues(
    booth_id: Optional[int] = None,
    family_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Get all issues.
    - Admin can see all issues or filter by booth.
    - Agent can only see issues from their assigned booth.
    """
    if current_user.role == "agent":
        booth_id = current_user.assigned_booth_id
        if not booth_id:
            return []  # Return empty list if agent has no booth
    issues = crud.issue.get_issues(
        db, booth_id=booth_id, family_id=family_id,
        status=status, priority=priority, skip=skip, limit=limit
    )
    return issues

@router.post("/", response_model=schemas.issue.IssueInDB)
def create_issue(
    issue: schemas.issue.IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Create a new issue.
    - Agent can only create issues for families in their assigned booth.
    """
    # Verify the family exists and check booth permission
    family = crud.family.get_family(db, family_id=issue.family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    if current_user.role == "agent" and family.booth_id != current_user.assigned_booth_id:
        raise HTTPException(status_code=403, detail="You can only create issues for families in your assigned booth")
    # Optionally set booth_id from family if not provided
    if not issue.booth_id:
        issue.booth_id = family.booth_id
    return crud.issue.create_issue(db=db, issue=issue, reported_by=current_user.id)

@router.get("/{issue_id}", response_model=schemas.issue.IssueInDB)
def read_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Get a specific issue.
    - Agent can only access issues from their assigned booth.
    """
    issue = crud.issue.get_issue(db, issue_id=issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    # Check permission via family's booth
    family = crud.family.get_family(db, family_id=issue.family_id)
    if current_user.role == "agent" and family.booth_id != current_user.assigned_booth_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this issue")
    return issue

@router.put("/{issue_id}", response_model=schemas.issue.IssueInDB)
def update_issue(
    issue_id: int,
    issue_update: schemas.issue.IssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Update an issue.
    - Agent can only update issues from their assigned booth.
    """
    issue = crud.issue.get_issue(db, issue_id=issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    family = crud.family.get_family(db, family_id=issue.family_id)
    if current_user.role == "agent" and family.booth_id != current_user.assigned_booth_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this issue")
    updated = crud.issue.update_issue(db, issue_id=issue_id, issue_update=issue_update)
    return updated

@router.delete("/{issue_id}")
def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Delete an issue (Admin only).
    """
    success = crud.issue.delete_issue(db, issue_id=issue_id)
    if not success:
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"message": "Issue deleted successfully"}

@router.patch("/{issue_id}/resolve")
def resolve_issue(
    issue_id: int,
    resolution: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent_or_admin)
):
    """
    Mark an issue as resolved.
    - Agent can only resolve issues from their assigned booth.
    """
    issue = crud.issue.get_issue(db, issue_id=issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    family = crud.family.get_family(db, family_id=issue.family_id)
    if current_user.role == "agent" and family.booth_id != current_user.assigned_booth_id:
        raise HTTPException(status_code=403, detail="Not authorized to resolve this issue")
    resolved = crud.issue.resolve_issue(
        db, issue_id=issue_id,
        resolution_notes=resolution,
        resolved_by=current_user.id
    )
    return {"message": "Issue resolved successfully"}