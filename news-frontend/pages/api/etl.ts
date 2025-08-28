// Path: pages/api/etl.ts or app/api/etl/route.ts

import { db } from '@/db/client';
import { newsArticles } from '@/db/schema';
import axios from 'axios';

// This is the function that will be called by your cron job service
export default async function handler(req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // --- 1. EXTRACT: Fetch data from the news API ---
    const response = await axios.get("http://api.mediastack.com/v1/news", {
      params: {
        access_key: process.env.NEWS_API_KEY,
      },
    });

    const rawArticles = response.data.data;

    // --- 2. TRANSFORM: Prepare the data for insertion ---
    const transformedArticles = rawArticles.map((article: any) => ({
      title: article.title || '',
      author: article.author || 'Unknown',
      description: article.description,
      url: article.url,
      imageUrl: article.image,
      publishedAt: article.published_at.split('T')[0], // Extract only the date part
      source: article.source,
      category: article.category,
      language: article.language,
      country: article.country,
    }));

    // --- 3. LOAD: Insert the data into Xata using Drizzle ---
    for (const article of transformedArticles) {
      await db.insert(newsArticles)
              .values(article)
              .onConflictDoUpdate({
                target: newsArticles.url,
                set: { title: article.title, description: article.description },
              });
    }

    return res.status(200).json({ message: 'ETL pipeline ran successfully' });
  } catch (error) {
    console.error('ETL Pipeline failed:', error);
    return res.status(500).json({ message: 'ETL Pipeline failed' });
  }
}