from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..deps import get_current_user

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=schemas.ItemOut)
def create_item(
    item_in: schemas.ItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.Item(
        **item_in.model_dump(),
        owner_id=current_user.id,
    )
    item.is_high_value = item.value_level in {models.ValueLevel.HIGH}
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/", response_model=List[schemas.ItemOut])
def list_items(
    db: Session = Depends(get_db),
    status: Optional[models.ItemStatus] = Query(None),
    category: Optional[str] = Query(None),
    value_level: Optional[models.ValueLevel] = Query(None),
    q: Optional[str] = Query(None),
    limit: int = 50,
):
    query = db.query(models.Item)
    if status:
        query = query.filter(models.Item.status == status)
    if category:
        query = query.filter(models.Item.category == category)
    if value_level:
        query = query.filter(models.Item.value_level == value_level)
    if q:
        like = f"%{q}%"
        query = query.filter(
            (models.Item.title.ilike(like))
            | (models.Item.description.ilike(like))
            | (models.Item.tags.ilike(like))
        )
    return query.order_by(models.Item.created_at.desc()).limit(limit).all()

@router.get("/{item_id}", response_model=schemas.ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(404, "Item not found")
    return item

@router.put("/{item_id}", response_model=schemas.ItemOut)
def update_item(
    item_id: int,
    item_in: schemas.ItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(404, "Item not found")
    # only admin or owner can update
    if current_user.role != models.UserRole.ADMIN and item.owner_id != current_user.id:
        raise HTTPException(403, "Not allowed")
    data = item_in.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(item, k, v)
    if "value_level" in data:
        item.is_high_value = data["value_level"] == models.ValueLevel.HIGH
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(404, "Item not found")
    if current_user.role != models.UserRole.ADMIN and item.owner_id != current_user.id:
        raise HTTPException(403, "Not allowed")
    # soft delete: mark as RESOLVED
    item.status = models.ItemStatus.RESOLVED
    db.commit()
    return {"detail": "Item marked as resolved"}
