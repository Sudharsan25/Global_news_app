# crud.py

from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_
from models import Article
from datetime import date
from typing import Optional

def get_articles_dynamic(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    sort_by: Optional[str] = None,
    sort_order: str = "desc",
    category: Optional[str] = None,
    language: Optional[str] = None,
    publication_date: Optional[date] = None,
    search: Optional[str] = None,
):
    # Start with a base query
    query = db.query(Article)

    # 1. DYNAMIC FILTERING
    # Apply filters only if they are provided
    if category:
        query = query.filter(Article.category == category)
    if language:
        query = query.filter(Article.language == language)
    if publication_date:
        query = query.filter(Article.published_at == publication_date)
    if search:
        # Case-insensitive search in title and description
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Article.title.ilike(search_term),
                Article.description.ilike(search_term),
            )
        )

    # 2. DYNAMIC SORTING
    if sort_by:
        # Map user-friendly sort names to the actual database model columns
        sortable_columns = {
            "date": Article.published_at,
            "title": Article.title,
            "category": Article.category,
        }
        sort_column = sortable_columns.get(sort_by)

        if sort_column is not None:
            if sort_order == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
    else:
        # Default sort order if nothing is specified
        query = query.order_by(desc(Article.published_at))


    # Get the total count of items that match the filters *before* applying pagination
    total_items = query.count()

    # 3. PAGINATION
    paginated_results = query.offset(skip).limit(limit).all()

    # Return a dictionary with both the data and the total count
    return {"total_items": total_items, "data": paginated_results}

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()