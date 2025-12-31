-- KJV Bible Verse Hunter Database Schema
-- Version 1.0

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL UNIQUE,
    testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
    chapter_count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL UNIQUE
);

-- Verses Table
CREATE TABLE IF NOT EXISTS verses (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id),
    UNIQUE(book_id, chapter, verse)
);

CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses(book_id, chapter);
CREATE INDEX IF NOT EXISTS idx_verses_lookup ON verses(book_id, chapter, verse);

-- Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
);

-- Subtopics Table
CREATE TABLE IF NOT EXISTS subtopics (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE(topic_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_subtopics_topic ON subtopics(topic_id);

-- Verse Topics Junction Table
CREATE TABLE IF NOT EXISTS verse_topics (
    verse_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    subtopic_id INTEGER,
    relevance_score REAL NOT NULL DEFAULT 1.0,
    is_primary INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (verse_id, topic_id),
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_verse_topics_topic ON verse_topics(topic_id);
CREATE INDEX IF NOT EXISTS idx_verse_topics_subtopic ON verse_topics(subtopic_id);

-- Action Steps Table
CREATE TABLE IF NOT EXISTS action_steps (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'challenging')),
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
    UNIQUE(verse_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_action_steps_verse ON action_steps(verse_id);

-- Reflection Questions Table
CREATE TABLE IF NOT EXISTS reflection_questions (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    category TEXT CHECK (category IN ('personal', 'relational', 'spiritual', 'practical')),
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reflections_verse ON reflection_questions(verse_id);

-- User Notes Table
CREATE TABLE IF NOT EXISTS user_notes (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER,
    title TEXT,
    content TEXT NOT NULL,
    is_pinned INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_verse ON user_notes(verse_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated ON user_notes(updated_at DESC);

-- User Highlights Table
CREATE TABLE IF NOT EXISTS user_highlights (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT 'yellow',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_highlights_color ON user_highlights(color);

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    tags TEXT,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(created_at DESC);

-- Journal Verses Junction Table
CREATE TABLE IF NOT EXISTS journal_verses (
    journal_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (journal_id, verse_id),
    FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

-- Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_public INTEGER NOT NULL DEFAULT 0,
    cover_color TEXT DEFAULT '#3B82F6',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Collection Verses Junction Table
CREATE TABLE IF NOT EXISTS collection_verses (
    collection_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (collection_id, verse_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY,
    query TEXT NOT NULL,
    search_type TEXT NOT NULL CHECK (search_type IN ('keyword', 'ai', 'topic')),
    result_count INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_history_date ON search_history(created_at DESC);

-- Token Usage Table
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    request_type TEXT NOT NULL,
    cached INTEGER NOT NULL DEFAULT 0,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_token_usage_date ON token_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_token_usage_provider ON token_usage(provider);

-- AI Cache Table
CREATE TABLE IF NOT EXISTS ai_cache (
    id INTEGER PRIMARY KEY,
    query_hash TEXT NOT NULL UNIQUE,
    query_text TEXT NOT NULL,
    response TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    hit_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_cache_hash ON ai_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON ai_cache(expires_at);

-- Schema Migrations Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Record this migration
INSERT OR IGNORE INTO schema_migrations (version, name) VALUES (1, '001_initial');
