import Link from 'next/link';

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">
        Welcome to My News Site!
      </h1>
      <Link href="/news" className="px-8 py-4 bg-blue-600 text-white text-2xl font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out">
          News Page
      </Link>
    </div>
  );
}