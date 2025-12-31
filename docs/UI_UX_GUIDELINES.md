# KJV Bible Verse Hunter
## UI/UX Design Guidelines

**Version:** 1.0
**Style:** Modern & Bold
**Last Updated:** December 2024

---

## Design Philosophy

### Core Principles

1. **Scripture First** - The Bible text is the hero; everything else supports it
2. **Application-Focused** - Every interaction leads toward practical application
3. **Premium Feel** - Design that feels valuable and worth paying for
4. **Accessible** - Readable by anyone, inclusive of visual impairments
5. **Distraction-Free** - Clean interface that promotes focus and meditation

### Design Goals

- Look modern and professional, not "churchy" or dated
- Feel premium without being pretentious
- Enable deep study without overwhelming new users
- Work beautifully in both light and dark modes

---

## Color System

### Primary Palette

```css
:root {
  /* Brand Colors */
  --brand-primary: #2563EB;       /* Royal Blue - trust, depth, spirituality */
  --brand-secondary: #7C3AED;     /* Purple - wisdom, royalty */
  --brand-accent: #D97706;        /* Gold/Amber - warmth, value, highlights */

  /* Light Mode */
  --light-bg: #FAFAFA;
  --light-surface: #FFFFFF;
  --light-surface-elevated: #FFFFFF;
  --light-border: #E5E7EB;
  --light-border-subtle: #F3F4F6;
  --light-text-primary: #111827;
  --light-text-secondary: #4B5563;
  --light-text-muted: #9CA3AF;

  /* Dark Mode */
  --dark-bg: #0F172A;
  --dark-surface: #1E293B;
  --dark-surface-elevated: #334155;
  --dark-border: #334155;
  --dark-border-subtle: #1E293B;
  --dark-text-primary: #F8FAFC;
  --dark-text-secondary: #CBD5E1;
  --dark-text-muted: #64748B;
}
```

### Semantic Colors

```css
:root {
  /* Status */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;

  /* Highlight Colors (for verse highlighting) */
  --highlight-yellow: #FEF08A;
  --highlight-green: #BBF7D0;
  --highlight-blue: #BFDBFE;
  --highlight-pink: #FBCFE8;
  --highlight-orange: #FED7AA;

  /* Topic Colors */
  --topic-finances: #10B981;
  --topic-marriage: #EC4899;
  --topic-anxiety: #8B5CF6;
  --topic-health: #06B6D4;
  --topic-parenting: #F59E0B;
  --topic-work: #3B82F6;
  --topic-salvation: #EF4444;
  --topic-forgiveness: #14B8A6;
  --topic-wisdom: #6366F1;
  --topic-peace: #A78BFA;
  --topic-strength: #F97316;
  --topic-prayer: #84CC16;
}
```

### Color Usage Guidelines

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `--light-bg` | `--dark-bg` |
| Cards/Panels | `--light-surface` | `--dark-surface` |
| Primary Actions | `--brand-primary` | `--brand-primary` |
| Verse Text | `--light-text-primary` | `--dark-text-primary` |
| UI Labels | `--light-text-secondary` | `--dark-text-secondary` |
| Borders | `--light-border` | `--dark-border` |

---

## Typography

### Font Stack

```css
:root {
  /* Display/Headings - Elegant serif for Scripture */
  --font-display: 'Crimson Pro', 'Georgia', serif;

  /* Body/UI - Clean sans-serif for interface */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Mono - For verse references */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Type Scale

```css
:root {
  /* Headings */
  --text-4xl: 2.25rem;    /* 36px - Hero headings */
  --text-3xl: 1.875rem;   /* 30px - Page titles */
  --text-2xl: 1.5rem;     /* 24px - Section heads */
  --text-xl: 1.25rem;     /* 20px - Card titles */
  --text-lg: 1.125rem;    /* 18px - Verse text */

  /* Body */
  --text-base: 1rem;      /* 16px - Default body */
  --text-sm: 0.875rem;    /* 14px - Secondary text */
  --text-xs: 0.75rem;     /* 12px - Captions */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;  /* For verse reading */
}
```

### Typography Styles

```css
/* Verse Text - The Star */
.verse-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  font-weight: 400;
  letter-spacing: 0.01em;
}

