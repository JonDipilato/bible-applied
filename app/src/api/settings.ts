import { invoke } from '@tauri-apps/api/core';
import type { Settings } from '../lib/types';

// Backend settings type - matches Rust's #[serde(rename_all = "camelCase")]
type BackendSettings = Settings;

// Settings API — calls Tauri backend directly
export const settings = {
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

  updateSettings: async (settings_: Partial<Settings>): Promise<void> => {
    const current = await invoke<BackendSettings>('get_settings');
    const updates: Partial<BackendSettings> = {};

    if (settings_.theme !== undefined) updates.theme = settings_.theme;
    if (settings_.fontSize !== undefined) updates.fontSize = settings_.fontSize;
    if (settings_.llmProvider !== undefined) updates.llmProvider = settings_.llmProvider;
    if (settings_.llmBaseUrl !== undefined) updates.llmBaseUrl = settings_.llmBaseUrl || undefined;
    if (settings_.llmModel !== undefined) updates.llmModel = settings_.llmModel || undefined;
    if (settings_.llmApiKey !== undefined) updates.llmApiKey = settings_.llmApiKey || undefined;
    if (settings_.dailyVerseEnabled !== undefined) updates.dailyVerseEnabled = settings_.dailyVerseEnabled;
    if (settings_.dailyVerseTime !== undefined) updates.dailyVerseTime = settings_.dailyVerseTime;

    const merged = { ...current, ...updates };
    await invoke('update_settings', { settings: merged });
  },
};
