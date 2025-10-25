from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from src.db import get_db
from src.schemas.user import UserCreate, UserOut, LoginIn, TokenOut
from src.models.user import User
from src.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()

    # Early check to return 409 instead of a 500 from the DB
    exists = db.scalar(select(User).where(User.email == email))
    if exists:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=email,
        display_name=payload.display_name or email.split("@")[0],
        hashed_password=hash_password(payload.password),
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        # If a unique index caught it first
        raise HTTPException(status_code=409, detail="Email already registered")

    return UserOut(id=user.id, email=user.email, display_name=user.display_name)

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(user.id))
    return TokenOut(access_token=token, token_type="bearer")
