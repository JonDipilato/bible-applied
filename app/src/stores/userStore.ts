import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserHighlight, HighlightColor, QuotaStatus } from '../lib/types';

interface UserState {
  // Highlights (cached locally for quick access)
  highlights: Map<number, UserHighlight>;

  // Favorites
  favoriteVerseIds: Set<number>;

  // Quota
  quota: QuotaStatus | null;

  // Actions
  addHighlight: (verseId: number, color: HighlightColor) => void;
  removeHighlight: (verseId: number) => void;
  getHighlight: (verseId: number) => UserHighlight | undefined;
  toggleFavorite: (verseId: number) => void;
  isFavorite: (verseId: number) => boolean;
  setQuota: (quota: QuotaStatus) => void;
  decrementQueries: () => void;
  addTokensUsed: (tokens: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      highlights: new Map(),
      favoriteVerseIds: new Set(),
      quota: null,

      addHighlight: (verseId, color) =>
        set((state) => {
          const newHighlights = new Map(state.highlights);
          newHighlights.set(verseId, {
            id: Date.now(),
            verseId,
            color,
            createdAt: new Date().toISOString(),
          });
          return { highlights: newHighlights };
        }),

      removeHighlight: (verseId) =>
        set((state) => {
          const newHighlights = new Map(state.highlights);
          newHighlights.delete(verseId);
          return { highlights: newHighlights };
        }),

      getHighlight: (verseId) => get().highlights.get(verseId),

      toggleFavorite: (verseId) =>
        set((state) => {
          const newFavorites = new Set(state.favoriteVerseIds);
          if (newFavorites.has(verseId)) {
            newFavorites.delete(verseId);
          } else {
            newFavorites.add(verseId);
          }
          return { favoriteVerseIds: newFavorites };
        }),

      isFavorite: (verseId) => get().favoriteVerseIds.has(verseId),

      setQuota: (quota) => set({ quota }),

      decrementQueries: () =>
        set((state) => {
          if (!state.quota) return state;
          return {
            quota: {
              ...state.quota,
              queriesUsed: state.quota.queriesUsed + 1,
            },
          };
        }),

      addTokensUsed: (tokens) =>
        set((state) => {
          if (!state.quota) return state;
          return {
            quota: {
              ...state.quota,
              tokensUsed: state.quota.tokensUsed + tokens,
            },
          };
        }),
    }),
    {
      name: 'user-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              highlights: new Map(state.highlights || []),
              favoriteVerseIds: new Set(state.favoriteVerseIds || []),
            },
          };
        },
        setItem: (name, value) => {
          const { state } = value as { state: UserState };
          const serializable = {
            state: {
              ...state,
              highlights: Array.from(state.highlights.entries()),
              favoriteVerseIds: Array.from(state.favoriteVerseIds),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