/* Verse Reference */
.verse-reference {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Page Title */
.page-title {
  font-family: var(--font-body);
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Section Header */
.section-header {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}
```

### Font Size Options (User Setting)

| Setting | Verse Text | Body Text |
|---------|------------|-----------|
| Small | 16px | 14px |
| Medium | 18px | 16px |
| Large | 20px | 18px |
| Extra Large | 24px | 20px |

---

## Spacing System

### Base Unit: 4px

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Component Spacing

| Context | Spacing |
|---------|---------|
| Card padding | `--space-6` |
| Section gap | `--space-8` |
| Element gap (horizontal) | `--space-4` |
| Element gap (vertical) | `--space-3` |
| Button padding | `--space-3` / `--space-5` |
| Input padding | `--space-3` / `--space-4` |

---

## Components

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--brand-primary);
  color: white;
  padding: var(--space-3) var(--space-5);
  border-radius: 8px;
  font-weight: 500;
  transition: all 150ms ease;
}

.btn-primary:hover {
  background: #1D4ED8;  /* Darker shade */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
  padding: var(--space-3) var(--space-5);
  border-radius: 8px;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-3);
}
```

### Cards

```css
/* Standard Card */
.card {
  background: var(--surface);
  border-radius: 12px;
  padding: var(--space-6);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* Elevated Card (on hover or selected) */
.card-elevated {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-color: var(--border-subtle);
}

/* Verse Card */
.verse-card {
  background: var(--surface);
  border-radius: 12px;
  padding: var(--space-6);
  border-left: 4px solid var(--brand-primary);
}
```

### Topic Cards

```css
/* Topic Card */
.topic-card {
  background: var(--surface);
  border-radius: 16px;
  padding: var(--space-6);
  transition: all 200ms ease;
  cursor: pointer;
}

.topic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* Topic Icon Container */
.topic-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Background uses topic-specific color with 15% opacity */
}
```

### Search Input

```css
.search-input {
  width: 100%;
  padding: var(--space-4) var(--space-5);
  padding-left: var(--space-12); /* Icon space */
  border-radius: 12px;
  border: 2px solid var(--border);
  background: var(--surface);
  font-size: var(--text-base);
  transition: all 150ms ease;
}

.search-input:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  outline: none;
}
```

### Navigation

```css
/* Sidebar Navigation */
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  color: var(--text-secondary);
  transition: all 150ms ease;
}

.nav-item:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(37, 99, 235, 0.1);
  color: var(--brand-primary);
  font-weight: 500;
}
```

---

## Layout

### Application Shell

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────┐ ┌─────────────────────────────────┐ ┌───────┐ │
│  │  Logo   │ │         Search Bar              │ │ User  │ │
│  └─────────┘ └─────────────────────────────────┘ └───────┘ │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│   SIDEBAR   │              MAIN CONTENT                     │
│             │                                               │
│  ┌────────┐ │  ┌─────────────────────────────────────────┐ │
│  │ Home   │ │  │                                         │ │
│  │ Bible  │ │  │                                         │ │
│  │ Topics │ │  │                                         │ │
│  │ Search │ │  │                                         │ │
│  │ Journal│ │  │                                         │ │
│  └────────┘ │  │                                         │ │
│             │  │                                         │ │
│  ┌────────┐ │  │                                         │ │
│  │Settings│ │  │                                         │ │
│  └────────┘ │  └─────────────────────────────────────────┘ │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

### Dimensions

```css
:root {
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --header-height: 64px;
  --max-content-width: 1200px;
  --reading-width: 720px;  /* Optimal for verse reading */
}
```

### Responsive Breakpoints

```css
/* Tailwind-style breakpoints */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;

/* Sidebar collapses below lg */
@media (max-width: 1024px) {
  .sidebar { width: var(--sidebar-collapsed-width); }
}
```

---

## Key Screens

### 1. Home Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Good morning, David                                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TODAY'S VERSE                                       │   │
│  │                                                       │   │
│  │  "Trust in the LORD with all thine heart;            │   │
│  │   and lean not unto thine own understanding."        │   │
│  │                                                       │   │
│  │  — Proverbs 3:5                                      │   │
│  │                                                       │   │
│  │  [Read Application]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  QUICK ACCESS                                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │ 💰        │ │ 😰        │ │ 🙏        │ │ 💪        │  │
│  │ Finances  │ │ Anxiety   │ │ Prayer    │ │ Strength  │  │
│  │ 48 verses │ │ 52 verses │ │ 35 verses │ │ 41 verses │  │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘  │
│                                                             │
│  CONTINUE READING                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Matthew 6  •  Last read 2 days ago                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Topic Browse

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Browse Topics                                              │
│  Find verses for every area of life                         │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │ 💰            │ │ 💕            │ │ 😰            │     │
│  │               │ │               │ │               │     │
│  │ Finances &    │ │ Marriage &    │ │ Anxiety &     │     │
│  │ Wealth        │ │ Relationships │ │ Fear          │     │
│  │               │ │               │ │               │     │
│  │ 48 verses     │ │ 56 verses     │ │ 52 verses     │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │ 🏥            │ │ 👨‍👩‍👧‍👦            │ │ 💼            │     │
│  │               │ │               │ │               │     │
│  │ Health &      │ │ Parenting &   │ │ Work &        │     │
│  │ Healing       │ │ Family        │ │ Career        │     │
│  │               │ │               │ │               │     │
│  │ 38 verses     │ │ 44 verses     │ │ 41 verses     │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
│                                                             │
│  ... (more topics)                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Verse Detail with Application

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ← Back to Finances                                         │
│                                                             │
│  PROVERBS 3:9-10                                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │  "Honour the LORD with thy substance, and with       │   │
│  │   the firstfruits of all thine increase:             │   │
│  │                                                       │   │
│  │   So shall thy barns be filled with plenty, and      │   │
│  │   thy presses shall burst out with new wine."        │   │
│  │                                                       │   │
│  │  [★ Highlight] [📝 Note] [📁 Save] [↗ Share]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ APPLICATION  │ CONTEXT │ NOTES │ AI INSIGHTS          │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  PRACTICAL ACTION STEPS                                 │ │
│  │                                                         │ │
│  │  ☐ Review your budget and identify "firstfruits"       │ │
│  │    — the first portion of your income                   │ │
│  │                                                         │ │
│  │  ☐ Set up automatic giving to your church or           │ │
│  │    charitable organization before other expenses        │ │
│  │                                                         │ │
│  │  ☐ Write down 3 ways God has provided for you          │ │
│  │    this month as a reminder of His faithfulness        │ │
│  │                                                         │ │
│  │  REFLECTION QUESTIONS                                   │ │
│  │                                                         │ │
│  │  → What does "honouring the LORD" with your finances   │ │
│  │    look like in practical terms?                        │ │
│  │                                                         │ │
│  │  → Are you giving from your "firstfruits" or from      │ │
│  │    what's left over?                                    │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. AI Insights Panel

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  AI INSIGHTS                                 🔄 Regenerate  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✨ Powered by Claude                                 │   │
│  │                                                       │   │
│  │ UNDERSTANDING THIS VERSE                             │   │
│  │                                                       │   │
│  │ In ancient Israel, "firstfruits" referred to the     │   │
│  │ very first harvest—given to God before the farmer    │   │
│  │ knew if the rest would succeed. This required        │   │
│  │ tremendous faith and trust in God's provision.       │   │
│  │                                                       │   │
│  │ PERSONALIZED APPLICATION                             │   │
│  │                                                       │   │
│  │ Based on your recent journal entry about financial   │   │
│  │ uncertainty, this verse encourages you to:           │   │
│  │                                                       │   │
│  │ • Trust God with your finances even when uncertain   │   │
│  │ • Give first, not from leftovers                     │   │
│  │ • Expect God's blessing as you honor Him             │   │
│  │                                                       │   │
│  │ PRAYER PROMPT                                        │   │
│  │                                                       │   │
│  │ "Lord, help me to honor You with the first portion   │   │
│  │ of everything I receive, trusting that You will      │   │
│  │ provide abundantly..."                               │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Tokens used: 847 / 100,000 remaining                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Search Results

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🔍 "dealing with debt"                    [AI] [Keyword]  │
│                                                             │
│  Found 12 relevant verses                                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ROMANS 13:8                              Relevance ●●●● │
│  │                                                       │   │
│  │ "Owe no man any thing, but to love one another..."   │   │
│  │                                                       │   │
│  │ Direct teaching on avoiding debt                      │   │
│  │ [View Application →]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PROVERBS 22:7                            Relevance ●●●○ │
│  │                                                       │   │
│  │ "The rich ruleth over the poor, and the borrower    │   │
│  │  is servant to the lender."                          │   │
│  │                                                       │   │
│  │ Warning about debt's consequences                     │   │
│  │ [View Application →]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ... (more results)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Animations & Interactions

### Micro-interactions

```css
/* Page Transitions */
.page-enter {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 200ms ease-out;
}

/* Card Hover */
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease;
}

/* Button Press */
.btn:active {
  transform: scale(0.98);
}

/* Loading Skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--border) 0%,
    var(--surface-elevated) 50%,
    var(--border) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Loading States

```css
/* AI Processing Indicator */
.ai-loading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.ai-loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary);
  animation: ai-pulse 1.4s ease-in-out infinite;
}

