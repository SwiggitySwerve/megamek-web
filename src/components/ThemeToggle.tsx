import React, { useEffect } from 'react';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { useThemeSelector } from '@/stores/useThemeStore';

const SunIcon: React.FC = () => (
  <SvgIcon size="control" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </SvgIcon>
);

const MoonIcon: React.FC = () => (
  <SvgIcon size="control" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </SvgIcon>
);

export interface IThemeToggleProps {
  readonly className?: string;
}

export const ThemeToggle: React.FC<IThemeToggleProps> = ({
  className = '',
}) => {
  const theme = useThemeSelector((state) => state.theme);
  const toggleTheme = useThemeSelector((state) => state.toggleTheme);
  const applyTheme = useThemeSelector((state) => state.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        'relative inline-flex items-center justify-center',
        'w-10 h-10 rounded-lg',
        'bg-gray-100 dark:bg-gray-800',
        'border border-gray-300 dark:border-gray-600',
        'text-gray-700 dark:text-gray-200',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        'transition-colors duration-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      data-testid="theme-toggle"
      data-theme={theme}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
