import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 transition-transform duration-300 group-hover:rotate-[360deg]" />
      ) : (
        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 transition-transform duration-300 group-hover:rotate-[360deg]" />
      )}
    </button>
  );
}