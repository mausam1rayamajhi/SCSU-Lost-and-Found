from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from .. import models, schemas
from ..deps import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard", response_model=schemas.DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    total_items = db.query(func.count(models.Item.id)).scalar() or 0
    total_claims = db.query(func.count(models.Claim.id)).scalar() or 0

    items_by_category = (
        db.query(models.Item.category, func.count(models.Item.id))
        .group_by(models.Item.category)
        .all()
    )
    claims_by_status = (
        db.query(models.Claim.status, func.count(models.Claim.id))
        .group_by(models.Claim.status)
        .all()
    )

    return schemas.DashboardSummary(
        total_items=total_items,
        total_claims=total_claims,
        items_by_category=[
            schemas.CategoryCount(category=cat, count=cnt)
            for cat, cnt in items_by_category
        ],
        claims_by_status=[
            schemas.ClaimStatusSummary(status=status, count=cnt)
            for status, cnt in claims_by_status
        ],
    )
