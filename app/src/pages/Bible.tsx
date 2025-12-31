import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Book } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useBibleStore } from '../stores/bibleStore';
import { api } from '../api/bible';
import type { Book as BookType, Verse } from '../lib/types';

export const Bible: React.FC = () => {
  const {
    books,
    currentBook,
    currentChapter,
    setBooks,
    setCurrentBook,
    setCurrentChapter,
  } = useBibleStore();

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookSelector, setShowBookSelector] = useState(false);

  // Load books on mount
  useEffect(() => {
    const loadBooks = async () => {
      if (books.length === 0) {
        try {
          const data = await api.bible.getBooks();
          setBooks(data);
          if (!currentBook && data.length > 0) {
            setCurrentBook(data[0]);
          }
        } catch (error) {
          console.error('Failed to load books:', error);
        }
      }
      setLoading(false);
    };
    loadBooks();
  }, []);

  // Load verses when book/chapter changes
  useEffect(() => {
    const loadVerses = async () => {
      if (currentBook) {
        setLoading(true);
        try {
          const data = await api.bible.getVerses(currentBook.id, currentChapter);
          setVerses(data);
        } catch (error) {
          console.error('Failed to load verses:', error);
          setVerses([]);
        }
        setLoading(false);
      }
    };
    loadVerses();
  }, [currentBook, currentChapter]);

  const goToPreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (currentBook) {
      // Go to previous book
      const currentIndex = books.findIndex((b) => b.id === currentBook.id);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setCurrentBook(prevBook);
        setCurrentChapter(prevBook.chapterCount);
      }
    }
  };

  const goToNextChapter = () => {
    if (currentBook && currentChapter < currentBook.chapterCount) {
      setCurrentChapter(currentChapter + 1);
    } else if (currentBook) {
      // Go to next book
      const currentIndex = books.findIndex((b) => b.id === currentBook.id);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        setCurrentBook(nextBook);
        setCurrentChapter(1);
      }
    }
  };

  const selectBook = (book: BookType) => {
    setCurrentBook(book);
    setCurrentChapter(1);
    setShowBookSelector(false);
  };

  if (loading && !currentBook) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 w-64 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with book/chapter selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Book selector trigger */}
          <button
            onClick={() => setShowBookSelector(!showBookSelector)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-brand-primary transition-colors"
          >
            <Book className="w-5 h-5 text-brand-primary" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentBook?.name || 'Select Book'}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {currentChapter}
            </span>
          </button>

          {/* Chapter navigation */}
          <div className="flex items-center gap-1">
            <Button variant="icon" onClick={goToPreviousChapter}>
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Chapter quick select */}
            <select
              value={currentChapter}
              onChange={(e) => setCurrentChapter(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              {currentBook &&
                Array.from({ length: currentBook.chapterCount }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Chapter {i + 1}
                  </option>
                ))}
            </select>

            <Button variant="icon" onClick={goToNextChapter}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Book selector dropdown */}
      {showBookSelector && (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Old Testament */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Old Testament
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {books
                  .filter((b) => b.testament === 'OT')
                  .map((book) => (
                    <button
                      key={book.id}
                      onClick={() => selectBook(book)}
                      className={`text-left px-3 py-1.5 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700 ${
                        currentBook?.id === book.id
                          ? 'bg-brand-primary/10 text-brand-primary font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {book.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* New Testament */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                New Testament
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {books
                  .filter((b) => b.testament === 'NT')
                  .map((book) => (
                    <button
                      key={book.id}
                      onClick={() => selectBook(book)}
                      className={`text-left px-3 py-1.5 rounded text-sm hover:bg-gray-100 dark:hover:bg-slate-700 ${
                        currentBook?.id === book.id
                          ? 'bg-brand-primary/10 text-brand-primary font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {book.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Chapter content */}
      <Card className="max-w-reading mx-auto">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentBook?.name} {currentChapter}
            </h2>

            <div className="font-display text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {verses.map((verse) => (
                <span key={verse.id} className="group cursor-pointer hover:bg-brand-primary/5 rounded px-0.5">
                  <sup className="text-xs text-brand-primary font-mono mr-1">
                    {verse.verse}
                  </sup>
                  {verse.text}{' '}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Chapter navigation footer */}
      <div className="flex items-center justify-between max-w-reading mx-auto">
        <Button variant="secondary" onClick={goToPreviousChapter}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button variant="secondary" onClick={goToNextChapter}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
