import { useState } from 'react';
import { CategoryNav } from './components/CategoryNav';
import { NewsGrid } from './components/NewsGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthButton } from './components/AuthButton';
import { AuthProvider } from './components/AuthProvider';
import { useDarkMode } from './hooks/useDarkMode';
import { HeroSection } from './components/HeroSection';
import { Settings, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState<string | undefined>();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();

  const handleCategoryChange = (newCategory: string, newSubCategory?: string) => {
    setCategory(newCategory);
    setSubCategory(newSubCategory);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full glass-effect dark:bg-black/50">
          <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-8">
                <div className="text-left">
                  <h1 className="text-2xl font-bold gradient-text">
                    Tokeneur<span className="text-xs align-super">™</span>
                  </h1>
                  <div className="text-sm text-purple-400 mt-0.5 text-left">Crypto News & Tools</div>
                </div>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#news" className="text-sm font-medium hover:text-purple-400 transition-colors">News</a>
                  <a href="#tools" className="text-sm font-medium hover:text-purple-400 transition-colors">Tools</a>
                  <a href="#merch" className="text-sm font-medium hover:text-purple-400 transition-colors">Merch</a>
                  <a href="#exchange" className="text-sm font-medium hover:text-purple-400 transition-colors">Exchange Finder</a>
                </nav>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                )}
                <div className="hidden md:block">
                  <AuthButton />
                </div>
                {/* Mobile Menu Button */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden h-10 w-10 p-2"
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col gap-4 mt-8">
                      <a 
                        href="#news" 
                        className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        News
                      </a>
                      <a 
                        href="#tools" 
                        className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Tools
                      </a>
                      <a 
                        href="#merch" 
                        className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Merch
                      </a>
                      <a 
                        href="#exchange" 
                        className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Exchange Finder
                      </a>
                      <div className="mt-4 p-2">
                        <AuthButton />
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
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
