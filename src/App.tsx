import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { NewsGrid } from './components/NewsGrid';
import { Footer } from './components/Footer';
import { categories } from './data/categories';
import { useNews } from './hooks/useNews';
import { useDarkMode } from './hooks/useDarkMode';
import { AuthProvider } from './components/AuthProvider';
import { useAuthContext } from './hooks/useAuthContext';
import { useAuth } from './hooks/useAuth';
import { UserPreferencesDialog } from './components/UserPreferencesDialog';
import { UserPreferences } from './types/news';
import './App.css';

function AppContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuthContext();
  const { saveUserPreferences } = useAuth();
  const { news, loading, error } = useNews(activeCategory, activeSubCategory, user?.preferences?.newsPreferences);
  const [showPreferences, setShowPreferences] = useState(false);

  // Force dark mode class on mount
  useState(() => {
    document.documentElement.classList.add('dark');
  });

  const defaultPreferences: UserPreferences = {
    newsPreferences: {
      categories: [],
      subCategories: []
    },
    darkMode: isDarkMode
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={toggleDarkMode}
        onOpenPreferences={() => setShowPreferences(true)}
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

      {user && (
        <UserPreferencesDialog
          open={showPreferences}
          onClose={() => setShowPreferences(false)}
          onSave={async (preferences) => {
            if (user) {
              const updatedPreferences: UserPreferences = {
                ...preferences,
                darkMode: isDarkMode
              };
              await saveUserPreferences(user.uid, updatedPreferences);
              setShowPreferences(false);
            }
          }}
          initialPreferences={user.preferences || defaultPreferences}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
