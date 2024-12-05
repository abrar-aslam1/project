import { useState } from 'react';
import { CategoryNav } from './components/CategoryNav';
import { NewsGrid } from './components/NewsGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthButton } from './components/AuthButton';
import { AuthProvider } from './components/AuthProvider';
import { useDarkMode } from './hooks/useDarkMode';
import { HeroSection } from './components/HeroSection';

function App() {
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState<string | undefined>();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleCategoryChange = (newCategory: string, newSubCategory?: string) => {
    setCategory(newCategory);
    setSubCategory(newSubCategory);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-950/75 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <h1 className="text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: 'Diaria Pro', fontWeight: 800 }}>
                  Token•eur™
                </h1>
                <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Diaria Pro', fontWeight: 500 }}>
                  Crypto News & Tools
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-4">
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" style={{ fontFamily: 'Diaria Pro', fontWeight: 500 }}>
                  News
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" style={{ fontFamily: 'Diaria Pro', fontWeight: 500 }}>
                  Analysis
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" style={{ fontFamily: 'Diaria Pro', fontWeight: 500 }}>
                  Topics
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" style={{ fontFamily: 'Diaria Pro', fontWeight: 500 }}>
                  Sources
                </a>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <ThemeToggle isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
                <AuthButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <HeroSection />

            {/* Categories */}
            <CategoryNav onCategoryChange={handleCategoryChange} />

            {/* News Grid */}
            <NewsGrid category={category} subCategory={subCategory} />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
