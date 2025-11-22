from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from .. import models, schemas
from ..auth import hash_password, verify_password, create_access_token

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
