import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, Verse, VerseReference } from '../lib/types';

interface BibleState {
  // Current navigation
  currentBook: Book | null;
  currentChapter: number;
  currentVerse: Verse | null;

  // Books cache
  books: Book[];

  // Navigation history
  history: VerseReference[];

  // Actions
  setBooks: (books: Book[]) => void;
  setCurrentBook: (book: Book | null) => void;
  setCurrentChapter: (chapter: number) => void;
  setCurrentVerse: (verse: Verse | null) => void;
  navigateTo: (bookId: number, chapter: number, verse?: number) => void;
  addToHistory: (ref: VerseReference) => void;
  clearHistory: () => void;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set, get) => ({
      currentBook: null,
      currentChapter: 1,
      currentVerse: null,
      books: [],
      history: [],

      setBooks: (books) => set({ books }),

      setCurrentBook: (book) =>
        set({
          currentBook: book,
          currentChapter: 1,
          currentVerse: null,
        }),

      setCurrentChapter: (chapter) =>
        set({
          currentChapter: chapter,
          currentVerse: null,
        }),

      setCurrentVerse: (verse) => {
        if (verse) {
          const ref: VerseReference = {
            bookId: verse.bookId,
            chapter: verse.chapter,
            verse: verse.verse,
          };
          get().addToHistory(ref);
        }
        set({ currentVerse: verse });
      },

      navigateTo: (bookId, chapter, verse) => {
        const books = get().books;
        const book = books.find((b) => b.id === bookId);
        if (book) {
          set({
            currentBook: book,
            currentChapter: chapter,
            currentVerse: null,
          });
          if (verse) {
            get().addToHistory({ bookId, chapter, verse });
          }
        }
      },

      addToHistory: (ref) =>
        set((state) => ({
          history: [ref, ...state.history.filter(
            (h) => !(h.bookId === ref.bookId && h.chapter === ref.chapter && h.verse === ref.verse)
          ).slice(0, 49)],
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'bible-store',
      partialize: (state) => ({
        currentBook: state.currentBook,
        currentChapter: state.currentChapter,
        history: state.history,
      }),
    }
  )
);
