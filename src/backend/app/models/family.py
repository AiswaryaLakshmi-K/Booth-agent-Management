from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.database import Base

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    booth_id = Column(Integer, ForeignKey("booths.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Head of Family Details
    head_name = Column(String(100), nullable=False)
    head_father_or_husband_name = Column(String(100))  # Father/Husband name
    head_phone = Column(String(15))
    head_age = Column(Integer)
    head_gender = Column(String(10))
    head_occupation = Column(String(100))

    # Family Details
    total_family_members = Column(Integer, default=1)
    eligible_voters = Column(Integer, default=0)
    family_members_details = Column(JSON)  # Array of members with their details

    # Address
    house_number = Column(String(50))
    street = Column(String(100))
    landmark = Column(String(100))
    pincode = Column(String(10))

    # Political Data (including party-specific)
    supporter_type = Column(String(20))  # strong, lean, swing, opposition, undecided
    preferred_party = Column(String(50))  # DMK, AIADMK, BJP, etc. (if opposition)
    will_vote = Column(Boolean, default=True)  # whether they intend to vote
    voted_last_election = Column(Boolean, nullable=True)

    # Issues
    has_issues = Column(Boolean, default=False)
    issues_description = Column(Text)

    # Metadata
    last_contacted = Column(DateTime(timezone=True))
    contact_attempts = Column(Integer, default=0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())