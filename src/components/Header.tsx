import { AuthButton } from './AuthButton';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
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
            <nav className="hidden sm:flex items-center space-x-6">
              <a href="#news" className="text-sm font-medium hover:text-purple-400 transition-colors">News</a>
              <a href="#tools" className="text-sm font-medium hover:text-purple-400 transition-colors">Tools</a>
              <a href="#merch" className="text-sm font-medium hover:text-purple-400 transition-colors">Merch</a>
              <a href="#exchange" className="text-sm font-medium hover:text-purple-400 transition-colors">Exchange Finder</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
