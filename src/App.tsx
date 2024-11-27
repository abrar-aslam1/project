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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />
        
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          onCategoryChange={setActiveCategory}
          onSubCategoryChange={setActiveSubCategory}
        />

        {error && (
          <div className="text-red-500 dark:text-red-400 text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <NewsGrid articles={news} />
        )}
      </main>

      <Footer />
    </div>
  );
}
