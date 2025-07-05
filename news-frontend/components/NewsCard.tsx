// components/NewsCard.tsx
import Image from 'next/image';
import { NewsArticle } from '../types';
import customImageLoader from '../components/ImageLoader'; // Make sure this path is correct

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const defaultImageUrl = '/default-news-image.jpg'; // Ensure this image exists in your /public folder

  // Format date for display
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date Unknown';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="relative w-full h-56 md:h-48 overflow-hidden">
        <Image
          loader={customImageLoader}
          src={article.image_url || defaultImageUrl}
          alt={article.title || 'News Image'}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl" // Apply border-radius to top corners
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultImageUrl) { // Prevent infinite loop if default image also fails
                target.src = defaultImageUrl;
                target.srcset = ''; // Clear srcset to prevent further attempts
            }
          }}
        />
        {article.category && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {article.category}
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
          {article.title}
        </h2>
        <p className="text-gray-600 text-base mb-4 flex-grow line-clamp-3 leading-relaxed">
          {article.description || 'No description available.'}
        </p>
        <div className="mt-auto"> {/* Pushes content to bottom */}
          <div className="text-sm text-gray-500 mb-2">
            By <span className="font-medium text-gray-700">{article.author || 'Unknown'}</span> - {publishedDate}
          </div>
          {article.source && (
            <div className="text-xs text-gray-500 mb-3">
              Source: <span className="font-medium text-blue-600">{article.source}</span>
            </div>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-base"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}