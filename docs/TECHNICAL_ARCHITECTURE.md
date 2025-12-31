# KJV Bible Verse Hunter
## Technical Architecture Specification

**Version:** 1.0
**Last Updated:** December 2024

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TAURI APPLICATION                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         FRONTEND LAYER                                 │  │
│  │                                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   React     │  │  TailwindCSS│  │   Zustand   │  │ React Query │  │  │
│  │  │   18.x      │  │             │  │   (State)   │  │  (Data)     │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │                    COMPONENT LIBRARY                             │ │  │
│  │  │  • Radix UI Primitives (Accessible)                             │ │  │
│  │  │  • Custom Components (Premium Feel)                              │ │  │
│  │  │  • Lucide Icons                                                  │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                          Tauri IPC (invoke/listen)                          │
│                                    │                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                          BACKEND LAYER (Rust)                         │  │
│  │                                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Bible     │  │   Search    │  │    User     │  │    LLM      │  │  │
│  │  │   Service   │  │   Engine    │  │   Service   │  │   Router    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │                      DATA LAYER                                  │ │  │
│  │  │  • SQLite (rusqlite)                                            │ │  │
│  │  │  • File System (user data)                                       │ │  │
│  │  │  • Encrypted Storage (API keys)                                  │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             ┌───────────┐  ┌───────────┐  ┌───────────┐
             │ LM Studio │  │  Claude   │  │  OpenAI   │
             │  (Local)  │  │   API     │  │   API     │
             │ Port 1234 │  │           │  │           │
             └───────────┘  └───────────┘  └───────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| TailwindCSS | 3.x | Styling |
| Zustand | 4.x | State Management |
| React Query | 5.x | Server State / Caching |
| Radix UI | Latest | Accessible Primitives |
| Lucide React | Latest | Icons |
| React Router | 6.x | Navigation |
| Framer Motion | Latest | Animations |

### Backend (Rust)

| Technology | Purpose |
|------------|---------|
| Tauri | Desktop Framework |
| rusqlite | SQLite Database |
| reqwest | HTTP Client (LLM APIs) |
| serde | Serialization |
| tokio | Async Runtime |
| ring | Encryption (API keys) |
| tantivy | Full-text Search |

### Development Tools

| Tool | Purpose |
|------|---------|
| Vite | Frontend Build |
| pnpm | Package Manager |
| ESLint | Linting |
| Prettier | Formatting |
| Vitest | Testing |
| Playwright | E2E Testing |

---

## Project Structure

