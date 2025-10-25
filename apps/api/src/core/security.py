from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
import hashlib
from src.core.config import settings


def hash_password(password: str) -> str:
    # Simple hash for development - replace with proper bcrypt in production
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    # Simple hash verification for development
    return hashlib.sha256(password.encode()).hexdigest() == hashed


def create_access_token(sub: str, expires_minutes: Optional[int] = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes or settings.JWT_EXPIRES_MINUTES)
    to_encode = {"sub": sub, "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])