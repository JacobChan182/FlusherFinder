from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class WashroomStats(Base):
    __tablename__ = "washroom_stats"
    washroom_id = Column(UUID(as_uuid=True), ForeignKey("washrooms.id"), primary_key=True)
    ratings_count = Column(Integer, server_default="0", nullable=False)
    ratings_sum = Column(Integer, server_default="0", nullable=False)
    bayes_score = Column(Float, server_default="0", nullable=False)
    last_review_at = Column(DateTime(timezone=True))
