import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook for managing the storefront theme (Light/Dark).
 * Syncs with localStorage and applies the 'dark' class to the document.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('manavyapar-theme') as Theme;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('manavyapar-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(curr => curr === 'light' ? 'dark' : 'light');

  return { theme, toggleTheme };
};
