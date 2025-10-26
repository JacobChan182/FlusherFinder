from sqlalchemy import String, Integer, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base


washroom_amenities = Table(
    "washroom_amenities",
    Base.metadata,
    Column("washroom_id", String, ForeignKey("washrooms.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_code", String(50), ForeignKey("amenities.code", ondelete="CASCADE"), primary_key=True),
)


class Amenity(Base):
    __tablename__ = "amenities"
    code: Mapped[str] = mapped_column(String(50), primary_key=True)
    label: Mapped[str] = mapped_column(String(120))

    washrooms = relationship("Washroom", secondary=washroom_amenities, back_populates="amenities")