# main.py

from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

import crud
import models
import schemas
from database import get_db, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Your CORS configuration remains the same
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://news-frontend-pi.vercel.app",
    "https://news-frontend-jxjqe5i9l-sudharsan-senthil-kumars-projects.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REMOVED all old /articles/* routes. They are replaced by the one below.

@app.get("/articles/", response_model=schemas.PaginatedArticleResponse)
def read_all_articles(
    db: Session = Depends(get_db),
    # Pagination parameters
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),

    # Sorting parameters
    sort_by: Optional[str] = Query("date", enum=["date", "title", "category"], description="Field to sort by"),
    sort_order: str = Query("desc", enum=["asc", "desc"], description="Sort order"),

    # Filtering parameters
    category: Optional[str] = Query(None, description="Filter by category"),
    language: Optional[str] = Query(None, min_length=2, max_length=2, description="Filter by 2-letter language code (e.g., 'en')"),
    publication_date: Optional[date] = Query(None, description="Filter by publication date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search term in title and description")
):
    """
    Retrieves a list of articles with dynamic filtering, sorting, and pagination.
    - **sort_by**: 'date', 'title', 'category'
    - **sort_order**: 'asc', 'desc'
    """
    articles_response = crud.get_articles_dynamic(
        db=db,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order,
        category=category,
        language=language,
        publication_date=publication_date,
        search=search,
    )
    return articles_response