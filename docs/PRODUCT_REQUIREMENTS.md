# KJV Bible Verse Hunter
## Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Discovery Complete - Ready for Development

---

## Executive Summary

### Vision Statement
KJV Bible Verse Hunter is a desktop application that helps Christians find Biblical wisdom for life situations and—critically—**apply it** to their daily lives. Unlike traditional Bible apps that stop at verse discovery, this tool bridges the gap between Scripture and practical application.

### Mission
To transform how people engage with Scripture by making Biblical wisdom accessible, searchable, and actionable for every life situation.

### Target Audience
Individual Christians seeking practical spiritual guidance for daily life decisions, challenges, and growth.

---

## Product Overview

| Attribute | Value |
|-----------|-------|
| Product Name | KJV Bible Verse Hunter |
| Platform | Desktop (Windows, macOS, Linux) |
| Framework | Tauri (Rust + React/TypeScript) |
| Translation | King James Version (KJV) - Public Domain |
| Business Model | Freemium |
| MVP Focus | Application-first experience |

---

## Problem Statement

### Current Pain Points
1. **Overwhelm**: The Bible contains ~31,000 verses across 66 books - finding relevant passages is daunting
2. **Disconnect**: Most Bible apps find verses but don't help users apply them
3. **Fragmentation**: Users need multiple tools (Bible app, notes app, devotional, etc.)
4. **Cost/Privacy**: Cloud-dependent apps require subscriptions and send data to servers
5. **One-Size-Fits-All**: Generic search doesn't address specific life situations

### Solution
A unified desktop application that:
- Organizes Scripture by practical life topics
- Provides multiple search methods (topical, keyword, AI-powered)
- Delivers actionable application guidance with every verse
- Respects privacy with local-first architecture
- Supports flexible AI backends (local or cloud)

---

## Core Features

### 1. Bible Text & Navigation
- Complete KJV Bible text with book/chapter/verse navigation
- Clean, readable typography optimized for extended reading
- Quick navigation to any passage
- Bookmarking and history

### 2. Topical Discovery System
Curated collections of verses organized by life topic:

| Topic | Description | Example Verses |
|-------|-------------|----------------|
| Finances & Wealth | Managing money, generosity, contentment | Proverbs 3:9-10, Malachi 3:10 |
| Marriage & Relationships | Love, communication, unity | Ephesians 5:25, 1 Corinthians 13 |
| Anxiety & Fear | Peace, trust, overcoming worry | Philippians 4:6-7, Isaiah 41:10 |
| Health & Healing | Physical/spiritual wellness | Jeremiah 30:17, 3 John 1:2 |
| Parenting & Family | Raising children, family dynamics | Proverbs 22:6, Deuteronomy 6:6-7 |
| Work & Career | Excellence, purpose, integrity | Colossians 3:23, Proverbs 12:11 |
| Salvation & Faith | Coming to Christ, growing faith | Romans 10:9, Ephesians 2:8-9 |
| Forgiveness | Giving and receiving forgiveness | Ephesians 4:32, Matthew 6:14-15 |
| Wisdom & Guidance | Decision-making, discernment | James 1:5, Proverbs 3:5-6 |
| Peace & Rest | Finding calm, Sabbath rest | John 14:27, Matthew 11:28-30 |
| Strength & Courage | Facing challenges, boldness | Joshua 1:9, Isaiah 40:31 |
| Prayer | How to pray, persistence | Matthew 6:9-13, 1 Thessalonians 5:17 |

### 3. Multi-Modal Search

#### Topical Browse
- Visual topic cards with icons
- Subtopics within each category
- Curated verse collections per topic

#### Keyword Search
- Full-text search across KJV
- Phrase matching
- Boolean operators (AND, OR, NOT)
- Search history

#### AI-Powered Semantic Search
- Natural language queries: "What does the Bible say about fear of failure?"
- Context-aware results
- Related verse suggestions
- Configurable LLM backend

### 4. Application Engine (Core Differentiator)

Each verse includes:

#### Practical Action Steps
Concrete, actionable ways to apply the verse:
```
Verse: "Trust in the LORD with all thine heart..." (Proverbs 3:5)

Action Steps:
1. Write down one decision you're currently struggling with
2. List 3 reasons why you can trust God with this specific situation
3. Choose one action to take today based on trusting God, not your own understanding
4. Set a reminder to revisit this decision in prayer tomorrow
```

#### Reflection Questions
Prompts for deeper meditation:
```
- What area of your life are you trying to control instead of trusting God?
- When has trusting God led to better outcomes than your own plans?
- What would full trust look like in your current situation?
```

#### AI-Generated Insights
Personalized application based on:
- User's current life situation (if shared)
- Previous verses studied
- Journal entries and notes
- Specific questions asked

### 5. Personal Study Tools

#### Notes & Highlighting
- Highlight verses with multiple colors
- Add personal notes to any verse
- Link notes across multiple verses
- Rich text formatting

#### Journal
- Daily journal entries
- Attach verses to entries
- Mood/theme tagging
- Private and local by default

#### Collections
- Create custom verse collections
- Share collections (export)
- Import community collections