```
bible-verse-hunter/
├── docs/                          # Documentation
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── API_SPECS.md
│
├── src-tauri/                     # Rust Backend
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   ├── lib.rs                # Library exports
│   │   ├── commands/             # Tauri commands
│   │   │   ├── mod.rs
│   │   │   ├── bible.rs          # Bible data commands
│   │   │   ├── search.rs         # Search commands
│   │   │   ├── user.rs           # User data commands
│   │   │   └── llm.rs            # AI commands
│   │   │
│   │   ├── services/             # Business logic
│   │   │   ├── mod.rs
│   │   │   ├── bible_service.rs
│   │   │   ├── search_service.rs
│   │   │   ├── user_service.rs
│   │   │   └── llm_service.rs
│   │   │
│   │   ├── db/                   # Database
│   │   │   ├── mod.rs
│   │   │   ├── connection.rs
│   │   │   ├── migrations.rs
│   │   │   └── models.rs
│   │   │
│   │   ├── llm/                  # LLM Integration
│   │   │   ├── mod.rs
│   │   │   ├── router.rs         # Provider routing
│   │   │   ├── providers/
│   │   │   │   ├── mod.rs
│   │   │   │   ├── lmstudio.rs
│   │   │   │   ├── claude.rs
│   │   │   │   └── openai.rs
│   │   │   └── prompts.rs
│   │   │
│   │   └── utils/
│   │       ├── mod.rs
│   │       ├── encryption.rs
│   │       └── token_counter.rs
│   │
│   ├── migrations/               # SQL migrations
│   │   └── 001_initial.sql
│   │
│   ├── resources/                # Bundled data
│   │   └── kjv.db               # Pre-populated Bible DB
│   │
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                          # React Frontend
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Root component
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── bible/                # Bible-specific
│   │   │   ├── VerseCard.tsx
│   │   │   ├── ChapterView.tsx
│   │   │   ├── BookSelector.tsx
│   │   │   └── VerseHighlight.tsx
│   │   │
│   │   ├── topics/               # Topic browsing
│   │   │   ├── TopicGrid.tsx
│   │   │   ├── TopicCard.tsx
│   │   │   └── SubtopicList.tsx
│   │   │
│   │   ├── search/               # Search UI
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── SearchFilters.tsx
│   │   │
│   │   ├── application/          # Application engine
│   │   │   ├── ActionSteps.tsx
│   │   │   ├── ReflectionQuestions.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   └── ApplicationPanel.tsx
│   │   │
│   │   ├── journal/              # Journal & notes
│   │   │   ├── JournalEditor.tsx
│   │   │   ├── JournalEntry.tsx
│   │   │   └── NotesSidebar.tsx
│   │   │
│   │   └── settings/             # Settings
│   │       ├── SettingsPanel.tsx
│   │       ├── LLMConfig.tsx
│   │       └── ThemeSelector.tsx
│   │
│   ├── pages/                    # Route pages
│   │   ├── Home.tsx
│   │   ├── Bible.tsx
│   │   ├── Topics.tsx
│   │   ├── Search.tsx
│   │   ├── Journal.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useBible.ts
│   │   ├── useSearch.ts
│   │   ├── useLLM.ts
│   │   ├── useNotes.ts
│   │   └── useTheme.ts
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── bibleStore.ts
│   │   ├── searchStore.ts
│   │   ├── userStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── api/                      # Tauri API calls
│   │   ├── bible.ts
│   │   ├── search.ts
│   │   ├── user.ts
│   │   └── llm.ts
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── types.ts
│   │
│   └── styles/                   # Global styles
│       ├── globals.css
│       └── themes/
│           ├── light.css
│           └── dark.css
│
├── public/                       # Static assets
│   └── icons/
│
├── tests/                        # Tests
│   ├── unit/
│   └── e2e/
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## Core Services Architecture

### 1. Bible Service

```rust
// src-tauri/src/services/bible_service.rs

pub struct BibleService {
    db: Arc<Connection>,
}

impl BibleService {
    // Get all books
    pub fn get_books(&self) -> Result<Vec<Book>, Error>

    // Get chapters in a book
    pub fn get_chapters(&self, book_id: i32) -> Result<Vec<Chapter>, Error>

    // Get verses in a chapter
    pub fn get_verses(&self, book_id: i32, chapter: i32) -> Result<Vec<Verse>, Error>

    // Get single verse
    pub fn get_verse(&self, book_id: i32, chapter: i32, verse: i32) -> Result<Verse, Error>

    // Get verse by reference string (e.g., "John 3:16")
    pub fn get_verse_by_reference(&self, reference: &str) -> Result<Verse, Error>

    // Get verses by topic
    pub fn get_verses_by_topic(&self, topic_id: i32) -> Result<Vec<VerseWithTopic>, Error>

    // Get verse context (surrounding verses)
    pub fn get_verse_context(&self, verse_id: i32, range: i32) -> Result<Vec<Verse>, Error>
}
```

### 2. Search Service

```rust
// src-tauri/src/services/search_service.rs

pub struct SearchService {
    db: Arc<Connection>,
    index: Arc<Index>,  // Tantivy full-text index
}

impl SearchService {
    // Keyword search
    pub fn search_keyword(&self, query: &str, filters: SearchFilters) -> Result<Vec<SearchResult>, Error>

    // Topic search
    pub fn search_topic(&self, topic_id: i32, subtopic_id: Option<i32>) -> Result<Vec<SearchResult>, Error>

    // Build/rebuild search index
    pub fn rebuild_index(&self) -> Result<(), Error>

    // Get search suggestions
    pub fn get_suggestions(&self, partial: &str) -> Result<Vec<String>, Error>
}
```

### 3. LLM Service

```rust
// src-tauri/src/services/llm_service.rs

pub struct LLMService {
    config: LLMConfig,
    token_tracker: TokenTracker,
    cache: ResponseCache,
}

impl LLMService {
    // AI-powered search
    pub async fn semantic_search(&self, query: &str) -> Result<Vec<SemanticSearchResult>, Error>

