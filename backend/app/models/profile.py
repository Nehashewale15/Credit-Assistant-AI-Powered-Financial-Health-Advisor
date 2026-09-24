from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.connection import Base

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    credit_score = Column(Integer, nullable=False, default=650)
    monthly_income = Column(Float, nullable=False, default=40000.0)
    monthly_expenses = Column(Float, nullable=False, default=15000.0)
    monthly_debt = Column(Float, nullable=False, default=10000.0)
    credit_limit = Column(Float, nullable=False, default=100000.0)
    outstanding_credit = Column(Float, nullable=False, default=60000.0)
    missed_payments = Column(Integer, nullable=False, default=0)
    financial_goal = Column(String(100), nullable=False, default="Improve credit health")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship
    user = relationship("User", back_populates="profile")
