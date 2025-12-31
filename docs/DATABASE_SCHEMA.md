# KJV Bible Verse Hunter
## Database Schema Documentation

**Version:** 1.0
**Database:** SQLite
**Last Updated:** December 2024

---

## Overview

The database is designed for:
- Fast verse lookup and navigation
- Efficient full-text search
- Flexible topical categorization
- Rich user data (notes, highlights, journal)
- Token/usage tracking for freemium model

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   books     │       │   verses    │       │   topics    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ book_id     │       │ id (PK)     │
│ name        │       │ chapter     │       │ name        │
│ abbrev      │       │ verse       │       │ slug        │
│ testament   │       │ text        │──────►│ description │
│ chapters    │       │ id (PK)     │       │ icon        │
│ sort_order  │       └─────────────┘       └─────────────┘
└─────────────┘              │                     │
                             │                     │
                             ▼                     ▼
                    ┌─────────────────────────────────────┐
                    │          verse_topics              │
                    ├─────────────────────────────────────┤
                    │ verse_id (PK, FK)                   │
                    │ topic_id (PK, FK)                   │
                    │ subtopic_id (FK)                    │
                    │ relevance_score                     │
                    └─────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
           ┌─────────────┐                 ┌─────────────┐
           │ action_steps│                 │ reflections │
           ├─────────────┤                 ├─────────────┤
           │ id (PK)     │                 │ id (PK)     │
           │ verse_id    │                 │ verse_id    │
           │ step_number │                 │ question    │
           │ content     │                 └─────────────┘
           └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ user_notes  │       │ highlights  │       │ journal     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ verse_id    │       │ verse_id    │       │ title       │
│ content     │       │ color       │       │ content     │
│ created_at  │       │ created_at  │       │ mood        │
│ updated_at  │       └─────────────┘       │ created_at  │
└─────────────┘                             │ updated_at  │
                                            └─────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────┐
                                          │journal_verse│
                                          ├─────────────┤
                                          │ journal_id  │
                                          │ verse_id    │
                                          └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ collections │       │ coll_verses │       │ token_usage │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ coll_id     │       │ id (PK)     │
│ name        │       │ verse_id    │       │ provider    │
│ description │       │ sort_order  │       │ input_tokens│
│ is_public   │       └─────────────┘       │ output_tkns │
│ created_at  │                             │ timestamp   │
└─────────────┘                             └─────────────┘
```

---

## Table Definitions

### Core Bible Data

#### `books`
Stores the 66 books of the Bible.

```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,                    -- "Genesis", "Matthew", etc.
    abbreviation TEXT NOT NULL,            -- "Gen", "Matt", etc.
    testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
    chapter_count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL UNIQUE,    -- 1-66 canonical order

    UNIQUE(name),
    UNIQUE(abbreviation)
);

-- Seed data examples:
-- INSERT INTO books VALUES (1, 'Genesis', 'Gen', 'OT', 50, 1);
-- INSERT INTO books VALUES (40, 'Matthew', 'Matt', 'NT', 28, 40);
```

#### `verses`
Stores all ~31,102 KJV verses.

```sql
CREATE TABLE verses (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,

    FOREIGN KEY (book_id) REFERENCES books(id),
    UNIQUE(book_id, chapter, verse)
);

CREATE INDEX idx_verses_book_chapter ON verses(book_id, chapter);
CREATE INDEX idx_verses_lookup ON verses(book_id, chapter, verse);

