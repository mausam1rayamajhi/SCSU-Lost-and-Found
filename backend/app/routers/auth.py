# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from .. import models, schemas
from ..auth import hash_password, verify_password, create_access_token
from ..config import settings


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.
    - Fails with 400 if email already exists (either in our check or via DB constraint).
    """
    # Optional: early check in Python
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hash_password(user_in.password),
        role=models.UserRole.STUDENT,  # default role
    )

    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        # Covers race conditions or existing unique constraint violations
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

    db.refresh(user)
    return user

@router.post("/register-admin", response_model=schemas.UserOut)
def register_admin(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    admin_setup_token: str = Header(..., alias="X-Admin-Setup-Token"),
):
    """
    Create an admin user. Protected by a secret header.
    Only you (who know the token) can call this.
    """
    if admin_setup_token != settings.ADMIN_SETUP_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid admin setup token")

    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hash_password(user_in.password),
        role=models.UserRole.ADMIN,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Log a user in with email + password, return JWT token.
    (You can switch schemas.UserCreate -> schemas.LoginRequest if you define a separate schema.)
    """
    user = db.query(models.User).filter(models.User.email == form_data.email).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(user_id=user.id, role=user.role)
    return {"access_token": access_token, "token_type": "bearer"}
