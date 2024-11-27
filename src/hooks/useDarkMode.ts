import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Always start with dark mode by default
    document.documentElement.classList.add('dark');
    // Only use localStorage if it explicitly sets light mode
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== 'light';
  });

  useEffect(() => {
    // Update DOM and localStorage whenever isDarkMode changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
}
