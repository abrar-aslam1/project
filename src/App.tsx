import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { CallersHub } from './components/CallersHub';
import { AuthProvider } from './components/AuthProvider';
import { useDarkMode } from './hooks/useDarkMode';
import { useState } from 'react';
import { UserPreferencesDialog } from './components/UserPreferencesDialog';
import type { UserPreferences } from './types/news';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showPreferences, setShowPreferences] = useState(false);

  const handleSavePreferences = (preferences: UserPreferences) => {
    // Here you would typically save the preferences to your backend/storage
    console.log('Saving preferences:', preferences);
    setShowPreferences(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
          <Header 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={toggleDarkMode}
            onOpenPreferences={() => setShowPreferences(true)}
          />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callers" element={<CallersHub />} />
          </Routes>

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
  );
}

export default App;
