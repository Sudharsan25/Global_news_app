from airflow import DAG
from airflow.providers.http.operators.http import HttpOperator
from airflow.decorators import task
from airflow.providers.postgres.hooks.postgres import PostgresHook
from datetime import datetime, timedelta
import json

with DAG(
    dag_id = 'news_etl_pipeline',
    start_date = datetime(2025,6,1),
    schedule = "@daily",
    catchup = False,
) as dag:

    # Step 1: Create a table if it does not exist
    @task
    def create_news_table():
        pg_hook = PostgresHook(postgres_conn_id = 'news_postgres_conn')

        create_table_query = '''
        CREATE TABLE IF NOT EXISTS news_articles(
            id SERIAL PRIMARY KEY,
            title VARCHAR(512),
            author VARCHAR(255),
            description TEXT,
            url TEXT UNIQUE,
            image_url TEXT,
            source VARCHAR(255),
            category VARCHAR(255),
            language VARCHAR(10),
            country VARCHAR(10),
                published_at DATE
        );
        '''

        pg_hook.run(create_table_query)

    # Step 2: Fetch news data from the API

    fetch_news_data = HttpOperator(
        task_id = 'fetch_news_data',
        http_conn_id = 'news_api',
        endpoint = '/news',
        method = 'GET',
        data = {"access_key":"{{conn.news_api.extra_dejson.access_key}}"},
        response_filter = lambda response: json.loads(response.text),
        log_response = True,
    )

    # Step 3: Transform the news data
    @task
    def transform_news_data(response):
        articles_data = []
        for article in response.get('data', []): # MediaStack often wraps articles in a 'data' list
            published_at_str = article.get('published_at')
            published_date_obj = None
            if published_at_str:
                try:
                    # Example: "2024-06-26T12:30:00.000000Z"
                    published_date_obj = datetime.fromisoformat(published_at_str.replace('Z', '+00:00')).date()
                except ValueError:
                    # Handle cases where the date string might be malformed
                    print(f"Warning: Could not parse date: {published_at_str}")
                    published_date_obj = None # Or a default date like datetime(1900, 1, 1).date()

            news_article = {
                'title': article.get('title', "") or "",
                'author': article.get('author', "") or "Unknown",
                'description': article.get('description', ""),
                'url': article.get('url', "") or "" ,
                'image_url': article.get('image', "") or "",
                'published_at': published_date_obj, 
                'source': article.get('source', "")or "",
                'category': article.get('category', "") or "",
                'language': article.get('language', "")or "",
                'country': article.get('country', "")or ""
            }
            articles_data.append(news_article)
        return articles_data
    
    # Step 4: Load the transformed data into the PostgreSQL database
    @task
    def load_news_data(news_api_data):
        if not news_api_data: # Handle empty list if no articles were found
            print("No news data to load.")
            return

        postgres_hook = PostgresHook(postgres_conn_id='news_postgres_conn')

        target_table = "news_articles"

        target_columns = [
            "title", "author", "description", "url", "image_url",
             "source", "category", "language", "country","published_at"
        ]


        rows_to_insert = []
        for article in news_api_data:
            rows_to_insert.append([
                article['title'],
                article['author'],
                article['description'],
                article['url'],
                article['image_url'],
                
                article['source'],
                article['category'],
                article['language'],
                article['country'],
                article['published_at'],
            ])

        try:
            postgres_hook.insert_rows(
                table=target_table,
                rows=rows_to_insert,
                target_fields=target_columns # Optional, but good practice
            )
            print(f"Loaded {len(rows_to_insert)} news articles into PostgreSQL using insert_rows.")
        except Exception as e:
            print(f"Error inserting rows: {e}")
            raise e

    create_news_table_instance = create_news_table()

    create_news_table_instance >> fetch_news_data

    transformed_news_data = transform_news_data(fetch_news_data.output)

    load_news_data(transformed_news_data)