    // Generate verse insights
    pub async fn generate_insights(&self, verse_id: i32, context: Option<&str>) -> Result<VerseInsights, Error>

    // Generate application content
    pub async fn generate_application(&self, verse_id: i32) -> Result<ApplicationContent, Error>

    // Check remaining tokens/quota
    pub fn check_quota(&self) -> Result<QuotaStatus, Error>

    // Get provider status
    pub fn get_provider_status(&self) -> Result<ProviderStatus, Error>
}
```

### 4. User Service

```rust
// src-tauri/src/services/user_service.rs

pub struct UserService {
    db: Arc<Connection>,
}

impl UserService {
    // Notes
    pub fn create_note(&self, note: NewNote) -> Result<Note, Error>
    pub fn update_note(&self, id: i32, content: &str) -> Result<Note, Error>
    pub fn delete_note(&self, id: i32) -> Result<(), Error>
    pub fn get_notes_for_verse(&self, verse_id: i32) -> Result<Vec<Note>, Error>

    // Highlights
    pub fn add_highlight(&self, verse_id: i32, color: &str) -> Result<Highlight, Error>
    pub fn remove_highlight(&self, id: i32) -> Result<(), Error>
    pub fn get_highlights(&self) -> Result<Vec<Highlight>, Error>

    // Journal
    pub fn create_journal_entry(&self, entry: NewJournalEntry) -> Result<JournalEntry, Error>
    pub fn update_journal_entry(&self, id: i32, entry: UpdateJournalEntry) -> Result<JournalEntry, Error>
    pub fn delete_journal_entry(&self, id: i32) -> Result<(), Error>
    pub fn get_journal_entries(&self, filter: JournalFilter) -> Result<Vec<JournalEntry>, Error>

    // Collections
    pub fn create_collection(&self, name: &str, description: Option<&str>) -> Result<Collection, Error>
    pub fn add_to_collection(&self, collection_id: i32, verse_id: i32) -> Result<(), Error>
    pub fn remove_from_collection(&self, collection_id: i32, verse_id: i32) -> Result<(), Error>
    pub fn get_collections(&self) -> Result<Vec<Collection>, Error>

    // Settings
    pub fn get_setting(&self, key: &str) -> Result<Option<String>, Error>
    pub fn set_setting(&self, key: &str, value: &str) -> Result<(), Error>
}
```

---

## LLM Integration Architecture

### Provider Router

```rust
// src-tauri/src/llm/router.rs

pub enum LLMProvider {
    LMStudio { base_url: String },
    Claude { api_key: String },
    OpenAI { api_key: String },
    Ollama { base_url: String },
}

pub struct LLMRouter {
    providers: HashMap<String, Box<dyn LLMProvider>>,
    active_provider: String,
    fallback_chain: Vec<String>,
}

impl LLMRouter {
    // Route request to appropriate provider
    pub async fn complete(&self, request: CompletionRequest) -> Result<CompletionResponse, Error>

    // Test provider connection
    pub async fn test_connection(&self, provider: &str) -> Result<bool, Error>

    // Switch active provider
    pub fn set_active_provider(&mut self, provider: &str) -> Result<(), Error>

    // Get available providers
    pub fn list_providers(&self) -> Vec<ProviderInfo>
}
```

### Token Tracking

```rust
// src-tauri/src/llm/token_tracker.rs

pub struct TokenTracker {
    db: Arc<Connection>,
}

#[derive(Debug)]
pub struct TokenUsage {
    pub provider: String,
    pub input_tokens: i64,
    pub output_tokens: i64,
    pub timestamp: DateTime<Utc>,
}

impl TokenTracker {
    // Record token usage
    pub fn record_usage(&self, usage: TokenUsage) -> Result<(), Error>

    // Get usage for period
    pub fn get_usage(&self, period: UsagePeriod) -> Result<UsageStats, Error>

    // Check if within quota
    pub fn check_quota(&self, tier: UserTier) -> Result<QuotaStatus, Error>

    // Get remaining tokens
    pub fn remaining_tokens(&self, tier: UserTier) -> Result<i64, Error>
}

pub struct QuotaStatus {
    pub tokens_used: i64,
    pub tokens_remaining: i64,
    pub queries_used: i32,
    pub queries_remaining: i32,
    pub resets_at: DateTime<Utc>,
}
```

### Response Caching

```rust
// src-tauri/src/llm/cache.rs

