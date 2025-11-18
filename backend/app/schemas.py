from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

from .models import ItemStatus, ValueLevel, ClaimStatus, UserRole

# Auth

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int
    role: UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


# Item

class ItemBase(BaseModel):
    title: str
    description: str
    category: str
    location: str
    status: ItemStatus
    value_level: ValueLevel
    is_high_value: bool = False
    tags: Optional[str] = None
    image_url: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    status: Optional[ItemStatus] = None
    value_level: Optional[ValueLevel] = None
    is_high_value: Optional[bool] = None
    tags: Optional[str] = None
    image_url: Optional[str] = None

class ItemOut(ItemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    owner_id: Optional[int]

    class Config:
        from_attributes = True


# Claim

class ClaimBase(BaseModel):
    note: Optional[str] = None

class ClaimCreate(ClaimBase):
    item_id: int

class ClaimUpdate(BaseModel):
    status: ClaimStatus

class ClaimOut(ClaimBase):
    id: int
    status: ClaimStatus
    created_at: datetime
    updated_at: datetime
    item_id: int
    claimer_id: int

    class Config:
        from_attributes = True


# Admin dashboard summaries

class ClaimStatusSummary(BaseModel):
    status: ClaimStatus
    count: int

class CategoryCount(BaseModel):
    category: str
    count: int

class DashboardSummary(BaseModel):
    total_items: int
    total_claims: int
    items_by_category: List[CategoryCount]
    claims_by_status: List[ClaimStatusSummary]
