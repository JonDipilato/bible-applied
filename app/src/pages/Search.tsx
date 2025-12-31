import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Sparkles, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { VerseCard } from '../components/bible/VerseCard';
import { api } from '../api/bible';
import type { VerseWithBook } from '../lib/types';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isAI, setIsAI] = useState(searchParams.get('ai') === 'true');
  const [results, setResults] = useState<VerseWithBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Perform search when params change
  useEffect(() => {
    const q = searchParams.get('q');
    const ai = searchParams.get('ai') === 'true';

    if (q) {
      setQuery(q);
      setIsAI(ai);
      performSearch(q, ai);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, _useAI: boolean) => {
    setLoading(true);
    setSearched(true);

    try {
      const searchResults = await api.bible.searchVerses(searchQuery, 50);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    }

    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, ai: String(isAI) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Search
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Find verses by keyword or ask a question
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isAI
                  ? 'Ask a question about Scripture...'
                  : 'Search verses, references, or topics...'
              }
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary">
            Search
          </Button>
        </div>

        {/* Search options */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsAI(!isAI)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              isAI
                ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary'
                : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-brand-secondary'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Search
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-gray-300"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
              {isAI && ' using AI search'}
            </p>

            {results.map((verse) => (
              <VerseCard key={verse.id} verse={verse} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No results found for "{query}"
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try different keywords or enable AI search for better results
            </p>
          </Card>
        )
      ) : (
        <Card className="text-center py-12">
          <SearchIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Enter a search term to find verses
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try "finances", "anxiety", or ask "What does the Bible say about fear?"
          </p>
        </Card>
      )}
    </div>
  );
};
