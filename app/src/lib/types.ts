// Bible Data Types
export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  chapterCount: number;
  sortOrder: number;
}

export interface Verse {
  id: number;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface VerseWithBook extends Verse {
  bookName: string;
  bookAbbreviation: string;
}

export interface VerseReference {
  bookId: number;
  chapter: number;
  verse: number;
}

// Topic Types
export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  verseCount?: number;
}

export interface Subtopic {
  id: number;
  topicId: number;
  name: string;
  slug: string;
  description: string;
}

export interface VerseWithTopic extends VerseWithBook {
  topicId: number;
  subtopicId?: number;
  relevanceScore: number;
}

// Application Content Types
export interface ActionStep {
  id: number;
  verseId: number;
  stepNumber: number;
  content: string;
  difficulty: 'easy' | 'medium' | 'challenging';
}

export interface ReflectionQuestion {
  id: number;
  verseId: number;
  question: string;
  category: 'personal' | 'relational' | 'spiritual' | 'practical';
}

export interface VerseApplication {
  actionSteps: ActionStep[];
  reflectionQuestions: ReflectionQuestion[];
}

// AI/Insights Types
export interface VerseInsights {
  context: string;
  meaning: string;
  application: string[];
  reflectionQuestion: string;
  relatedVerses: string[];
  tokensUsed: number;
}

// User Data Types
export interface UserNote {
  id: number;
  verseId?: number;
  title?: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserHighlight {
  id: number;
  verseId: number;
  color: HighlightColor;
  createdAt: string;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange';

export interface JournalEntry {
  id: number;
  title?: string;
  content: string;
  mood?: string;
  tags?: string[];
  isFavorite: boolean;
  verseIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  coverColor: string;
  verseCount: number;
  createdAt: string;
}

// Search Types
export interface SearchFilters {
  testament?: 'OT' | 'NT';
  bookIds?: number[];
  topicIds?: number[];
}

export interface SearchResult {
  verse: VerseWithBook;
  matchType: 'keyword' | 'ai' | 'topic';
  relevanceScore?: number;
  snippet?: string;
}

export interface SemanticSearchResult extends SearchResult {
  explanation: string;
}

// Settings Types
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  llmProvider: LLMProvider;
  llmBaseUrl?: string;
  llmModel?: string;
  llmApiKey?: string;  // API key for cloud providers (OpenAI, Claude)
  dailyVerseEnabled: boolean;
  dailyVerseTime: string;
}

export type LLMProvider = 'lmstudio' | 'claude' | 'openai' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  baseUrl?: string;
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface LLMStatus {
  provider: string;
  connected: boolean;
  model?: string;
  error?: string;
}

// Quota Types
export interface QuotaStatus {
  tier: 'free' | 'premium';
  queriesUsed: number;
  queriesLimit: number;
  tokensUsed: number;
  tokensLimit: number;
  purchasedTokens: number;
  resetsAt: string;
}

// UI State Types
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}
