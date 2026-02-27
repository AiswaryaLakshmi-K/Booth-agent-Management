from sqlalchemy.orm import Session
from ..models.issue import Issue
from ..schemas.issue import IssueCreate, IssueUpdate
from typing import Optional, List

def get_issue(db: Session, issue_id: int):
    return db.query(Issue).filter(Issue.id == issue_id).first()

def get_issues(db: Session, booth_id: Optional[int] = None, family_id: Optional[int] = None, status: Optional[str] = None, priority: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(Issue)
    if booth_id:
        query = query.filter(Issue.booth_id == booth_id)
    if family_id:
        query = query.filter(Issue.family_id == family_id)
    if status:
        query = query.filter(Issue.status == status)
    if priority:
        query = query.filter(Issue.priority == priority)
    return query.offset(skip).limit(limit).all()

def create_issue(db: Session, issue: IssueCreate, reported_by: int):
    db_issue = Issue(**issue.dict(), reported_by=reported_by)
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def update_issue(db: Session, issue_id: int, issue_update: IssueUpdate):
    db_issue = get_issue(db, issue_id)
    if db_issue:
        for key, value in issue_update.dict(exclude_unset=True).items():
            setattr(db_issue, key, value)
        db.commit()
        db.refresh(db_issue)
    return db_issue

def delete_issue(db: Session, issue_id: int):
    db_issue = get_issue(db, issue_id)
    if db_issue:
        db.delete(db_issue)
        db.commit()
        return True
    return False

def resolve_issue(db: Session, issue_id: int, resolution_notes: str, resolved_by: int):
    db_issue = get_issue(db, issue_id)
    if db_issue:
        db_issue.status = 'resolved'
        db_issue.resolution_notes = resolution_notes
        db_issue.resolved_by = resolved_by
        db.commit()
        db.refresh(db_issue)
    return db_issue