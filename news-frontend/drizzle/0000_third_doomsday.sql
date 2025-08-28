CREATE TABLE "news_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(512),
	"author" varchar(255),
	"description" text,
	"url" text,
	"image_url" text,
	"source" varchar(255),
	"category" varchar(255),
	"language" varchar(10),
	"country" varchar(10),
	"published_at" date,
	CONSTRAINT "news_articles_url_unique" UNIQUE("url")
);
