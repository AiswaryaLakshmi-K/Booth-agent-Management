from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.sql import func
from ..db.database import Base

class Booth(Base):
    __tablename__ = "booths"

    id = Column(Integer, primary_key=True, index=True)
    booth_number = Column(String(20), unique=True, index=True, nullable=False)
    booth_name = Column(String(100), nullable=False)
    area = Column(String(100), nullable=False)
    ward_number = Column(String(20))
    assembly_constituency = Column(String(100))
    parliamentary_constituency = Column(String(100))
    total_voters = Column(Integer, default=0)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    boundary_details = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())