from app.database.connection import engine, Base, SessionLocal
from app.models import User, FinancialProfile, CreditSnapshot, AIAnalysis
from app.services.seed_service import seed_demo_user

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_user(db)
    finally:
        db.close()
