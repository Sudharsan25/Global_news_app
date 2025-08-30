from sqlalchemy import Column, Integer, String, Text, Date
from database import Base 

class Article(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True) 
    author = Column(String(255), nullable=True) 
    description = Column(Text, index=True) 
    url = Column(String(2048), index=True) 
    image_url = Column(String(2048), index=True) 
    source = Column(String(255), index=True)
    category = Column(String(255), index=True)
    language = Column(String(50), index=True) 
    country = Column(String(50), index=True)
    published_at = Column(Date, index=True) 