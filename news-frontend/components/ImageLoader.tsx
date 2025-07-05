import { ImageLoaderProps } from 'next/image';

export default function customImageLoader({ src, width, quality }: ImageLoaderProps) {
  // 1. Handle null, undefined, or empty string src first
  if (!src) {
    console.warn("customImageLoader received a null or empty src. Using default placeholder.");
    return '/default-news-image.jpg'; // Always return your default image if src is invalid
  }

  // 2. Check if the src is an absolute URL (starts with http:// or https://)
  // This is crucial because `new URL()` needs an absolute URL.
  if (!src.startsWith('http://') && !src.startsWith('https://')) {
    // If it's a relative path (like /default-news-image.jpg)
    // Next.js's Image component can handle these relative paths if they are
    // static assets in your /public folder. In this case, we just return the src as is.
    // However, if it's meant to be an external URL that simply omitted the protocol,
    // you might need a more complex heuristic or a base URL.
    // For now, assume it's a relative path for a static asset.
    console.log(`customImageLoader: src "${src}" appears to be a relative path. Returning as is.`);
    return src;
  }

  // 3. Attempt to create a URL object for absolute URLs
  try {
    const url = new URL(src);

    return url.toString();
  } catch (error) {
    console.error(`customImageLoader: Error parsing URL "${src}":`, error);
    // If parsing fails for any reason, fall back to the default image
    return '/default-news-image.jpg';
  }
}