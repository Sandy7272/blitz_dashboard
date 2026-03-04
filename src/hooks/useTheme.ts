import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  initialLoadComplete: boolean;
}

const DEFAULT_THEME: Theme = 'dark';

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      initialLoadComplete: false,
      setTheme: async (newTheme: Theme) => {
        const currentTheme = get().theme;
        if (currentTheme !== newTheme) {
          set({ theme: newTheme });
          await updateTheme(newTheme);
          // Sync with backend API
          try {
            const userId = localStorage.getItem('auth0_userid');
            if (userId) {
              await fetch(`http://localhost:8000/api/v3/preferences/theme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme, user_id: userId }),
              });
            }
          } catch (error) {
            console.log('Failed to sync theme with backend:', error);
          }
          localStorage.setItem('user_theme', newTheme);
        }
      },
      toggleTheme: async () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        await updateTheme(newTheme);
        // Sync with backend API
        try {
          const userId = localStorage.getItem('auth0_userid');
          if (userId) {
            await fetch(`http://localhost:8000/api/v3/preferences/theme`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ theme: newTheme, user_id: userId }),
            });
          }
        } catch (error) {
          console.log('Failed to sync theme with backend:', error);
        }
        localStorage.setItem('user_theme', newTheme);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

async function updateTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  
  // Apply theme classes
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Trigger transition
  await new Promise(resolve => setTimeout(resolve, 200));
}

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const loadTheme = async () => {
    const storedTheme = localStorage.getItem('user_theme') as Theme | null;
    const savedConfig = useThemeStore.getState();
    
    if (storedTheme && (savedConfig.theme === DEFAULT_THEME) && (savedConfig.theme !== storedTheme)) {
      await setTheme(storedTheme);
    } else if (!savedConfig.initialLoadComplete) {
      // Check system preference if no stored theme
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme: Theme = systemPrefersDark ? 'dark' : 'light';
      await setTheme(defaultTheme);
    }
    
    useThemeStore.setState({ initialLoadComplete: true });
  };
  useEffect(() => {
    if (!useThemeStore.getState().initialLoadComplete) {
      loadTheme();
    }
  }, []);
  
  return { theme, setTheme, toggleTheme };
}

export default useTheme;
