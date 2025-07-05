from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Your Next.js development server
    "http://localhost:8000",  # Your FastAPI development server (if needed)
    "https://news-frontend-pi.vercel.app/", # Your deployed Next.js frontend domain
    # Add other specific frontend domains if necessary
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.get("/articles/", response_model=List[schemas.Article])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all articles with pagination.
    """
    articles = crud.get_articles(db, skip=skip, limit=limit)
    return articles

@app.get("/articles/date/{publication_date}", response_model=List[schemas.Article])
def read_articles_by_date(publication_date: date, db: Session = Depends(get_db)):
    """
    Retrieve articles filtered by a specific publication date.
    """
    articles = crud.get_articles_by_date(db, publication_date=publication_date)
    if not articles:
        raise HTTPException(status_code=404, detail=f"No articles found for date {publication_date}")
    return articles

@app.get("/articles/category/{category}", response_model=List[schemas.Article])
def read_articles_by_category(category: str, db: Session = Depends(get_db)):
    """
    Retrieve articles filtered by a specific category.
    """
    articles = crud.get_articles_by_category(db, category=category)
    if not articles:
        raise HTTPException(status_code=404, detail=f"No articles found in category '{category}'")
    return articles

@app.get("/articles/latest/", response_model=List[schemas.Article])
def read_articles_latest(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve the latest articles, sorted by published date (descending).
    Defaults to 25 articles to reflect your requirement.
    """
    articles = crud.get_articles_sorted_by_date_latest(db, skip=skip, limit=limit)
    return articles

@app.get("/articles/by-title/", response_model=List[schemas.Article])
def read_articles_by_title(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve articles sorted by title (A-Z).
    """
    articles = crud.get_articles_sorted_by_title_asc(db, skip=skip, limit=limit)
    return articles

@app.get("/articles/by-language/{language_code}/", response_model=List[schemas.Article])
def read_articles_by_language(
    language_code: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve articles filtered by a specific language code (e.g., 'en', 'es').
    """
    articles = crud.get_articles_by_language(db, language=language_code, skip=skip, limit=limit)
    if not articles:
        raise HTTPException(status_code=404, detail=f"No articles found for language '{language_code}'")
    return articles