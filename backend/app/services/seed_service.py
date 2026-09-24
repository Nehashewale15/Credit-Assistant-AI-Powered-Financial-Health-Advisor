from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import FinancialProfile
from app.models.snapshot import CreditSnapshot
from app.core.security import hash_password

DEMO_USER_EMAIL = "aarav@example.com"
DEMO_USER_PASSWORD = "demo123password"

def seed_demo_user(db: Session) -> User:
    existing_user = db.query(User).filter(User.email == DEMO_USER_EMAIL).first()
    if existing_user:
        return existing_user

    # 1. Create Demo User
    demo_user = User(
        name="Aarav Sharma",
        email=DEMO_USER_EMAIL,
        hashed_password=hash_password(DEMO_USER_PASSWORD),
        created_at=datetime.now(timezone.utc) - timedelta(days=60)
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    # 2. Create Financial Profile
    profile = FinancialProfile(
        user_id=demo_user.id,
        credit_score=650,
        monthly_income=40000.0,
        monthly_expenses=15000.0,
        monthly_debt=10000.0,
        credit_limit=100000.0,
        outstanding_credit=60000.0,
        missed_payments=1,
        financial_goal="Reduce debt",
        updated_at=datetime.now(timezone.utc)
    )
    db.add(profile)

    # 3. Create 3 Historical Snapshots
    now = datetime.now(timezone.utc)
    snapshots = [
        CreditSnapshot(
            user_id=demo_user.id,
            credit_score=620,
            dti=30.0,
            utilization=70.0,
            outstanding_debt=12000.0,
            monthly_income=40000.0,
            created_at=now - timedelta(days=60)
        ),
        CreditSnapshot(
            user_id=demo_user.id,
            credit_score=635,
            dti=27.5,
            utilization=65.0,
            outstanding_debt=11000.0,
            monthly_income=40000.0,
            created_at=now - timedelta(days=30)
        ),
        CreditSnapshot(
            user_id=demo_user.id,
            credit_score=650,
            dti=25.0,
            utilization=60.0,
            outstanding_debt=10000.0,
            monthly_income=40000.0,
            created_at=now
        ),
    ]
    db.add_all(snapshots)
    db.commit()
    return demo_user
