import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearch, setIsAISearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&ai=${isAISearch}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-sidebar right-0 h-header bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 z-30">
      <div className="h-full max-w-6xl mx-auto px-6 flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAISearch ? "Ask a question about Scripture..." : "Search verses, references, or topics..."}
              className={cn(
                'w-full pl-12 pr-24 py-2.5 rounded-xl border-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all duration-150 focus:bg-white dark:focus:bg-slate-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500',
                isAISearch ? 'border-brand-secondary' : 'border-gray-200 dark:border-slate-600'
              )}
            />

            {/* Clear and AI toggle */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <Button
                  type="button"
                  variant="icon"
                  onClick={clearSearch}
                  className="p-1.5"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}

              <Button
                type="button"
                variant="icon"
                onClick={() => setIsAISearch(!isAISearch)}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isAISearch
                    ? 'bg-brand-secondary/10 text-brand-secondary'
                    : 'text-gray-400 hover:text-brand-secondary'
                )}
                title={isAISearch ? 'AI Search enabled' : 'Enable AI Search'}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Right side - could add user menu, notifications, etc. */}
        <div className="flex items-center gap-2">
          {/* Placeholder for future features */}
        </div>
      </div>
    </header>
  );
};