.ai-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes ai-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}
```

---

## Accessibility

### Requirements

- WCAG 2.1 AA compliance
- Keyboard fully navigable
- Screen reader optimized
- Color contrast 4.5:1 minimum
- Focus indicators visible
- Reduced motion support

### Focus States

```css
/* Visible focus ring */
*:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

/* Remove default outline */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icons

### Icon Library: Lucide React

```tsx
// Example usage
import {
  Book,
  Search,
  Bookmark,
  Heart,
  Wallet,
  Shield,
  Activity,
  Users,
  Briefcase,
  Sunrise,
  RefreshCw,
  Compass,
  Cloud,
  Zap,
  MessageCircle,
} from 'lucide-react';

// Topic icons mapping
const TOPIC_ICONS = {
  finances: Wallet,
  marriage: Heart,
  anxiety: Shield,
  health: Activity,
  parenting: Users,
  work: Briefcase,
  salvation: Sunrise,
  forgiveness: RefreshCw,
  wisdom: Compass,
  peace: Cloud,
  strength: Zap,
  prayer: MessageCircle,
};
```

### Icon Sizes

| Context | Size |
|---------|------|
| Navigation | 20px |
| Button icons | 16px |
| Topic cards | 24px |
| Feature icons | 32px |
| Empty states | 48px |

