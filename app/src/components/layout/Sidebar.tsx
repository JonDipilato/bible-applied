import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Book,
  Grid3X3,
  Search,
  BookOpen,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../ui/Button';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const mainNavItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/bible', icon: Book, label: 'Bible' },
  { to: '/topics', icon: Grid3X3, label: 'Topics' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
];

const bottomNavItems: NavItem[] = [
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const { effectiveTheme, setTheme } = useSettingsStore();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-sidebar bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col z-40">
      {/* Logo */}
      <div className="h-header flex items-center px-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            Verse Hunter
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-150 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white',
                isActive && 'bg-brand-primary/10 text-brand-primary font-medium'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-slate-700 space-y-1">
        {/* Theme toggle */}
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
          <Button variant="icon" onClick={toggleTheme}>
            {effectiveTheme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>

        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-150 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white',
                isActive && 'bg-brand-primary/10 text-brand-primary font-medium'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
