// Path: pages/api/etl.ts or app/api/etl/route.ts

import { db } from '@/db/client';
import { newsArticles } from '@/db/schema';
import axios from 'axios';

// This is the function that will be called by your cron job service
export default async function handler(req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }) {
  // Log the start of the request
  console.log(`Received ${req.method} request to /api/etl at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // --- 1. EXTRACT: Fetch data from the news API ---
    console.log("Attempting to fetch data from News API...");
    const response = await axios.get("http://api.mediastack.com/v1/news", {
      params: {
        access_key: process.env.NEWS_API_KEY,
      },
    });

    console.log(`Successfully fetched data. Response status: ${response.status}`);

    const rawArticles = response.data.data;
    console.log(`Fetched ${rawArticles.length} raw articles.`);

    if (!rawArticles || rawArticles.length === 0) {
      console.log("No articles to process. Exiting ETL pipeline.");
      return res.status(200).json({ message: 'No articles to process.' });
    }

    // --- 2. TRANSFORM: Prepare the data for insertion ---
    console.log("Starting data transformation...");
    const transformedArticles = rawArticles.map((article: any) => ({
      title: article.title || '',
      author: article.author || 'Unknown',
      description: article.description,
      url: article.url,
      imageUrl: article.image,
      publishedAt: article.published_at.split('T')[0],
      source: article.source,
      category: article.category,
      language: article.language,
      country: article.country,
    }));
    console.log("Transformation complete. Data is ready for loading.");

    // --- 3. LOAD: Insert the data into Xata using Drizzle ---
    console.log("Starting data loading into Xata database...");
    
    
    for (const article of transformedArticles) {
      try {
        const result = await db.insert(newsArticles)
          .values(article)
          .onConflictDoUpdate({
            target: newsArticles.url,
            set: { title: article.title, description: article.description },
          });

      } catch (dbError) {
        console.error(`Failed to insert/update article with URL: ${article.url}`, dbError);
      }
    }

    console.log(`Loading complete.`);

    return res.status(200).json({ message: 'ETL pipeline ran successfully' });
  } catch (error) {
    // Detailed error logging for the main try-catch block
    console.error('ETL Pipeline failed with a critical error.', error);
    
    // Check for an Axios-specific error to provide more detail
    if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:');
        console.error(`Status: ${error.response?.status}`);
        console.error(`Data: ${error.response?.data}`);
    }

    return res.status(500).json({ message: 'ETL Pipeline failed' });
  }
}