from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InsightItem(BaseModel):
    id: str
    title: str
    why_it_matters: str
    simple_explanation: str
    suggested_action: str
    severity: str # 'info' | 'warning' | 'critical'

class ScoreHistoryItem(BaseModel):
    id: int
    date: str # Formatted date string (e.g., "Jan 2026")
    score: int
    dti: float
    utilization: float
    debt: float

class UtilizationBreakdown(BaseModel):
    credit_limit: float
    used_credit: float
    available_credit: float
    utilization_percentage: float

class SnapshotDelta(BaseModel):
    score_change: int
    score_change_text: str
    utilization_change: float
    dti_change: float
    debt_change: float

class DashboardDataResponse(BaseModel):
    user_name: str
    has_profile: bool
    credit_score: Optional[int] = None
    utilization: Optional[float] = None
    dti: Optional[float] = None
    monthly_debt: Optional[float] = None
    available_credit: Optional[float] = None
    financial_goal: Optional[str] = None
    
    score_history: List[ScoreHistoryItem]
    utilization_breakdown: Optional[UtilizationBreakdown] = None
    insights: List[InsightItem]
    delta: Optional[SnapshotDelta] = None
