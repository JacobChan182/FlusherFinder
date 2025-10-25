from sqlalchemy import Column, Text, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import text
from geoalchemy2 import Geography
from app.db.base import Base

class Washroom(Base):
    __tablename__ = "washrooms"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(Text, nullable=False)
    address = Column(Text)
    city = Column(Text)
    is_public = Column(Boolean, server_default="true", nullable=False)
    amenities_json = Column(JSON)
    location = Column(Geography(geometry_type="POINT", srid=4326), nullable=False)
