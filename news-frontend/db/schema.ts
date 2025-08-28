import { pgTable, serial, text, varchar, date } from 'drizzle-orm/pg-core';

export const newsArticles = pgTable('news_articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 512 }),
  author: varchar('author', { length: 255 }),
  description: text('description'),
  url: text('url').unique(),
  imageUrl: text('image_url'),
  source: varchar('source', { length: 255 }),
  category: varchar('category', { length: 255 }),
  language: varchar('language', { length: 10 }),
  country: varchar('country', { length: 10 }),
  publishedAt: date('published_at'),
});