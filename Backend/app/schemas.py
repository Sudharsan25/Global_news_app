from pydantic import BaseModel
from datetime import date
from typing import Optional # Import Optional for nullable fields

class ArticleBase(BaseModel):
    title: str
    author: Optional[str] = None # Added Optional and default None for nullable column
    description: str
    url: Optional[str] = None
    image_url: Optional[str] = None
    source: str
    category: str
    language: str
    country: str
    published_at: date # Renamed to match SQLAlchemy model for consistency


class Article(ArticleBase):
    id: int

    class Config:
        from_attributes = True # Modern Pydantic V2+ uses from_attributes=True instead of orm_mode=True