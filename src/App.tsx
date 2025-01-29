import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { lazy, Suspense, useState, useEffect } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { useDarkMode } from './hooks/useDarkMode';
import { UserPreferencesDialog } from './components/UserPreferencesDialog';
import type { UserPreferences } from './types/news';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy load components for better initial load performance
const Home = lazy(() => import('./components/Home').then(module => ({ default: module.Home })));
const CallersHub = lazy(() => import('./components/CallersHub').then(module => ({ default: module.CallersHub })));
const CallerPage = lazy(() => import('./components/CallerPage').then(module => ({ default: module.CallerPage })));
const Tools = lazy(() => import('./components/Tools'));
const Community = lazy(() => import('./components/Community'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache garbage collection time (formerly cacheTime)
    },
  },
});

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showPreferences, setShowPreferences] = useState(false);

  // Add viewport meta tag for proper mobile scaling
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const handleSavePreferences = (preferences: UserPreferences) => {
    // Here you would typically save the preferences to your backend/storage
    console.log('Saving preferences:', preferences);
    setShowPreferences(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Header 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={toggleDarkMode}
              onOpenPreferences={() => setShowPreferences(true)}
            />
            
            <main className="safe-padding safe-bottom">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/callers" element={<CallersHub />} />
                  <Route path="/caller/:handle" element={<CallerPage />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/community" element={<Community />} />
                </Routes>
              </Suspense>
            </main>

            <UserPreferencesDialog 
              open={showPreferences}
              onClose={() => setShowPreferences(false)}
              onSave={handleSavePreferences}
              initialPreferences={{
                darkMode: isDarkMode,
                newsPreferences: {
                  categories: [],
                  subCategories: []
                }
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