-- Example:
-- INSERT INTO verses VALUES (1, 1, 1, 1, 'In the beginning God created the heaven and the earth.');
```

---

### Topical System

#### `topics`
12 core life topics for MVP.

```sql
CREATE TABLE topics (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,             -- URL-friendly identifier
    description TEXT,
    icon TEXT,                             -- Icon identifier (e.g., 'wallet', 'heart')
    color TEXT,                            -- Hex color for UI
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed data:
INSERT INTO topics (name, slug, description, icon, color, sort_order) VALUES
    ('Finances & Wealth', 'finances', 'Biblical wisdom for money, stewardship, and generosity', 'wallet', '#10B981', 1),
    ('Marriage & Relationships', 'marriage', 'Love, unity, and building strong relationships', 'heart', '#EC4899', 2),
    ('Anxiety & Fear', 'anxiety', 'Finding peace and overcoming worry', 'shield', '#8B5CF6', 3),
    ('Health & Healing', 'health', 'Physical and spiritual wellness', 'activity', '#06B6D4', 4),
    ('Parenting & Family', 'parenting', 'Raising children and family dynamics', 'users', '#F59E0B', 5),
    ('Work & Career', 'work', 'Excellence, purpose, and integrity in work', 'briefcase', '#3B82F6', 6),
    ('Salvation & Faith', 'salvation', 'Coming to Christ and growing in faith', 'sunrise', '#EF4444', 7),
    ('Forgiveness', 'forgiveness', 'Giving and receiving forgiveness', 'refresh-cw', '#14B8A6', 8),
    ('Wisdom & Guidance', 'wisdom', 'Decision-making and discernment', 'compass', '#6366F1', 9),
    ('Peace & Rest', 'peace', 'Finding calm and Sabbath rest', 'cloud', '#A78BFA', 10),
    ('Strength & Courage', 'strength', 'Facing challenges with boldness', 'zap', '#F97316', 11),
    ('Prayer', 'prayer', 'How to pray and persistence in prayer', 'message-circle', '#84CC16', 12);
```

#### `subtopics`
More specific categories within each topic.

```sql
CREATE TABLE subtopics (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE(topic_id, slug)
);

CREATE INDEX idx_subtopics_topic ON subtopics(topic_id);

-- Example: Subtopics for Finances
INSERT INTO subtopics (topic_id, name, slug, description, sort_order) VALUES
    (1, 'Tithing & Giving', 'tithing', 'Principles of generous giving', 1),
    (1, 'Debt & Borrowing', 'debt', 'Biblical guidance on debt', 2),
    (1, 'Contentment', 'contentment', 'Finding satisfaction regardless of circumstances', 3),
    (1, 'Prosperity & Blessing', 'prosperity', 'God''s promises of provision', 4),
    (1, 'Stewardship', 'stewardship', 'Managing what God has given', 5);
```

#### `verse_topics`
Many-to-many relationship between verses and topics.

```sql
CREATE TABLE verse_topics (
    verse_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    subtopic_id INTEGER,
    relevance_score REAL NOT NULL DEFAULT 1.0,  -- 0.0-1.0, for ranking
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,   -- Primary categorization
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (verse_id, topic_id),
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(id) ON DELETE SET NULL
);

CREATE INDEX idx_verse_topics_topic ON verse_topics(topic_id);
CREATE INDEX idx_verse_topics_subtopic ON verse_topics(subtopic_id);
CREATE INDEX idx_verse_topics_relevance ON verse_topics(relevance_score DESC);
```

---

### Application Content

#### `action_steps`
Practical action steps for applying verses.

```sql
CREATE TABLE action_steps (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,          -- Order within verse (1, 2, 3...)
    content TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'challenging')),

    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
    UNIQUE(verse_id, step_number)
);

CREATE INDEX idx_action_steps_verse ON action_steps(verse_id);

-- Example for Proverbs 3:5
INSERT INTO action_steps (verse_id, step_number, content, difficulty) VALUES
    (15678, 1, 'Write down one decision you are currently struggling with', 'easy'),
    (15678, 2, 'List 3 reasons why you can trust God with this specific situation', 'medium'),
    (15678, 3, 'Choose one action to take today based on trusting God, not your own understanding', 'medium'),
    (15678, 4, 'Set a reminder to revisit this decision in prayer tomorrow', 'easy');
