import Image from 'next/image';
import { NewsArticle } from '../types';
import customImageLoader from '../components/ImageLoader'; // Make sure this path is correct

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const defaultImageUrl = '/default-news-image.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* This is the container for the image */}
      <div className="relative w-full h-48 overflow-hidden"> {/* Added overflow-hidden */}
        <Image
          loader={customImageLoader}
          src={article.image_url || defaultImageUrl}
          alt={article.title || 'News Image'}
          // layout="fill" is correct for filling parent
          layout="fill"
          // objectFit="cover" is correct for maintaining aspect ratio and filling space
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
          {article.description}
        </p>
        <div className="text-sm text-gray-500 mb-2">
          By {article.author || 'Unknown'} - {new Date(article.published_at).toLocaleDateString()}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-auto bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded transition duration-200"
        >
          Read More
        </a>
      </div>
    </div>
  );
}