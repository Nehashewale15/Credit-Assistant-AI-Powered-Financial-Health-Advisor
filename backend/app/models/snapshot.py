from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.connection import Base

class CreditSnapshot(Base):
    __tablename__ = "credit_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    credit_score = Column(Integer, nullable=False)
    dti = Column(Float, nullable=False) # Debt-to-Income %
    utilization = Column(Float, nullable=False) # Credit Utilization %
    outstanding_debt = Column(Float, nullable=False) # Monthly debt or total credit balance
    monthly_income = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = relationship("User", back_populates="snapshots")
