# Global News Insights

## Project Overview

This project provides a comprehensive news application, featuring a robust backend for article management (scraping, storage, and API serving) and a dynamic frontend for display, sorting, and filtering of news articles.

## Features

### Frontend (Next.js)
* **Modern UI:** Professional and responsive design using Tailwind CSS.
* **Header with Gradient:** Visually appealing header.
* **Dynamic News Display:** Fetches and displays news articles in a grid layout.
* **Pagination:** Navigate through news articles page by page.
* **Sort Functionality:** Sort articles by:
    * Date (Latest first)
    * Title (A-Z)
* **Filter Functionality:** Filter articles by:
    * Category
    * Language
    * Publication Date
* **Interactive News Cards:** Each article is presented in a card with image, title, description, author, date, and a "Read More" link.
* **Image Fallback:** Displays a default image if an article's image URL is broken or missing.

### Backend (FastAPI)
* **RESTful API:** Provides endpoints for fetching news articles.
* **Database Integration:** Uses SQLAlchemy to interact with a PostgreSQL database.
* **Data Models:** Defines models for news articles.
* **CRUD Operations:** Functions for retrieving articles.
* **Specific Endpoints for Sorting/Filtering:** Dedicated routes for latest articles, articles by title, category, language, and date.
* **CORS Configuration:** Allows frontend applications from specified origins to access the API.

## Technologies Used

### Frontend
* **Next.js:** React framework for building web applications.
* **React:** JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **`react-datepicker`:** A React component for a flexible and customizable date picker.

### Backend
* **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
* **SQLAlchemy:** Python SQL toolkit and Object Relational Mapper (ORM).
* **PostgreSQL:** Robust, open-source relational database.
* **Uvicorn:** ASGI server for running FastAPI applications.
* **`python-dotenv`:** For managing environment variables.
* **`psycopg2-binary`:** PostgreSQL adapter for Python.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (LTS version recommended) & **npm** (or yarn)
* **Python 3.8+**
* **pip** (Python package installer)
* **Git**
* **PostgreSQL** (running locally or accessible remotely)

## Deployments
* 

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name