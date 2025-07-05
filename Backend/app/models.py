from sqlalchemy import Column, Integer, String, Text, Date
from .database import Base # Assuming this import is correct for your project

class Article(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True) # Added length for VARCHAR
    author = Column(String(255), nullable=True) # Added length, kept nullable
    description = Column(Text, index=True) # Text is fine for long descriptions
    url = Column(String(2048), index=True) # URLs can be long, common max is 2048
    image_url = Column(String(2048), index=True) # Image URLs can also be long
    source = Column(String(255), index=True)
    category = Column(String(255), index=True)
    language = Column(String(50), index=True) # Languages are usually short codes
    country = Column(String(50), index=True) # Countries are usually short codes
    published_at = Column(Date, index=True) # Date is correct for date only