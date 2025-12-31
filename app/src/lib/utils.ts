import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format verse reference
export function formatReference(
  bookName: string,
  chapter: number,
  verse: number,
  endVerse?: number
): string {
  if (endVerse && endVerse !== verse) {
    return `${bookName} ${chapter}:${verse}-${endVerse}`;
  }
  return `${bookName} ${chapter}:${verse}`;
}

// Parse verse reference string (e.g., "John 3:16" -> { book: "John", chapter: 3, verse: 16 })
export function parseReference(reference: string): {
  book: string;
  chapter: number;
  verse: number;
  endVerse?: number;
} | null {
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;

  return {
    book: match[1],
    chapter: parseInt(match[2], 10),
    verse: parseInt(match[3], 10),
    endVerse: match[4] ? parseInt(match[4], 10) : undefined,
  };
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Get topic color class
export function getTopicColorClass(slug: string): string {
  const colors: Record<string, string> = {
    finances: 'bg-topic-finances',
    marriage: 'bg-topic-marriage',
    anxiety: 'bg-topic-anxiety',
    health: 'bg-topic-health',
    parenting: 'bg-topic-parenting',
    work: 'bg-topic-work',
    salvation: 'bg-topic-salvation',
    forgiveness: 'bg-topic-forgiveness',
    wisdom: 'bg-topic-wisdom',
    peace: 'bg-topic-peace',
    strength: 'bg-topic-strength',
    prayer: 'bg-topic-prayer',
  };
  return colors[slug] || 'bg-brand-primary';
}

// Get topic text color class
export function getTopicTextColorClass(slug: string): string {
  const colors: Record<string, string> = {
    finances: 'text-topic-finances',
    marriage: 'text-topic-marriage',
    anxiety: 'text-topic-anxiety',
    health: 'text-topic-health',
    parenting: 'text-topic-parenting',
    work: 'text-topic-work',
    salvation: 'text-topic-salvation',
    forgiveness: 'text-topic-forgiveness',
    wisdom: 'text-topic-wisdom',
    peace: 'text-topic-peace',
    strength: 'text-topic-strength',
    prayer: 'text-topic-prayer',
  };
  return colors[slug] || 'text-brand-primary';
}

// Get highlight color class
export function getHighlightClass(color: string): string {
  const colors: Record<string, string> = {
    yellow: 'highlight-yellow',
    green: 'highlight-green',
    blue: 'highlight-blue',
    pink: 'highlight-pink',
    orange: 'highlight-orange',
  };
  return colors[color] || 'highlight-yellow';
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

// Format time for display
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Estimate token count (rough approximation)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Check if system prefers dark mode
export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Local storage helpers with type safety
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}
