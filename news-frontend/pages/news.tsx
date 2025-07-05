// pages/news.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import NewsCard from '../components/NewsCard';
import Head from 'next/head';
import { NewsArticle } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Type for the active sort/filter state
type ActiveFilter = {
  type: 'category' | 'language' | 'date' | 'none';
  value: string | Date | null;
};

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]); // Articles for current page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9; // 3 rows * 3 columns

  // State for Sorting
  const [sortMethod, setSortMethod] = useState<'date_latest' | 'title_az' | 'none'>('date_latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // State for Filtering
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({ type: 'none', value: null });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // State for dynamic filter options
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- Main data fetching logic ---
  useEffect(() => {
    const fetchArticles = async () => {
      let fetchUrl = `${apiUrl}/articles/`; // Default base URL
      let data: NewsArticle[] = [];

      try {
        // --- Determine the correct API endpoint based on sort/filter state ---
        if (activeFilter.type === 'category' && typeof activeFilter.value === 'string' && activeFilter.value) {
          fetchUrl = `${apiUrl}/articles/category/${activeFilter.value}`;
        } else if (activeFilter.type === 'language' && typeof activeFilter.value === 'string' && activeFilter.value) {
          fetchUrl = `${apiUrl}/articles/by-language/${activeFilter.value}`;
        } else if (activeFilter.type === 'date' && activeFilter.value instanceof Date && activeFilter.value) {
          const formattedDate = activeFilter.value.toISOString().split('T')[0];
          fetchUrl = `${apiUrl}/articles/date/${formattedDate}`;
        } else if (sortMethod === 'date_latest') {
          fetchUrl = `${apiUrl}/articles/latest/`;
        } else if (sortMethod === 'title_az') {
          fetchUrl = `${apiUrl}/articles/by-title/`;
        } else {
          // If no specific sort/filter, use the base paginated endpoint
          fetchUrl = `${apiUrl}/articles?skip=${(currentPage - 1) * articlesPerPage}&limit=${articlesPerPage}`;
        }

        console.log(`Fetching from: ${fetchUrl}`);
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        console.log("API Response data:", data);

        if (Array.isArray(data)) {
          setArticles(data); // Store all fetched articles (potentially all filtered/sorted articles)

          // Extract unique categories and languages from ALL fetched data
          const categories = new Set<string>();
          const languages = new Set<string>();
          data.forEach(article => {
            if (article.category) categories.add(article.category);
            if (article.language) languages.add(article.language);
          });
          setAllCategories(Array.from(categories).sort());
          setAllLanguages(Array.from(languages).sort());

          // Handle client-side pagination for specific sort/filter routes
          // The total pages calculation here assumes the API returns ALL relevant articles
          // when a specific filter/sort endpoint is hit.
          setTotalPages(Math.ceil(data.length / articlesPerPage));

        } else {
          console.error("API response is not an array:", data);
          setArticles([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching news articles:", error);
        setArticles([]);
        setTotalPages(1);
      }
    };

    fetchArticles();
  }, [sortMethod, activeFilter, apiUrl]); // Trigger fetch on sort/filter change


  // --- Client-side pagination logic for `displayedArticles` ---
  useEffect(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    setDisplayedArticles(articles.slice(startIndex, endIndex));
  }, [articles, currentPage, articlesPerPage]); // Re-slice whenever articles or page changes


  // --- Handlers ---
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSortChange = (method: 'date_latest' | 'title_az') => {
    setSortMethod(method);
    setActiveFilter({ type: 'none', value: null }); // Clear filters on sort change
    setCurrentPage(1); // Reset to first page
    setShowSortDropdown(false);
  };

  const handleFilterChange = (type: ActiveFilter['type'], value: ActiveFilter['value']) => {
    setActiveFilter({ type, value });
    setSortMethod('none'); // Clear sort on filter change (you might adjust this logic)
    setCurrentPage(1); // Reset to first page
    setShowFilterDropdown(false);
  };

  const clearFilters = () => {
    setActiveFilter({ type: 'none', value: null });
    setSortMethod('date_latest'); // Revert to default sort
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // Memoized text for buttons
  const sortButtonText = useMemo(() => {
    if (sortMethod === 'date_latest') return 'Sort by: Date (Latest)';
    if (sortMethod === 'title_az') return 'Sort by: Title (A-Z)';
    return 'Sort By';
  }, [sortMethod]);

  const filterButtonText = useMemo(() => {
    let text = 'Filter By';
    if (activeFilter.type === 'category' && activeFilter.value) {
      text += `: Category (${activeFilter.value})`;
    } else if (activeFilter.type === 'language' && activeFilter.value) {
      text += `: Language (${activeFilter.value})`;
    } else if (activeFilter.type === 'date' && activeFilter.value instanceof Date) {
      text += `: Date (${activeFilter.value.toLocaleDateString()})`;
    }
    return text;
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>News Articles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Professional Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 px-8 text-white shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Global News Insights
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Stay informed with the latest headlines and breaking stories.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Sort and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Sort Dropdown */}
          <div className="relative z-20"> {/* Higher z-index for dropdowns */}
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
            >
              {sortButtonText}
              <svg className={`ml-2 h-4 w-4 transform ${showSortDropdown ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {showSortDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                <button
                  onClick={() => handleSortChange('date_latest')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Date (Latest)
                </button>
                <button
                  onClick={() => handleSortChange('title_az')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Title (A-Z)
                </button>
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative z-10">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
            >
              {filterButtonText}
              <svg className={`ml-2 h-4 w-4 transform ${showFilterDropdown ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 px-4">
                <p className="text-sm font-semibold mb-2 text-gray-700">Filter Options</p>
                <div className="mb-3">
                  <label htmlFor="filter-category" className="block text-sm font-medium text-gray-600 mb-1">Category:</label>
                  <select
                    id="filter-category"
                    value={activeFilter.type === 'category' && typeof activeFilter.value === 'string' ? activeFilter.value : ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || null)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="filter-language" className="block text-sm font-medium text-gray-600 mb-1">Language:</label>
                  <select
                    id="filter-language"
                    value={activeFilter.type === 'language' && typeof activeFilter.value === 'string' ? activeFilter.value : ''}
                    onChange={(e) => handleFilterChange('language', e.target.value || null)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Languages</option>
                    {allLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="filter-date" className="block text-sm font-medium text-gray-600 mb-1">Date:</label>
                  <DatePicker
                    selected={activeFilter.type === 'date' && activeFilter.value instanceof Date ? activeFilter.value : null}
                    onChange={(date: Date | null) => handleFilterChange('date', date)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    placeholderText="Select a date"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
                <button
                  onClick={clearFilters}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>


        {displayedArticles.length === 0 && (activeFilter.type !== 'none' || sortMethod !== 'none') ? (
          <p className="text-center text-gray-600 text-lg py-8">No articles found matching your criteria.</p>
        ) : displayedArticles.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-8">Loading news or no articles available...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {displayedArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
                  currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Previous
              </button>
              <span className="text-lg font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages} // Now disabled when current page reaches calculated total pages
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
                  currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}