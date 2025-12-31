import React, { useState } from 'react';
import { Sun, Moon, Monitor, Cpu, Cloud, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useSettingsStore } from '../stores/settingsStore';
import { ai } from '../api/ai';
import { settings as settingsApi } from '../api/settings';
import { cn } from '../lib/utils';
import type { LLMProvider, Settings } from '../lib/types';

export const Settings: React.FC = () => {
  const {
    theme,
    fontSize,
    llmProvider,
    llmBaseUrl,
    llmModel,
    llmApiKey,
    setTheme,
    setFontSize,
    setLLMProvider,
    setLLMBaseUrl,
    setLLMModel,
    setLLMApiKey,
  } = useSettingsStore();

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string>('');

  const testConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError('');

    try {
      // First sync settings to backend so the connection test uses current values
      await settingsApi.updateSettings({
        llmProvider,
        llmBaseUrl,
        llmModel,
        llmApiKey,
      });

      // Now test the connection
      const status = await ai.checkConnection();
      if (status.connected) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        setConnectionError('Could not connect to the LLM server');
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const themeOptions: { value: Settings['theme']; label: string; icon: React.ElementType }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const fontSizeOptions: { value: Settings['fontSize']; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' },
  ];

  const llmOptions: { value: LLMProvider; label: string; icon: React.ElementType; description: string }[] = [
    { value: 'lmstudio', label: 'LM Studio', icon: Cpu, description: 'Local AI, free & private' },
    { value: 'ollama', label: 'Ollama', icon: Cpu, description: 'Local AI alternative' },
    { value: 'claude', label: 'Claude', icon: Cloud, description: 'Anthropic cloud API' },
    { value: 'openai', label: 'OpenAI', icon: Zap, description: 'GPT models' },
  ];

  const isLocalProvider = llmProvider === 'lmstudio' || llmProvider === 'ollama';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customize your Bible Verse Hunter experience
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="flex gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                    theme === option.value
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Font Size
            </label>
            <div className="flex gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg border-2 transition-all',
                    fontSize === option.value
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>
            Choose how AI features are powered. Local options are free and private.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="grid grid-cols-2 gap-3">
            {llmOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLLMProvider(option.value)}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left',
                  llmProvider === option.value
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                )}
              >
                <option.icon
                  className={cn(
                    'w-5 h-5 mt-0.5',
                    llmProvider === option.value
                      ? 'text-brand-primary'
                      : 'text-gray-400'
                  )}
                />
                <div>
                  <div
                    className={cn(
                      'font-medium',
                      llmProvider === option.value
                        ? 'text-brand-primary'
                        : 'text-gray-900 dark:text-white'
                    )}
                  >
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Provider-specific settings */}
          {isLocalProvider ? (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Input
                label="Server URL"
                value={llmBaseUrl || ''}
                onChange={(e) => setLLMBaseUrl(e.target.value)}
                placeholder={
                  llmProvider === 'lmstudio'
                    ? 'http://localhost:1234/v1'
                    : 'http://localhost:11434/v1'
                }
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                {llmProvider === 'lmstudio' && (
                  <>
                    <strong>Tip:</strong> If running in WSL with LM Studio on Windows,
                    make sure LM Studio's local server is started (port 1234 by default).
                    WSL can typically access Windows at <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">localhost</code>.
                  </>
                )}
              </p>
              <Input
                label="Model (optional)"
                value={llmModel || ''}
                onChange={(e) => setLLMModel(e.target.value)}
                placeholder="Leave blank to use server default"
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={testConnection}
                  disabled={connectionStatus === 'testing'}
                >
                  {connectionStatus === 'testing' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                {connectionStatus === 'success' && (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Connected
                  </span>
                )}
                {connectionStatus === 'error' && (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                    <XCircle className="w-4 h-4" />
                    {connectionError || 'Failed'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Input
                label="API Key"
                type="password"
                value={llmApiKey || ''}
                onChange={(e) => setLLMApiKey(e.target.value)}
                placeholder={`Enter your ${llmProvider === 'claude' ? 'Anthropic' : 'OpenAI'} API key`}
              />
              <Input
                label="Model"
                value={llmModel || ''}
                onChange={(e) => setLLMModel(e.target.value)}
                placeholder={
                  llmProvider === 'claude'
                    ? 'claude-sonnet-4-20250514'
                    : 'gpt-4o'
                }
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored locally on your device. It is never sent to external servers except the provider you choose.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Export Data
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Download all your notes, highlights, and journal entries
              </div>
            </div>
            <Button variant="secondary">Export</Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Clear All Data
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Remove all local data (cannot be undone)
              </div>
            </div>
            <Button variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                KJV Bible Verse Hunter
              </span>{' '}
              v0.1.0
            </p>
            <p>
              Find wisdom. Apply truth. Transform your life.
            </p>
            <p className="pt-2">
              Built with Tauri, React, and love for Scripture.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
