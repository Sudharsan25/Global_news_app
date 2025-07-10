from pydantic import BaseModel
from datetime import date
from typing import Optional 

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