---

## Dark Mode

### Automatic Detection

```typescript
// Respect system preference by default
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

// User can override
type Theme = 'light' | 'dark' | 'system';
```

### Theme Toggle

```tsx
<button onClick={toggleTheme}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

### Color Adaptation

All colors are defined as CSS custom properties that change based on the active theme class on `<html>`:

```css
html.light {
  --bg: var(--light-bg);
  --surface: var(--light-surface);
  /* ... */
}

html.dark {
  --bg: var(--dark-bg);
  --surface: var(--dark-surface);
  /* ... */
}
```

---

## Component Library Reference

### Core Components

| Component | Description |
|-----------|-------------|
| Button | Primary, Secondary, Ghost, Icon variants |
| Card | Standard, Elevated, Verse card |
| Input | Text, Search, Textarea |
| Dialog | Modal dialogs |
| Dropdown | Menus and selects |
| Tabs | Tab navigation |
| Toast | Notifications |
| Tooltip | Contextual help |
| Badge | Status indicators |
| Avatar | User/book icons |
| Skeleton | Loading placeholders |

### Application Components

| Component | Description |
|-----------|-------------|
| VerseCard | Display single verse with actions |
| TopicCard | Topic browse card |
| SearchInput | Global search with AI toggle |
| ApplicationPanel | Action steps + reflections |
| AIInsightsPanel | AI-generated content |
| JournalEditor | Rich text journal entry |
| HighlightPicker | Color selection for highlighting |
| QuotaIndicator | Token/query usage display |

---

*Design system crafted for premium feel, readability, and spiritual focus.*
