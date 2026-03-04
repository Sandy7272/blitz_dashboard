import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Toggle to light theme' : 'Toggle to dark theme'}
      className="group relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-accent hover:text-foreground active:scale-95"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon (Light Theme Active) */}
        <Sun
          className={`absolute inset-0 transition-opacity duration-200
            ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}
          strokeWidth={2.5}
        />
        {/* Moon Icon (Dark Theme Active) */}
        <Moon
          className={`absolute inset-0 transition-opacity duration-200
            ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
          strokeWidth={2.5}
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 group-hover:right-auto left-auto group-hover:left-full whitespace-nowrap transition-opacity pointer-events-none">
        {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      </div>
    </button>
  );
}
