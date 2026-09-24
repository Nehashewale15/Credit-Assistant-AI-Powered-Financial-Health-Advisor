from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.services.seed_service import seed_demo_user, DEMO_USER_EMAIL, DEMO_USER_PASSWORD

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email})
    return TokenResponse(
        access_token=access_token,
        user_name=new_user.name,
        user_email=new_user.email
    )

@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(
        access_token=access_token,
        user_name=user.name,
        user_email=user.email
    )

@router.post("/demo", response_model=TokenResponse)
def demo_login(db: Session = Depends(get_db)):
    demo_user = seed_demo_user(db)
    access_token = create_access_token(data={"sub": demo_user.email})
    return TokenResponse(
        access_token=access_token,
        user_name=demo_user.name,
        user_email=demo_user.email
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
