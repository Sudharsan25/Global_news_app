
import { db } from '@/db/client';
import { newsArticles } from '@/db/schema';

export async function GET() {
  try {
    const articles = await db.select().from(newsArticles).limit(100);
    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch news articles:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch articles" }),
      { status: 500 }
    );
  }
}