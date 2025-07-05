export interface NewsArticle {
  id: string | number; // Adjust based on your actual ID type
  title: string;
  author: string | null;
  description: string | null;
  url: string;
  image_url: string | null;
  source: string;
  category: string;
  language: string;
  country: string;
  published_at: string; // Keep as string for direct API response, parse to Date for sorting
}

// Interface for the expected API response structure
export interface ApiResponse {
  articles: NewsArticle[];
  total: number;
}