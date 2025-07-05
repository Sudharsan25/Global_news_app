import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import Head from 'next/head';
import { NewsArticle } from '../types'; // Import the interface

export default function NewsPage() {
  console.log("NewsPage component rendering...");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9; // 3 rows * 3 columns

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  console.log(`API URL: ${apiUrl}`);

  useEffect(() => {
    console.log(`useEffect triggered for currentPage: ${currentPage}`);

    const fetchArticles = async () => {
      console.log(`Attempting to fetch articles for page: ${currentPage}...`);
      try {
        const fetchUrl = `${apiUrl}/articles/`;
        console.log(`Fetching from: ${fetchUrl}`);

        const response = await fetch(fetchUrl);
        console.log(`API Response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response data (raw):", data);

         // --- MODIFIED VALIDATION AND DATA HANDLING ---
        if (Array.isArray(data)) { // Check if 'data' itself is an array
          const fetchedArticles = data as NewsArticle[];

          // If your backend gives ALL articles, you need to manually paginate here
          const startIndex = (currentPage - 1) * articlesPerPage;
          const endIndex = startIndex + articlesPerPage;
          const paginatedArticles = fetchedArticles.slice(startIndex, endIndex);

          setArticles(paginatedArticles);
          setTotalPages(Math.ceil(fetchedArticles.length / articlesPerPage)); // Calculate total pages from fetched total articles
          console.log(`Articles set. Total fetched: ${paginatedArticles.length}. Total pages calculated: ${Math.ceil(fetchedArticles.length / articlesPerPage)}`);
        } else {
          console.error("API response is not a direct array of articles:", data);
          setArticles([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching news articles:", error);
        // You might want to set an error state here to display a message to the user
      }
    };

    fetchArticles();
  }, [currentPage, apiUrl, articlesPerPage]); // Added articlesPerPage to dependency array for completeness

  const handleNextPage = () => {
    console.log(`Next button clicked. Current page: ${currentPage}, Total pages: ${totalPages}`);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    console.log(`Previous button clicked. Current page: ${currentPage}`);
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>News Articles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Latest News</h1>

      {articles.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Loading news or no articles found...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">

            {articles.map((article) => {
              console.log(`Rendering NewsCard for article ID: ${article.id}, Title: ${article.title}`);
              return <NewsCard key={article.id} article={article} />;
            })}
          </div>

          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
                currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
                currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}