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
          <h1 className="text-2xl font-bold gradient-text">
            Token•eur News
          </h1>
          <div className="flex items-center gap-6">
            <ThemeToggle isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}