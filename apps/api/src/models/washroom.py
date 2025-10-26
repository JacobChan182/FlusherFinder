import uuid
from typing import List, Optional, Any
from sqlalchemy import String, Text, ForeignKey, Integer, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base

class Washroom(Base):
    __tablename__ = "washrooms"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    address: Mapped[Optional[str]] = mapped_column(String(300))

    # latitude and longitude instead of geography (PostGIS not installed)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)

    city: Mapped[Optional[str]] = mapped_column(String(100))
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    price: Mapped[Optional[str]] = mapped_column(String(50))

    created_by: Mapped[Optional[str]] = mapped_column(String, ForeignKey("users.id", ondelete="SET NULL"))

    reviews: Mapped[List["Review"]] = relationship(
        "Review", back_populates="washroom", cascade="all, delete-orphan"
    )
    creator: Mapped[Optional["User"]] = relationship("User", back_populates="washrooms")

    amenities = relationship("Amenity", secondary="washroom_amenities", back_populates="washrooms")

