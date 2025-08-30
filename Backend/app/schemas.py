# schemas.py

from pydantic import BaseModel
from datetime import date
from typing import Optional, List # Make sure List is imported

class ArticleBase(BaseModel):
    title: str
    author: Optional[str] = None
    description: str
    url: Optional[str] = None
    image_url: Optional[str] = None
    source: str
    category: str
    language: str
    country: str
    published_at: date

class Article(ArticleBase):
    id: int

    class Config:
        from_attributes = True

# NEW: Schema for the paginated response
class PaginatedArticleResponse(BaseModel):
    total_items: int
    data: List[Article]