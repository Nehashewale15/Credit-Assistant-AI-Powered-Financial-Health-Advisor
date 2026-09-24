from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database.connection import get_db
from app.models.user import User
from app.models.profile import FinancialProfile
from app.models.snapshot import CreditSnapshot
from app.schemas.profile import ProfileCreateOrUpdate, ProfileResponse
from app.core.security import get_current_user
from app.services.calculations import calculate_dti, calculate_utilization, calculate_available_credit

router = APIRouter(prefix="/financial-profile", tags=["Financial Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial profile not found. Please complete initial setup."
        )
    
    dti = calculate_dti(profile.monthly_debt, profile.monthly_income)
    utilization = calculate_utilization(profile.outstanding_credit, profile.credit_limit)
    available = calculate_available_credit(profile.credit_limit, profile.outstanding_credit)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        credit_score=profile.credit_score,
        monthly_income=profile.monthly_income,
        monthly_expenses=profile.monthly_expenses,
        monthly_debt=profile.monthly_debt,
        credit_limit=profile.credit_limit,
        outstanding_credit=profile.outstanding_credit,
        missed_payments=profile.missed_payments,
        financial_goal=profile.financial_goal,
        dti=dti,
        utilization=utilization,
        available_credit=available,
        updated_at=profile.updated_at
    )

@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_in: ProfileCreateOrUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists. Use PUT to update your financial details."
        )
    
    profile = FinancialProfile(
        user_id=current_user.id,
        credit_score=profile_in.credit_score,
        monthly_income=profile_in.monthly_income,
        monthly_expenses=profile_in.monthly_expenses,
        monthly_debt=profile_in.monthly_debt,
        credit_limit=profile_in.credit_limit,
        outstanding_credit=profile_in.outstanding_credit,
        missed_payments=profile_in.missed_payments,
        financial_goal=profile_in.financial_goal
    )
    db.add(profile)

    # Perform backend financial calculations
    dti = calculate_dti(profile_in.monthly_debt, profile_in.monthly_income)
    utilization = calculate_utilization(profile_in.outstanding_credit, profile_in.credit_limit)

    # Create initial credit snapshot record
    snapshot = CreditSnapshot(
        user_id=current_user.id,
        credit_score=profile_in.credit_score,
        dti=dti,
        utilization=utilization,
        outstanding_debt=profile_in.monthly_debt,
        monthly_income=profile_in.monthly_income,
        created_at=datetime.now(timezone.utc)
    )
    db.add(snapshot)
    db.commit()
    db.refresh(profile)

    available = calculate_available_credit(profile.credit_limit, profile.outstanding_credit)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        credit_score=profile.credit_score,
        monthly_income=profile.monthly_income,
        monthly_expenses=profile.monthly_expenses,
        monthly_debt=profile.monthly_debt,
        credit_limit=profile.credit_limit,
        outstanding_credit=profile.outstanding_credit,
        missed_payments=profile.missed_payments,
        financial_goal=profile.financial_goal,
        dti=dti,
        utilization=utilization,
        available_credit=available,
        updated_at=profile.updated_at
    )

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileCreateOrUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        # If not exists, create
        return create_profile(profile_in, current_user, db)
    
    profile.credit_score = profile_in.credit_score
    profile.monthly_income = profile_in.monthly_income
    profile.monthly_expenses = profile_in.monthly_expenses
    profile.monthly_debt = profile_in.monthly_debt
    profile.credit_limit = profile_in.credit_limit
    profile.outstanding_credit = profile_in.outstanding_credit
    profile.missed_payments = profile_in.missed_payments
    profile.financial_goal = profile_in.financial_goal
    profile.updated_at = datetime.now(timezone.utc)

    # Recalculate metrics
    dti = calculate_dti(profile_in.monthly_debt, profile_in.monthly_income)
    utilization = calculate_utilization(profile_in.outstanding_credit, profile_in.credit_limit)

    # Automatically record new historical snapshot on update
    snapshot = CreditSnapshot(
        user_id=current_user.id,
        credit_score=profile_in.credit_score,
        dti=dti,
        utilization=utilization,
        outstanding_debt=profile_in.monthly_debt,
        monthly_income=profile_in.monthly_income,
        created_at=datetime.now(timezone.utc)
    )
    db.add(snapshot)
    db.commit()
    db.refresh(profile)

    available = calculate_available_credit(profile.credit_limit, profile.outstanding_credit)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        credit_score=profile.credit_score,
        monthly_income=profile.monthly_income,
        monthly_expenses=profile.monthly_expenses,
        monthly_debt=profile.monthly_debt,
        credit_limit=profile.credit_limit,
        outstanding_credit=profile.outstanding_credit,
        missed_payments=profile.missed_payments,
        financial_goal=profile.financial_goal,
        dti=dti,
        utilization=utilization,
        available_credit=available,
        updated_at=profile.updated_at
    )
