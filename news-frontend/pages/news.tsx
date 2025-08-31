import { useState, useEffect, useMemo } from 'react';
import NewsCard from '../components/NewsCard';
import Head from 'next/head';
import { NewsArticle } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


// --- Skeleton Component for a single card ---
const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        {/* Image Placeholder */}
        <div className="bg-gray-300 h-48 w-full"></div>
        <div className="p-6">
            {/* Title Placeholder */}
            <div className="bg-gray-300 h-6 rounded w-3/4 mb-4"></div>
            {/* Text Placeholder */}
            <div className="bg-gray-300 h-4 rounded w-full mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-5/6"></div>
        </div>
    </div>
);

// --- Component to render the grid of skeletons ---
const LoadingState = ({ count = 9 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);


export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const articlesPerPage = 9; 

    // Sort & Filter State
    const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'category'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const [categoryFilter, setCategoryFilter] = useState('');
    const [languageFilter, setLanguageFilter] = useState('');
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI State for dropdowns
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // State for dynamic filter options (this can remain as is)
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [allLanguages, setAllLanguages] = useState<string[]>([]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';


    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            
            // Use URLSearchParams to easily build the query string
            const params = new URLSearchParams();

            // 1. Pagination
            params.append('limit', String(articlesPerPage));
            params.append('skip', String((currentPage - 1) * articlesPerPage));

            // 2. Sorting
            if (sortBy) {
                params.append('sort_by', sortBy);
                params.append('sort_order', sortOrder);
            }

            // 3. Filtering
            if (categoryFilter) params.append('category', categoryFilter);
            if (languageFilter) params.append('language', languageFilter);
            if (dateFilter) params.append('publication_date', dateFilter.toISOString().split('T')[0]);
            if (searchQuery) params.append('search', searchQuery);
            
            const fetchUrl = `${apiUrl}/articles/?${params.toString()}`;
            console.log(`Fetching from: ${fetchUrl}`);

            try {
                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // The API now returns an object: { total_items: number, data: [...] }
                const result = await response.json();
                
                setArticles(result.data);
                setTotalPages(Math.ceil(result.total_items / articlesPerPage));

                // Note: This logic for categories/languages is okay, but it only shows
                // options from the *entire* dataset on the first load if no filters are active.
                // A dedicated API endpoint would be the next improvement.
                if (currentPage === 1 && !categoryFilter && !languageFilter && !dateFilter && !searchQuery) {
                    const categories = new Set<string>();
                    const languages = new Set<string>();
                    result?.data?.forEach((article: NewsArticle) => {
                        if (article.category) categories.add(article.category);
                        if (article.language) languages.add(article.language);
                    });
                    setAllCategories(Array.from(categories).sort());
                    setAllLanguages(Array.from(languages).sort());
                }

            } catch (error) {
                console.error("Error fetching news articles:", error);
                setArticles([]);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage, sortBy, sortOrder, categoryFilter, languageFilter, dateFilter, searchQuery, apiUrl]);

    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

const handleSortChange = (newSortBy: string) => {
    if (newSortBy === 'title') {
        setSortBy('title');
        setSortOrder('asc');
    } else { // Default to date descending
        setSortBy('date');
        setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page on sort change
    setShowSortDropdown(false);
};

const handleFilterChange = <T extends string | Date | null>(setter: React.Dispatch<React.SetStateAction<any>>, value: T) => {
    setter(value);
    setCurrentPage(1); // Reset to first page on filter change
};

const clearFilters = () => {
    setCategoryFilter('');
    setLanguageFilter('');
    setDateFilter(null);
    setSearchQuery('');
    setCurrentPage(1);
    setShowFilterDropdown(false);
};

    

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Head>
                <title>News Articles</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <header className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 px-8 text-white shadow-lg">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                        Global News App
                    </h1>
                        {isLoading ? <span className='text-2xl md:text-2xl opacity-90 mt-2'>Please wait, we are getting the latest news articles for you!</span> : (
                          <p className="text-2xl md:text-2xl opacity-90">
                            An comprehensive project built using Apache Airflow, Xata, Drizzle-ORM, Nextjs, TailwindCSS and Typescript
                        </p>
                        )}
                    
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full sm:w-1/3">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sort and Filter Controls */}
                <div className='flex flex-row gap-2'>
                  {/* Sort Dropdown */}
                  <div className="relative z-20">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
                    >
                      Sort
                      <svg className={`ml-2 h-4 w-4 transform ${showSortDropdown ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {showSortDropdown && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2">
                        <button
                          onClick={() => handleSortChange('date')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Date (Latest)
                        </button>
                        <button
                          onClick={() => handleSortChange('title')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                      Filter
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
                            value={categoryFilter}
                            onChange={(e) => handleFilterChange(setCategoryFilter, e.target.value)}
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
                            value={languageFilter}
                            onChange={(e) => handleFilterChange(setLanguageFilter, e.target.value)}
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
                            selected={dateFilter}
                            onChange={(date: Date | null) => handleFilterChange(setDateFilter, date)}
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
              </div>
                {/* Rendering Logic */}
                {isLoading ? (
                    <LoadingState />
                ) : articles && articles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                            {articles?.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-600 text-lg py-8">
                      No articles found matching your criteria.
                    </p>
                )}
            </main>
        </div>
    );
}