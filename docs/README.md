# KJV Bible Verse Hunter - Documentation

## Specification Documents

| Document | Description | Size |
|----------|-------------|------|
| [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) | Product vision, features, business model, success metrics | 19KB |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | Tech stack, project structure, services, Rust/React architecture | 27KB |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | SQLite schema, relationships, indexes, migration strategy | 23KB |
| [LLM_INTEGRATION.md](./LLM_INTEGRATION.md) | Provider configs (LM Studio, Claude, OpenAI), prompts, token tracking | 20KB |
| [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md) | Design system, colors, typography, components, screen mockups | 31KB |

---

## Quick Summary

### What We're Building
A **desktop application** (Tauri + React + Rust) that helps Christians find KJV Bible verses by life topic and **apply them** to daily life through action steps, reflections, and AI-powered insights.

### Key Differentiator
**Application-first**: Not just finding verses, but helping users actually apply them through practical action steps, reflection questions, and personalized AI insights.

### Tech Stack
- **Desktop**: Tauri (Rust backend + Web frontend)
- **Frontend**: React 18 + TypeScript + TailwindCSS + Zustand
- **Database**: SQLite (local-first)
- **AI**: Flexible LLM routing (LM Studio local, Claude, OpenAI)
- **Design**: Modern & Bold, dark mode support

### Business Model
**Freemium**:
- Free: Full Bible, 12 topics, keyword search, 20 AI queries/month
- Premium ($4.99/mo): 500 AI queries, 100K tokens, unlimited notes, cloud sync
- Token packs: Buy-as-needed, never expire

### Core Topics (MVP)
1. Finances & Wealth
2. Marriage & Relationships
3. Anxiety & Fear
4. Health & Healing
5. Parenting & Family
6. Work & Career
7. Salvation & Faith
8. Forgiveness
9. Wisdom & Guidance
10. Peace & Rest
11. Strength & Courage
12. Prayer

---

## Next Steps

### Phase 1: Foundation
- [ ] Initialize Tauri project with React/TypeScript
- [ ] Set up SQLite database with KJV text
- [ ] Build basic Bible navigation
- [ ] Implement 3 core topics
- [ ] Create keyword search
- [ ] Add notes and highlights
- [ ] Dark/light mode

### Phase 2: Application Engine
- [ ] Full 12-topic system
- [ ] Action steps and reflections
- [ ] LM Studio integration
- [ ] Basic AI search
- [ ] Journal feature

### Phase 3: AI & Polish
- [ ] Claude/OpenAI integration
- [ ] AI-generated insights
- [ ] Token tracking
- [ ] Premium features
- [ ] Export options

---

## Data Sources Needed

1. **KJV Bible Text**: Public domain, available from OpenBible.info or GitHub
2. **Topical Categorization**: Research + AI-assisted curation
3. **Action Steps**: Manual creation for top verses, AI-assisted for rest
4. **Reflection Questions**: Manual creation + templates

---

*Documentation generated from interactive requirements discovery session.*