---

## Technical Architecture

### Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TAURI DESKTOP APP                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 FRONTEND (Web)                       │   │
│  │  • React 18+ with TypeScript                        │   │
│  │  • TailwindCSS for styling                          │   │
│  │  • Zustand for state management                     │   │
│  │  • React Query for data fetching                    │   │
│  │  • Radix UI for accessible components               │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                    Tauri IPC Bridge                         │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  BACKEND (Rust)                      │   │
│  │  • Tauri Core                                        │   │
│  │  • SQLite via rusqlite                              │   │
│  │  • HTTP client for LLM APIs                         │   │
│  │  • Local file system access                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │  LM Studio │     │  Claude    │     │  OpenAI    │
   │  (Local)   │     │   API      │     │   API      │
   └────────────┘     └────────────┘     └────────────┘
```

### Database Schema (SQLite)

```sql
-- Bible Text
CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    testament TEXT NOT NULL, -- 'OT' or 'NT'
    chapter_count INTEGER NOT NULL,
    sort_order INTEGER NOT NULL
);

CREATE TABLE verses (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Topics & Categorization
CREATE TABLE topics (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER
);

CREATE TABLE subtopics (
    id INTEGER PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE verse_topics (
    verse_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    subtopic_id INTEGER,
    relevance_score REAL DEFAULT 1.0,
    PRIMARY KEY (verse_id, topic_id),
    FOREIGN KEY (verse_id) REFERENCES verses(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (subtopic_id) REFERENCES subtopics(id)
);

-- Application Content
CREATE TABLE action_steps (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
);

CREATE TABLE reflection_questions (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
);

-- User Data
CREATE TABLE user_notes (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
);

CREATE TABLE user_highlights (
    id INTEGER PRIMARY KEY,
    verse_id INTEGER NOT NULL,
    color TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
);

CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_verses (
    journal_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    PRIMARY KEY (journal_id, verse_id),
    FOREIGN KEY (journal_id) REFERENCES journal_entries(id),
    FOREIGN KEY (verse_id) REFERENCES verses(id)
);

CREATE TABLE collections (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collection_verses (
    collection_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    sort_order INTEGER,
    PRIMARY KEY (collection_id, verse_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id),
    FOREIGN KEY (verse_id) REFERENCES verses(id)
);

-- Settings & Preferences
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE search_history (
    id INTEGER PRIMARY KEY,
    query TEXT NOT NULL,
    search_type TEXT NOT NULL, -- 'keyword', 'ai', 'topic'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Cache (for cost optimization)
CREATE TABLE ai_cache (
    id INTEGER PRIMARY KEY,
    query_hash TEXT UNIQUE NOT NULL,
    response TEXT NOT NULL,
    model TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);
```

### LLM Integration

#### Configuration
```typescript
interface LLMConfig {
  provider: 'lmstudio' | 'claude' | 'openai' | 'ollama';
  baseUrl?: string;  // For LM Studio/Ollama
  apiKey?: string;   // For Claude/OpenAI
  model: string;
  maxTokens: number;
  temperature: number;
}
```

#### Supported Providers
| Provider | Type | Use Case |
|----------|------|----------|
| LM Studio | Local | Privacy-first, offline, no cost per query |
| Ollama | Local | Alternative local option |
| Claude API | Cloud | High-quality insights, Anthropic models |
| OpenAI API | Cloud | GPT models, wide compatibility |

#### Prompt Templates
```typescript
const VERSE_INSIGHT_PROMPT = `
You are a Biblical wisdom assistant helping Christians apply Scripture to their lives.

Given this verse from the KJV Bible:
{verse_reference}: "{verse_text}"

And this context about the user's situation:
{user_context}

Provide:
1. A brief explanation of the verse's meaning in its Biblical context
2. 3-4 practical ways to apply this verse today
3. A reflection question for deeper meditation
4. Related verses that reinforce this teaching

Keep your tone warm, encouraging, and grounded in Scripture.
`;
```

---

## User Experience

### Design Principles
1. **Readability First**: Typography optimized for extended Scripture reading
2. **Distraction-Free**: Clean interface that keeps focus on the Word
3. **Progressive Disclosure**: Simple surface, depth available on demand
4. **Accessible**: WCAG 2.1 AA compliant, keyboard navigable
5. **Premium Feel**: Modern, bold design that feels valuable

### Design System

#### Color Palette
```css
/* Light Mode */
--background: #FAFAFA;
--surface: #FFFFFF;
--primary: #2563EB;      /* Royal Blue - trust, depth */
--secondary: #7C3AED;    /* Purple - wisdom, spirituality */
--accent: #D97706;       /* Gold - warmth, value */
--text-primary: #1F2937;
--text-secondary: #6B7280;

/* Dark Mode */
--background: #0F172A;
--surface: #1E293B;
--primary: #3B82F6;
--secondary: #8B5CF6;
--accent: #F59E0B;
--text-primary: #F8FAFC;
--text-secondary: #94A3B8;
```

#### Typography
```css
--font-display: 'Crimson Pro', serif;    /* Headings, verse text */
--font-body: 'Inter', sans-serif;        /* UI, notes */
--font-mono: 'JetBrains Mono', monospace; /* References */
```

### Key Screens

#### 1. Home Dashboard
- Quick access to recent topics
- Daily featured verse with application
- Continue where you left off
- Search bar prominently displayed

#### 2. Topic Browse
- Visual grid of topic cards
- Each card shows:
  - Topic icon
  - Topic name
  - Number of verses
  - Brief description

#### 3. Verse View
- Large, readable verse text
- Tab navigation:
  - Application (action steps, reflections)
  - Context (chapter, cross-references)
  - Notes (personal annotations)
  - AI Insights (generated content)
- Quick actions: highlight, note, share, collection

#### 4. Search Results
- Unified results from all search types
- Filters: Testament, Book, Topic
- Sort: Relevance, Book Order
- Preview cards with verse snippet

#### 5. Journal
- Timeline view of entries
- Attached verses sidebar
- Rich text editor
- Tags and filtering

---

## Business Model

### Free Tier
| Feature | Limit |
|---------|-------|
| Full KJV Bible text | Unlimited |
| Topic browsing (12 topics) | Unlimited |
| Keyword search | Unlimited |
| AI search queries | 20/month |
| Pre-written action steps | All included |
| Basic notes | 50 notes |
| Highlights | Unlimited |

### Premium Tier ($4.99/month or $39.99/year)
| Feature | Details |
|---------|---------|
| AI search queries | 500/month (vs 20 free) |
| AI-generated insights | 200/month |
| AI tokens | 100K tokens/month pooled |
| Personal notes | Unlimited |
| Cloud sync | Multi-device |
| Custom collections | Unlimited |
| Export (PDF, Markdown) | All formats |
| Priority support | Email + chat |
| Early access features | Beta features |

### Token-Based Add-Ons
| Package | Tokens | Price |
|---------|--------|-------|
| Starter Pack | 50K tokens | $2.99 |
| Power Pack | 200K tokens | $9.99 |
| Scholar Pack | 500K tokens | $19.99 |

*Tokens never expire. Use your own LLM (LM Studio) for unlimited free queries.*

### Revenue Projections
- Target: 10,000 free users in Year 1
- Conversion rate: 5% to premium
- ARR target: $20,000 (500 premium users)

---

## Development Phases

### Phase 1: Foundation (MVP)
- [ ] Tauri project setup with React/TypeScript
- [ ] SQLite database with KJV text
- [ ] Basic Bible navigation (book/chapter/verse)
- [ ] 3 core topics with curated verses
- [ ] Basic keyword search
- [ ] Simple notes and highlights
- [ ] Dark/light mode

### Phase 2: Application Engine
- [ ] Full 12-topic system
- [ ] Action steps and reflections for top 100 verses
- [ ] LM Studio integration
- [ ] Basic AI search
- [ ] Journal feature

### Phase 3: AI & Polish
- [ ] Claude/OpenAI integration
- [ ] AI-generated insights
- [ ] Personalized recommendations
- [ ] Cloud sync (premium)
- [ ] Export features

### Phase 4: Growth
- [ ] Community collections
- [ ] Additional topics
- [ ] Mobile companion (future)
- [ ] Localization

---

## Success Metrics

### Engagement
- Daily Active Users (DAU)
- Average session duration
- Verses viewed per session
- Notes/highlights created

### Value Delivery
- Action steps completed
- Journal entries written
- AI queries used
- Topics explored

### Business
- Free to premium conversion rate
- Monthly recurring revenue (MRR)
- Customer lifetime value (CLV)
- Churn rate

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| KJV text sourcing issues | Low | High | Multiple public domain sources available |
| AI cost overruns | Medium | Medium | Local LLM option, query caching, rate limits |
| Low conversion rate | Medium | High | Generous free tier, clear premium value |
| Competition from free apps | High | Medium | Differentiate on application focus |
| Technical complexity | Medium | Medium | Phased approach, proven tech stack |

---

## Appendix

### A. KJV Text Sources
- [OpenBible.info](https://www.openbible.info)
- [Bible Gateway API](https://www.biblegateway.com) (check terms)
- [Digital Bible Platform](https://www.digitalbibleplatform.com)
- GitHub repositories with public domain Bible text

### B. Competitive Analysis
| App | Strengths | Weaknesses | Our Differentiation |
|-----|-----------|------------|---------------------|
| YouVersion | Massive user base, social | Cloud-dependent, no local LLM | Privacy, application focus |
| Logos | Deep study tools | Expensive, complex | Simpler, application-focused |
| Blue Letter Bible | Free, comprehensive | Dated UI, no AI | Modern UX, AI integration |
| Olive Tree | Good offline | Limited AI | Local LLM support |

### C. Content Creation Plan
- Phase 1: Curate verses for 12 topics (community + research)
- Phase 2: Write action steps for top 100 verses
- Phase 3: AI-assisted content generation for remaining verses
- Ongoing: Community contributions and refinement

---

*Document prepared through interactive requirements discovery session.*
*Ready for technical architecture and development planning.*
