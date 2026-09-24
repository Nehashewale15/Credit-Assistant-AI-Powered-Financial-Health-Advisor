from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.user import User
from app.models.snapshot import CreditSnapshot
from app.models.profile import FinancialProfile
from app.schemas.dashboard import ScoreHistoryItem, SnapshotDelta
from app.core.security import get_current_user
from app.services.calculations import (
    calculate_dti,
    calculate_utilization,
    compute_snapshot_delta
)

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])

@router.get("")
def get_progress_data(
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

    history: List[ScoreHistoryItem] = []
    for snap in snapshots:
        date_str = snap.created_at.strftime("%b %d, %Y") if snap.created_at else "Snapshot"
        history.append(ScoreHistoryItem(
            id=snap.id,
            date=date_str,
            score=snap.credit_score,
            dti=snap.dti,
            utilization=snap.utilization,
            debt=snap.outstanding_debt
        ))

    delta = None
    if profile and len(snapshots) >= 1:
        prev_snapshot = snapshots[-2] if len(snapshots) >= 2 else None
        dti = calculate_dti(profile.monthly_debt, profile.monthly_income)
        utilization = calculate_utilization(profile.outstanding_credit, profile.credit_limit)
        delta_data = compute_snapshot_delta(
            profile.credit_score,
            utilization,
            dti,
            profile.monthly_debt,
            prev_snapshot
        )
        delta = SnapshotDelta(**delta_data)

    return {
        "snapshots_count": len(snapshots),
        "history": history,
        "delta": delta,
        "current_score": profile.credit_score if profile else None,
        "current_utilization": calculate_utilization(profile.outstanding_credit, profile.credit_limit) if profile else None,
        "current_dti": calculate_dti(profile.monthly_debt, profile.monthly_income) if profile else None,
        "current_debt": profile.monthly_debt if profile else None
    }
