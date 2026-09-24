from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import FinancialProfile
from app.models.snapshot import CreditSnapshot
from app.schemas.dashboard import (
    DashboardDataResponse,
    ScoreHistoryItem,
    UtilizationBreakdown,
    SnapshotDelta
)
from app.core.security import get_current_user
from app.services.calculations import (
    calculate_dti,
    calculate_utilization,
    calculate_available_credit,
    compute_snapshot_delta
)
from app.services.insights import generate_insights

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardDataResponse)
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    snapshots = (
        db.query(CreditSnapshot)
        .filter(CreditSnapshot.user_id == current_user.id)
        .order_by(CreditSnapshot.created_at.asc())
        .all()
    )

    score_history: List[ScoreHistoryItem] = []
    for snap in snapshots:
        date_str = snap.created_at.strftime("%b %d") if snap.created_at else "Entry"
        score_history.append(ScoreHistoryItem(
            id=snap.id,
            date=date_str,
            score=snap.credit_score,
            dti=snap.dti,
            utilization=snap.utilization,
            debt=snap.outstanding_debt
        ))

    if not profile:
        return DashboardDataResponse(
            user_name=current_user.name,
            has_profile=False,
            score_history=score_history,
            insights=generate_insights(None, score_history)
        )

    dti = calculate_dti(profile.monthly_debt, profile.monthly_income)
    utilization = calculate_utilization(profile.outstanding_credit, profile.credit_limit)
    available_credit = calculate_available_credit(profile.credit_limit, profile.outstanding_credit)

    util_breakdown = UtilizationBreakdown(
        credit_limit=profile.credit_limit,
        used_credit=profile.outstanding_credit,
        available_credit=available_credit,
        utilization_percentage=utilization
    )

    insights = generate_insights(profile, score_history)

    # Compute delta relative to previous snapshot
    prev_snapshot = snapshots[-2] if len(snapshots) >= 2 else None
    delta_data = compute_snapshot_delta(
        profile.credit_score,
        utilization,
        dti,
        profile.monthly_debt,
        prev_snapshot
    )
    delta = SnapshotDelta(**delta_data)

    return DashboardDataResponse(
        user_name=current_user.name,
        has_profile=True,
        credit_score=profile.credit_score,
        utilization=utilization,
        dti=dti,
        monthly_debt=profile.monthly_debt,
        available_credit=available_credit,
        financial_goal=profile.financial_goal,
        score_history=score_history,
        utilization_breakdown=util_breakdown,
        insights=insights,
        delta=delta
    )
