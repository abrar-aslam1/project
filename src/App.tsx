import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { NewsGrid } from './components/NewsGrid';
import { Footer } from './components/Footer';
import { categories } from './data/categories';
import { useNews } from './hooks/useNews';
import { useDarkMode } from './hooks/useDarkMode';
import './App.css';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { news, loading, error } = useNews(activeCategory, activeSubCategory);

  // Force dark mode class on mount
  useState(() => {
    document.documentElement.classList.add('dark');
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
          
          <div className="mt-12">
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              activeSubCategory={activeSubCategory}
              onCategoryChange={setActiveCategory}
              onSubCategoryChange={setActiveSubCategory}
            />

            {error && (
              <div className="text-red-500 dark:text-red-400 text-center mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading latest crypto news...</p>
              </div>
            ) : (
              <div className="mt-8">
                <NewsGrid articles={news} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
