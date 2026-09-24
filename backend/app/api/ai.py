import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import FinancialProfile
from app.models.ai_analysis import AIAnalysis
from app.schemas.ai import AIAnalysisRequest, AIAnalysisResponse, AIChatRequest, AIChatResponse
from app.core.security import get_current_user
from app.services.gemini_service import generate_gemini_analysis, generate_gemini_chat_answer

router = APIRouter(prefix="/ai", tags=["Gemini AI Advisor"])

@router.post("/analyze", response_model=AIAnalysisResponse)
def analyze_credit_profile(
    body: AIAnalysisRequest = AIAnalysisRequest(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your financial profile before requesting an AI credit analysis."
        )

    # Return existing cached analysis unless force_refresh is True
    if not body.force_refresh:
        latest = (
            db.query(AIAnalysis)
            .filter(AIAnalysis.user_id == current_user.id)
            .order_by(AIAnalysis.created_at.desc())
            .first()
        )
        if latest:
            return AIAnalysisResponse(
                id=latest.id,
                summary=latest.summary,
                key_factors=json.loads(latest.key_factors_json),
                action_plan=json.loads(latest.action_plan_json),
                explanation=latest.explanation,
                created_at=latest.created_at
            )

    # Generate new Gemini AI analysis
    analysis_res = generate_gemini_analysis(current_user.name, profile)

    # Save to database
    ai_record = AIAnalysis(
        user_id=current_user.id,
        summary=analysis_res.summary,
        key_factors_json=json.dumps(analysis_res.key_factors),
        action_plan_json=json.dumps(analysis_res.action_plan),
        explanation=analysis_res.explanation
    )
    db.add(ai_record)
    db.commit()
    db.refresh(ai_record)

    analysis_res.id = ai_record.id
    analysis_res.created_at = ai_record.created_at
    return analysis_res


@router.post("/chat", response_model=AIChatResponse)
def chat_with_advisor(
    body: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    answer = generate_gemini_chat_answer(current_user.name, profile, body.question)
    return AIChatResponse(
        question=body.question,
        answer=answer
    )
