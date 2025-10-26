from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ReviewCreate(BaseModel):
    washroom_id: str
    rating: float = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: str
    washroom_id: str
    user_id: str
    rating: float
    comment: str | None