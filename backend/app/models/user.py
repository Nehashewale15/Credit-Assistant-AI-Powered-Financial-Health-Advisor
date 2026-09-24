from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    snapshots = relationship("CreditSnapshot", back_populates="user", cascade="all, delete-orphan", order_by="CreditSnapshot.created_at.asc()")
    analyses = relationship("AIAnalysis", back_populates="user", cascade="all, delete-orphan", order_by="AIAnalysis.created_at.desc()")
