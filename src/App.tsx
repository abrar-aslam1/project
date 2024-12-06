import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { CallersHub } from './components/CallersHub';
import { AuthProvider } from './components/AuthProvider';
import { useDarkMode } from './hooks/useDarkMode';
import { useState } from 'react';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showPreferences, setShowPreferences] = useState(false);

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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
