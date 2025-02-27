import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthButton } from './AuthButton';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Settings, Menu, X } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenPreferences: () => void;
}

export function Header({ isDarkMode, onToggleDarkMode, onOpenPreferences }: HeaderProps) {
  const { user } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-effect dark:bg-black/50">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
<Link to="/" className="flex items-center gap-2 text-left">
  <img src="/tokenuer-logo.png" alt="Tokeneur Logo" width="64" height="64" />
  <div>
    <h1 className="text-2xl font-bold gradient-text">
      Tokeneur<span className="text-xs align-super">®</span>
    </h1>
    <div className="text-sm text-purple-400 mt-0.5">Crypto News & Tools</div>
  </div>
</Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium hover:text-purple-400 transition-colors">News</Link>
              <Link to="/callers" className="text-sm font-medium hover:text-purple-400 transition-colors">$Call Hub</Link>
              <Link to="/tools" className="text-sm font-medium hover:text-purple-400 transition-colors">Tools</Link>
              <Link to="/exchange" className="text-sm font-medium hover:text-purple-400 transition-colors">Exchange Finder</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenPreferences}
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
                <Button variant="ghost" size="icon" className="md:hidden">
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    News
                  </Link>
                  <Link 
                    to="/callers" 
                    className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    $Call Hub
                  </Link>
                  <Link 
                    to="/tools" 
                    className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link 
                    to="/exchange" 
                    className="text-lg font-medium hover:text-purple-400 transition-colors p-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Exchange Finder
                  </Link>
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
  );
}
