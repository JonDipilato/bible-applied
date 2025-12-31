import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMProvider, Settings } from '../lib/types';
import { systemPrefersDark } from '../lib/utils';

interface SettingsState extends Settings {
  // Computed
  effectiveTheme: 'light' | 'dark';

  // Actions
  setTheme: (theme: Settings['theme']) => void;
  setFontSize: (size: Settings['fontSize']) => void;
  setLLMProvider: (provider: LLMProvider) => void;
  setLLMBaseUrl: (url: string) => void;
  setLLMModel: (model: string) => void;
  setLLMApiKey: (key: string) => void;
  toggleDailyVerse: () => void;
  setDailyVerseTime: (time: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const getEffectiveTheme = (theme: Settings['theme']): 'light' | 'dark' => {
  if (theme === 'system') {
    return systemPrefersDark() ? 'dark' : 'light';
  }
  return theme;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Default settings
      theme: 'system',
      fontSize: 'medium',
      llmProvider: 'lmstudio',
      // For WSL accessing Windows LM Studio, try: http://localhost:1234/v1
      // or http://$(hostname).local:1234/v1
      llmBaseUrl: 'http://localhost:1234/v1',
      llmModel: '',
      llmApiKey: '',
      dailyVerseEnabled: true,
      dailyVerseTime: '07:00',

      // Computed
      effectiveTheme: getEffectiveTheme('system'),

      // Actions
      setTheme: (theme) => {
        set({ theme, effectiveTheme: getEffectiveTheme(theme) });
        // Apply to document
        const effective = getEffectiveTheme(theme);
        document.documentElement.classList.toggle('dark', effective === 'dark');
      },

      setFontSize: (fontSize) => set({ fontSize }),

      setLLMProvider: (llmProvider) => {
        // Set default URLs when switching providers
        let llmBaseUrl = get().llmBaseUrl;
        if (llmProvider === 'lmstudio') {
          llmBaseUrl = 'http://localhost:1234/v1';
        } else if (llmProvider === 'ollama') {
          llmBaseUrl = 'http://localhost:11434/v1';
        } else if (llmProvider === 'openai') {
          llmBaseUrl = 'https://api.openai.com/v1';
        } else if (llmProvider === 'claude') {
          llmBaseUrl = 'https://api.anthropic.com';
        }
        set({ llmProvider, llmBaseUrl });
      },

      setLLMBaseUrl: (llmBaseUrl) => set({ llmBaseUrl }),

      setLLMModel: (llmModel) => set({ llmModel }),

      setLLMApiKey: (llmApiKey) => set({ llmApiKey }),

      toggleDailyVerse: () =>
        set((state) => ({ dailyVerseEnabled: !state.dailyVerseEnabled })),

      setDailyVerseTime: (dailyVerseTime) => set({ dailyVerseTime }),

      updateSettings: (settings) => {
        const newSettings = { ...get(), ...settings };
        if (settings.theme) {
          newSettings.effectiveTheme = getEffectiveTheme(settings.theme);
          document.documentElement.classList.toggle(
            'dark',
            newSettings.effectiveTheme === 'dark'
          );
        }
        set(newSettings);
      },
    }),
    {
      name: 'settings-store',
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state) {
          const effective = getEffectiveTheme(state.theme);
          document.documentElement.classList.toggle('dark', effective === 'dark');
        }
      },
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('settings-store');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      const effective = getEffectiveTheme(state?.theme || 'system');
      document.documentElement.classList.toggle('dark', effective === 'dark');
    } catch {
      // Ignore parse errors
    }
  }
}
