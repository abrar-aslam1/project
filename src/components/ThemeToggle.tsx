import { Moon, Sun } from 'lucide-react';
import { Button } from "../components/ui/button";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ThemeToggle({ isDarkMode, onToggleDarkMode }: ThemeToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggleDarkMode}
      className={`
        w-[50px] h-[50px] rounded-full 
        relative overflow-hidden
        bg-gradient-to-br from-purple-500/10 to-blue-500/10 
        hover:from-purple-500/20 hover:to-blue-500/20
        dark:from-purple-400/20 dark:to-blue-400/20
        dark:hover:from-purple-400/30 dark:hover:to-blue-400/30
        transition-all duration-300
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`
            transform transition-transform duration-500
            ${isDarkMode ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}
          `}
        >
          <Moon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        </div>
        <div
          className={`
            absolute transform transition-transform duration-500
            ${isDarkMode ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}
          `}
        >
          <Sun className="h-5 w-5 text-amber-500" />
        </div>
      </div>
    </Button>
  );
}
