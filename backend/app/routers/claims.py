from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..deps import get_current_user, require_admin

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/", response_model=schemas.ClaimOut)
def create_claim(
    claim_in: schemas.ClaimCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.Item).filter(models.Item.id == claim_in.item_id).first()
    if not item:
        raise HTTPException(404, "Item not found")
    claim = models.Claim(
        note=claim_in.note,
        item_id=item.id,
        claimer_id=current_user.id,
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim

@router.get("/me", response_model=List[schemas.ClaimOut])
def my_claims(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Claim)
        .filter(models.Claim.claimer_id == current_user.id)
        .order_by(models.Claim.created_at.desc())
        .all()
    )

@router.get("/", response_model=List[schemas.ClaimOut])
def list_all_claims(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    return db.query(models.Claim).order_by(models.Claim.created_at.desc()).all()

@router.patch("/{claim_id}/status", response_model=schemas.ClaimOut)
def update_claim_status(
    claim_id: int,
    body: schemas.ClaimUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(404, "Claim not found")
    claim.status = body.status
    # update item status if approved
    if body.status == models.ClaimStatus.APPROVED:
        claim.item.status = models.ItemStatus.CLAIMED
    db.commit()
    db.refresh(claim)
    return claim
