from sqlalchemy import Column, Text, Integer, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import text
from app.db.base import Base

class Review(Base):
    __tablename__ = "reviews"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), nullable=False)  # wire to users later
    washroom_id = Column(UUID(as_uuid=True), ForeignKey("washrooms.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 (validate in router)
    text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    __table_args__ = (UniqueConstraint("user_id", "washroom_id"),)
