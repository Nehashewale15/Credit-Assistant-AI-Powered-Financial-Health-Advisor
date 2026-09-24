from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProfileCreateOrUpdate(BaseModel):
    credit_score: int = Field(..., ge=300, le=900, description="Current credit score (300-900)")
    monthly_income: float = Field(..., gt=0, description="Monthly gross income in ₹")
    monthly_expenses: float = Field(0.0, ge=0, description="Monthly essential living expenses in ₹")
    monthly_debt: float = Field(0.0, ge=0, description="Monthly debt/EMI payments in ₹")
    credit_limit: float = Field(..., ge=0, description="Total revolving credit limit in ₹")
    outstanding_credit: float = Field(..., ge=0, description="Current outstanding credit balance in ₹")
    missed_payments: int = Field(0, ge=0, description="Missed payments count in recent period")
    financial_goal: str = Field("Improve credit health", description="Primary financial goal")

class ProfileResponse(ProfileCreateOrUpdate):
    id: int
    user_id: int
    dti: float
    utilization: float
    available_credit: float
    updated_at: datetime

    class Config:
        from_attributes = True