pub struct ResponseCache {
    db: Arc<Connection>,
    ttl_hours: i32,
}

impl ResponseCache {
    // Get cached response
    pub fn get(&self, query_hash: &str) -> Result<Option<CachedResponse>, Error>

    // Store response
    pub fn set(&self, query_hash: &str, response: &str, model: &str) -> Result<(), Error>

    // Clear expired entries
    pub fn cleanup(&self) -> Result<i64, Error>

    // Invalidate specific cache
    pub fn invalidate(&self, query_hash: &str) -> Result<(), Error>
}
```

---

## Tauri Commands (IPC Bridge)

```rust
// src-tauri/src/commands/mod.rs

// Bible Commands
#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Vec<Book>, String>

#[tauri::command]
pub async fn get_verses(state: State<'_, AppState>, book_id: i32, chapter: i32) -> Result<Vec<Verse>, String>

#[tauri::command]
pub async fn get_verse_by_reference(state: State<'_, AppState>, reference: String) -> Result<Verse, String>

#[tauri::command]
pub async fn get_verses_by_topic(state: State<'_, AppState>, topic_id: i32) -> Result<Vec<VerseWithTopic>, String>

// Search Commands
#[tauri::command]
pub async fn search_keyword(state: State<'_, AppState>, query: String, filters: SearchFilters) -> Result<Vec<SearchResult>, String>

#[tauri::command]
pub async fn search_semantic(state: State<'_, AppState>, query: String) -> Result<Vec<SemanticSearchResult>, String>

// LLM Commands
#[tauri::command]
pub async fn generate_insights(state: State<'_, AppState>, verse_id: i32, context: Option<String>) -> Result<VerseInsights, String>

#[tauri::command]
pub async fn get_llm_status(state: State<'_, AppState>) -> Result<LLMStatus, String>

#[tauri::command]
pub async fn test_llm_connection(state: State<'_, AppState>, provider: String) -> Result<bool, String>

#[tauri::command]
pub async fn get_token_usage(state: State<'_, AppState>) -> Result<TokenUsage, String>

// User Commands
#[tauri::command]
pub async fn create_note(state: State<'_, AppState>, note: NewNote) -> Result<Note, String>

#[tauri::command]
pub async fn get_notes(state: State<'_, AppState>, verse_id: Option<i32>) -> Result<Vec<Note>, String>

#[tauri::command]
pub async fn create_journal_entry(state: State<'_, AppState>, entry: NewJournalEntry) -> Result<JournalEntry, String>

#[tauri::command]
pub async fn get_journal_entries(state: State<'_, AppState>, filter: JournalFilter) -> Result<Vec<JournalEntry>, String>

// Settings Commands
#[tauri::command]
pub async fn get_settings(state: State<'_, AppState>) -> Result<Settings, String>

#[tauri::command]
pub async fn update_settings(state: State<'_, AppState>, settings: Settings) -> Result<(), String>
```

---

## Frontend API Layer

```typescript
// src/api/bible.ts
import { invoke } from '@tauri-apps/api/tauri';

export const bibleApi = {
  getBooks: () => invoke<Book[]>('get_books'),

  getVerses: (bookId: number, chapter: number) =>
    invoke<Verse[]>('get_verses', { bookId, chapter }),

  getVerseByReference: (reference: string) =>
    invoke<Verse>('get_verse_by_reference', { reference }),

  getVersesByTopic: (topicId: number) =>
    invoke<VerseWithTopic[]>('get_verses_by_topic', { topicId }),
};

// src/api/search.ts
export const searchApi = {
  searchKeyword: (query: string, filters?: SearchFilters) =>
    invoke<SearchResult[]>('search_keyword', { query, filters }),

  searchSemantic: (query: string) =>
    invoke<SemanticSearchResult[]>('search_semantic', { query }),
};

// src/api/llm.ts
export const llmApi = {
  generateInsights: (verseId: number, context?: string) =>
    invoke<VerseInsights>('generate_insights', { verseId, context }),

  getStatus: () => invoke<LLMStatus>('get_llm_status'),

  testConnection: (provider: string) =>
    invoke<boolean>('test_llm_connection', { provider }),

  getTokenUsage: () => invoke<TokenUsage>('get_token_usage'),
};

// src/api/user.ts
export const userApi = {
  createNote: (note: NewNote) => invoke<Note>('create_note', { note }),
  getNotes: (verseId?: number) => invoke<Note[]>('get_notes', { verseId }),

  createJournalEntry: (entry: NewJournalEntry) =>
    invoke<JournalEntry>('create_journal_entry', { entry }),

  getJournalEntries: (filter?: JournalFilter) =>
    invoke<JournalEntry[]>('get_journal_entries', { filter }),
};
```

---

## State Management (Zustand)

```typescript
// src/stores/bibleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BibleState {
  // Current navigation
  currentBook: Book | null;
  currentChapter: number;
  currentVerse: Verse | null;

  // Actions
  setBook: (book: Book) => void;
  setChapter: (chapter: number) => void;
  setVerse: (verse: Verse) => void;

  // History
  history: VerseReference[];
  addToHistory: (ref: VerseReference) => void;
}

export const useBibleStore = create<BibleState>()(
  persist(
    (set, get) => ({
      currentBook: null,
      currentChapter: 1,
      currentVerse: null,
      history: [],

      setBook: (book) => set({ currentBook: book, currentChapter: 1 }),
      setChapter: (chapter) => set({ currentChapter: chapter }),
      setVerse: (verse) => {
        const ref = { bookId: verse.bookId, chapter: verse.chapter, verse: verse.verse };
        set({ currentVerse: verse });
        get().addToHistory(ref);
      },

      addToHistory: (ref) => set((state) => ({
        history: [ref, ...state.history.slice(0, 49)], // Keep last 50
      })),
    }),
    { name: 'bible-store' }
  )
);

// src/stores/settingsStore.ts
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';

  // LLM Settings
  llmProvider: string;
  llmBaseUrl?: string;
  llmApiKey?: string;
  llmModel: string;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setLLMConfig: (config: LLMConfig) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      fontSize: 'medium',
      llmProvider: 'lmstudio',
      llmBaseUrl: 'http://localhost:1234',
      llmModel: 'default',

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLLMConfig: (config) => set({
        llmProvider: config.provider,
        llmBaseUrl: config.baseUrl,
        llmApiKey: config.apiKey,
        llmModel: config.model,
      }),
    }),
    { name: 'settings-store' }
  )
);
```

---

## Security Considerations

### API Key Storage

```rust
// src-tauri/src/utils/encryption.rs
use ring::aead::{Aad, LessSafeKey, Nonce, UnboundKey, AES_256_GCM};

pub struct SecureStorage {
    key: LessSafeKey,
}

impl SecureStorage {
    // Encrypt API key before storing
    pub fn encrypt(&self, plaintext: &str) -> Result<Vec<u8>, Error>

    // Decrypt API key when needed
    pub fn decrypt(&self, ciphertext: &[u8]) -> Result<String, Error>
}
```

### Data Privacy
- All user data stored locally (SQLite)
- API keys encrypted at rest
- No telemetry without explicit consent
- Local LLM option for full privacy

---

## Performance Optimizations

### Database
- Indexes on frequently queried columns
- Full-text search via Tantivy
- Connection pooling
- Prepared statements

### Frontend
- Virtual scrolling for long lists
- React Query caching
- Code splitting by route
- Lazy loading components

### LLM
- Response caching (24h TTL)
- Token estimation before requests
- Streaming responses where supported
- Request debouncing

---

## Build & Distribution

### Development
```bash
# Install dependencies
pnpm install
cd src-tauri && cargo build

# Development mode
pnpm tauri dev
```

### Production Build
```bash
# Build for current platform
pnpm tauri build

# Output:
# - Windows: .msi, .exe
# - macOS: .dmg, .app
# - Linux: .deb, .AppImage
```

### Auto-Updates
- Tauri updater for seamless updates
- Differential updates for efficiency
- Release channels (stable, beta)

---

## Testing Strategy

### Unit Tests
- Rust services: `cargo test`
- React components: Vitest
- Coverage target: 80%

### Integration Tests
- Tauri commands with mock DB
- API layer tests

### E2E Tests
- Playwright for critical paths
- Cross-platform verification

---

*Technical architecture designed for scalability, privacy, and premium user experience.*
