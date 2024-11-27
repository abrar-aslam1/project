import { Moon, Sun } from 'lucide-react';
import { Button } from "../components/ui/button";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ThemeToggle({ isDarkMode, onToggleDarkMode }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
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
        border-0
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isDarkMode ? (
          <Moon className="h-5 w-5 text-purple-400 transition-all duration-300" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 transition-all duration-300" />
        )}
      </div>
    </Button>
  );
}
