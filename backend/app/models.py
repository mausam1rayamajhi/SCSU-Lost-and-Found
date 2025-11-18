from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"

class ItemStatus(str, enum.Enum):
    LOST = "lost"
    FOUND = "found"
    CLAIMED = "claimed"
    RESOLVED = "resolved"

class ValueLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", back_populates="owner")
    claims = relationship("Claim", back_populates="claimer")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(Enum(ItemStatus), default=ItemStatus.LOST, nullable=False)
    value_level = Column(Enum(ValueLevel), default=ValueLevel.LOW, nullable=False)
    is_high_value = Column(Boolean, default=False)

    image_url = Column(String(500), nullable=True)
    tags = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # person who reported
    owner = relationship("User", back_populates="items")

    claims = relationship("Claim", back_populates="item")

class ClaimStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    note = Column(Text, nullable=True)
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    claimer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    item = relationship("Item", back_populates="claims")
    claimer = relationship("User", back_populates="claims")
