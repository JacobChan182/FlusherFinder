from pydantic import BaseModel, Field
from typing import List


class ReviewCreate(BaseModel):
    washroom_id: str
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: str
    washroom_id: str
    user_id: str
    rating: int
    comment: str | None