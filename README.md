# Global News Insights

## Project Overview

This project provides a comprehensive news application, featuring a robust backend for article management (Sorting, Filterting and Paginating) and a dynamic frontend for display, sorting, and filtering of news articles and The ETL pipeline has been re-engineered to leverage a modern, serverless-friendly stack for cost-efficiency and scalability.

---

## Features

* **Open Source API:** Serves as the initial data source for news articles. [Mediastack API](https://mediastack.com/documentation)
* **Apache Airflow:** Designed and implemented DAGs in ETL pipeline to fetch data from Open-source API and load them into Xata client (PostgresDB)
* **Xata (PostgreSQL):** A serverless data platform that provides a managed, scalable PostgreSQL database for storing and retrieving news articles. [Xata Docs](https://lite.xata.io/docs)
* **FastAPI:** Serves as the RESTful API, handling requests from the frontend, querying the PostgreSQL database, and handling sorting, filter and pagination functionalities, returning JSON data.
* **Next.js (Frontend):** Consumes the Next.js API backend to display, sort, and filter news articles for users.

### Frontend (Next.js)
* **News Display:** Fetches and displays news articles in a grid layout.
* **Pagination:** Navigate through news articles page by page.
* **Interactive News Cards:** Each article is presented in a card with image, title, description, author, date, and a "Read More" link.
* **Image Fallback:** Displays a default image if an article's image URL is broken or missing.

---

### Backend (FAST API)
* **RESTful API:** Provides endpoints for fetching news articles.
* **Dynamic function:**: The whole logic of sort and filter is handled dynamically under one function in FastAPI
* **Sort Functionality:** Sort articles by:
    * Date (Latest first)
    * Title (A-Z)
* **Filter Functionality:** Filter articles by:
    * Category
    * Language
    * Publication Date
* **Database Integration:** Uses **Drizzle ORM** to interact with a PostgreSQL database on Xata.
* **Data Models:** Defines models for news articles using Drizzle's schema definitions.
* **CRUD Operations:** Functions for retrieving articles.
* **Specific Endpoints for Sorting/Filtering:** Dedicated routes for latest articles, articles by title, category, language, and date.
* **CORS Configuration:** Allows frontend applications from specified origins to access the API.

---

## Technologies Used

### Frontend
* **Next.js:** React framework for building web applications.
* **React:** JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **`react-datepicker`:** A React component for a flexible and customizable date picker.

### Backend
* **FastAPI:** For building the RESTful API endpoints.
* **Drizzle ORM:** A TypeScript ORM for interacting with the database.
* **Xata:** A serverless data platform with a managed PostgreSQL database.
* **Apache Airflow** A data and AI platform for running the ETL pipeline.
* **`python-dotenv`:** For managing environment variables.
* **`pg`:** The PostgreSQL driver for Node.js.

---

## Deployments
* Frontend - [https://news-frontend-pi.vercel.app/](https://news-frontend-pi.vercel.app/)