```

#### `reflection_questions`
Questions for deeper meditation.

```sql
CREATE TABLE reflection_questions (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    category TEXT CHECK (category IN ('personal', 'relational', 'spiritual', 'practical')),

    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

CREATE INDEX idx_reflections_verse ON reflection_questions(verse_id);

-- Example for Proverbs 3:5
INSERT INTO reflection_questions (verse_id, question, category) VALUES
    (15678, 'What area of your life are you trying to control instead of trusting God?', 'personal'),
    (15678, 'When has trusting God led to better outcomes than your own plans?', 'spiritual'),
    (15678, 'What would full trust look like in your current situation?', 'practical');
```

---

### User Data

#### `user_notes`
Personal notes on verses.

```sql
CREATE TABLE user_notes (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER,                       -- NULL for general notes
    content TEXT NOT NULL,
    title TEXT,                             -- Optional title
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE SET NULL
);

CREATE INDEX idx_notes_verse ON user_notes(verse_id);
CREATE INDEX idx_notes_updated ON user_notes(updated_at DESC);

-- Trigger to update timestamp
CREATE TRIGGER update_note_timestamp
AFTER UPDATE ON user_notes
BEGIN
    UPDATE user_notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

#### `user_highlights`
Verse highlighting.

```sql
CREATE TABLE user_highlights (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    color TEXT NOT NULL DEFAULT 'yellow',   -- 'yellow', 'green', 'blue', 'pink', 'orange'
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE,
    UNIQUE(verse_id)  -- One highlight per verse
);

CREATE INDEX idx_highlights_color ON user_highlights(color);
```

#### `journal_entries`
Daily journal/devotional entries.

```sql
CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,                              -- Optional mood tag
    tags TEXT,                              -- JSON array of tags
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journal_date ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_mood ON journal_entries(mood);

CREATE TRIGGER update_journal_timestamp
AFTER UPDATE ON journal_entries
BEGIN
    UPDATE journal_entries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

#### `journal_verses`
Verses attached to journal entries.

```sql
CREATE TABLE journal_verses (
    journal_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (journal_id, verse_id),
    FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

CREATE INDEX idx_journal_verses_verse ON journal_verses(verse_id);
```

---

### Collections

#### `collections`
User-created verse collections.

```sql
CREATE TABLE collections (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,  -- For future sharing
    cover_color TEXT DEFAULT '#3B82F6',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_collection_timestamp
AFTER UPDATE ON collections
BEGIN
    UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

#### `collection_verses`
Verses in collections.

```sql
CREATE TABLE collection_verses (
    collection_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    note TEXT,                              -- Optional note specific to this collection
    added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (collection_id, verse_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

CREATE INDEX idx_coll_verses_collection ON collection_verses(collection_id, sort_order);
```

---

### Settings & Preferences

#### `settings`
Key-value store for app settings.

```sql
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Default settings
INSERT INTO settings (key, value) VALUES
    ('theme', 'system'),
    ('font_size', 'medium'),
    ('llm_provider', 'lmstudio'),
    ('llm_base_url', 'http://localhost:1234'),
    ('llm_model', 'default'),
    ('daily_verse_enabled', 'true'),
    ('daily_verse_time', '07:00');
```

#### `search_history`
Track user searches for suggestions and analytics.

```sql
CREATE TABLE search_history (
    id INTEGER PRIMARY KEY,
    query TEXT NOT NULL,
    search_type TEXT NOT NULL CHECK (search_type IN ('keyword', 'ai', 'topic')),
    result_count INTEGER,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_date ON search_history(created_at DESC);
CREATE INDEX idx_search_history_type ON search_history(search_type);

-- Keep only last 100 searches
CREATE TRIGGER limit_search_history
AFTER INSERT ON search_history
BEGIN
    DELETE FROM search_history
    WHERE id NOT IN (
        SELECT id FROM search_history ORDER BY created_at DESC LIMIT 100
    );
END;
```

---

### Token & Usage Tracking

#### `token_usage`
Track LLM token consumption.

```sql
CREATE TABLE token_usage (
    id INTEGER PRIMARY KEY,
    provider TEXT NOT NULL,                 -- 'lmstudio', 'claude', 'openai'
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    request_type TEXT NOT NULL,             -- 'search', 'insights', 'application'
    cached BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_token_usage_date ON token_usage(timestamp);
CREATE INDEX idx_token_usage_provider ON token_usage(provider);

-- View for monthly totals
CREATE VIEW monthly_token_usage AS
SELECT
    strftime('%Y-%m', timestamp) as month,
    provider,
    SUM(input_tokens) as total_input,
    SUM(output_tokens) as total_output,
    COUNT(*) as request_count
FROM token_usage
GROUP BY month, provider;
```

#### `quota_tracking`
Track usage against quotas.

```sql
CREATE TABLE quota_tracking (
    id INTEGER PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    ai_queries_used INTEGER NOT NULL DEFAULT 0,
    ai_queries_limit INTEGER NOT NULL DEFAULT 20,     -- Free tier default
    tokens_used INTEGER NOT NULL DEFAULT 0,
    tokens_limit INTEGER NOT NULL DEFAULT 0,          -- 0 = unlimited (local LLM)
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),

    UNIQUE(period_start)
);

-- Initialize current period
INSERT INTO quota_tracking (period_start, period_end, tier)
VALUES (
    date('now', 'start of month'),
    date('now', 'start of month', '+1 month', '-1 day'),
    'free'
);
```

#### `token_purchases`
Track token pack purchases.

```sql
CREATE TABLE token_purchases (
    id INTEGER PRIMARY KEY,
    package TEXT NOT NULL,                  -- 'starter', 'power', 'scholar'
    tokens_purchased INTEGER NOT NULL,
    tokens_remaining INTEGER NOT NULL,
    price_paid REAL NOT NULL,
    purchased_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME                     -- NULL = never expires
);

CREATE INDEX idx_purchases_remaining ON token_purchases(tokens_remaining);
```

---

### AI Caching

#### `ai_cache`
Cache AI responses to reduce costs.

```sql
CREATE TABLE ai_cache (
    id INTEGER PRIMARY KEY,
    query_hash TEXT NOT NULL UNIQUE,        -- SHA256 of query + context
    query_text TEXT NOT NULL,               -- Original query for debugging
    response TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    hit_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_cache_hash ON ai_cache(query_hash);
CREATE INDEX idx_cache_expires ON ai_cache(expires_at);

-- Cleanup expired cache entries
CREATE TRIGGER cleanup_expired_cache
AFTER INSERT ON ai_cache
BEGIN
    DELETE FROM ai_cache WHERE expires_at < CURRENT_TIMESTAMP;
END;
```

---

## Full-Text Search (Tantivy Index)

For fast text search, we use Tantivy (Rust search library) alongside SQLite:

```rust
// Index schema (Rust)
let mut schema_builder = Schema::builder();

schema_builder.add_i64_field("verse_id", STORED | INDEXED);
schema_builder.add_text_field("text", TEXT | STORED);
schema_builder.add_text_field("reference", STRING | STORED);
schema_builder.add_i64_field("book_id", INDEXED);
schema_builder.add_i64_field("chapter", INDEXED);

let schema = schema_builder.build();
```

The Tantivy index is rebuilt on:
- Initial app setup
- Bible data updates
- Manual rebuild request

---

## Migration Strategy

### Initial Migration (001_initial.sql)

```sql
-- Run all CREATE TABLE statements above
-- Load KJV Bible data
-- Seed topics and subtopics
-- Initialize settings
```

### Migration Versioning

```sql
CREATE TABLE schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version, name) VALUES (1, '001_initial');
```

### Future Migrations

Each migration file:
- `002_add_cross_references.sql`
- `003_add_reading_plans.sql`
- etc.

---

## Data Import

### KJV Bible Data Sources

1. **OpenBible.info** - Clean JSON/CSV format
2. **Bible API** - REST API
3. **GitHub repos** - Public domain text files

### Import Script (Rust)

```rust
pub async fn import_kjv_data(db: &Connection) -> Result<(), Error> {
    // 1. Load books
    // 2. Load verses
    // 3. Build search index
    // 4. Log statistics
}
```

---

## Backup & Restore

### Backup
```sql
-- User data only (excluding Bible text which can be re-imported)
.dump user_notes user_highlights journal_entries journal_verses
      collections collection_verses settings search_history
      token_usage quota_tracking token_purchases
```

### Export Format
- JSON for portability
- SQLite backup for full restore

---

## Performance Considerations

### Indexes Summary
| Table | Index | Purpose |
|-------|-------|---------|
| verses | book_chapter | Navigation |
| verses | lookup | Direct access |
| verse_topics | topic | Topic browsing |
| user_notes | verse | Note lookup |
| journal_entries | date | Timeline view |
| token_usage | date | Usage reports |
| ai_cache | hash | Cache lookup |

### Query Optimization
- All frequent queries use indexed columns
- Pagination for large result sets
- Lazy loading for verse text
- Cache for repeated AI queries

---

*Database schema designed for performance, flexibility, and offline-first operation.*
