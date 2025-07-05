'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi'; // npm install react-icons

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
    >
      {currentTheme === 'dark' ? (
        <FiSun className="h-6 w-6 text-yellow-500" />
      ) : (
        <FiMoon className="h-6 w-6 text-gray-800" />
      )}
    </button>
  );
}