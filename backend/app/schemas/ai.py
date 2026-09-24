from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AIAnalysisRequest(BaseModel):
    force_refresh: bool = False

class AIAnalysisResponse(BaseModel):
    id: Optional[int] = None
    summary: str
    key_factors: List[str]
    action_plan: List[str] # Exactly 5 prioritized educational steps
    explanation: str
    created_at: Optional[datetime] = None

class AIChatRequest(BaseModel):
    question: str = Field(..., min_length=2, description="Follow-up question for Credit Assistant")

class AIChatResponse(BaseModel):
    question: str
    answer: str
