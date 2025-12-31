import { invoke } from '@tauri-apps/api/core';
import type { Settings } from '../lib/types';

// Backend settings type - matches Rust's #[serde(rename_all = "camelCase")]
// Both use camelCase so we can share the Settings type directly
type BackendSettings = Settings;

// Settings API for Tauri
export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const backend = await invoke<BackendSettings>('get_settings');
    return {
      theme: backend.theme,
      fontSize: backend.fontSize,
      llmProvider: backend.llmProvider,
      llmBaseUrl: backend.llmBaseUrl || undefined,
      llmModel: backend.llmModel || undefined,
      llmApiKey: backend.llmApiKey || undefined,
      dailyVerseEnabled: backend.dailyVerseEnabled,
      dailyVerseTime: backend.dailyVerseTime,
    };
  },

  updateSettings: async (settings: Partial<Settings>): Promise<void> => {
    // Get current settings first, then merge
    const current = await invoke<BackendSettings>('get_settings');
    const updates: Partial<BackendSettings> = {};

    if (settings.theme !== undefined) updates.theme = settings.theme;
    if (settings.fontSize !== undefined) updates.fontSize = settings.fontSize;
    if (settings.llmProvider !== undefined) updates.llmProvider = settings.llmProvider;
    if (settings.llmBaseUrl !== undefined) updates.llmBaseUrl = settings.llmBaseUrl || undefined;
    if (settings.llmModel !== undefined) updates.llmModel = settings.llmModel || undefined;
    if (settings.llmApiKey !== undefined) updates.llmApiKey = settings.llmApiKey || undefined;
    if (settings.dailyVerseEnabled !== undefined) updates.dailyVerseEnabled = settings.dailyVerseEnabled;
    if (settings.dailyVerseTime !== undefined) updates.dailyVerseTime = settings.dailyVerseTime;

    const merged = { ...current, ...updates };
    console.log('[Settings API] Saving settings:', merged);
    await invoke('update_settings', { settings: merged });
  },
};

// Mock settings API for development
export const mockSettingsApi = {
  getSettings: async (): Promise<Settings> => {
    return {
      theme: 'system',
      fontSize: 'medium',
      llmProvider: 'lmstudio',
      llmBaseUrl: 'http://localhost:1234/v1',
      llmModel: '',
      llmApiKey: '',
      dailyVerseEnabled: true,
      dailyVerseTime: '07:00',
    };
  },

  updateSettings: async (_settings: Partial<Settings>): Promise<void> => {
    // Mock - just log
    console.log('Settings updated (mock)');
  },
};

// Check if Tauri is available
// Tauri 2.x uses __TAURI_INTERNALS__ instead of __TAURI__
const isTauriAvailable = () => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// Create proxy for lazy evaluation
type SettingsApiType = typeof settingsApi;
const createSettingsProxy = (): SettingsApiType => {
  return new Proxy({} as SettingsApiType, {
    get(_target, prop: keyof SettingsApiType) {
      return (...args: unknown[]) => {
        const apiToUse = isTauriAvailable() ? settingsApi : mockSettingsApi;
        return (apiToUse[prop] as (...args: unknown[]) => Promise<unknown>)(...args);
      };
    },
  });
};

export const settings = createSettingsProxy();
