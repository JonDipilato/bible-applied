import React from 'react';
import { cn } from '../../lib/utils';

interface MarkdownTextProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown-formatted text from LLM responses.
 * Supports: **bold**, *italic*, headings, line breaks.
 */
export const MarkdownText: React.FC<MarkdownTextProps> = ({ content, className }) => {
  const blocks = content.split(/\n\n+/);

  return (
    <div className={cn('space-y-3', className)}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        return <MarkdownBlock key={i} text={trimmed} />;
      })}
    </div>
  );
};

function MarkdownBlock({ text }: { text: string }) {
  // Handle headings
  const h3Match = text.match(/^###\s+(.+)$/m);
  if (h3Match && text.trim() === h3Match[0]) {
    return (
      <h3 className="text-base font-semibold text-primary mt-2">
        <InlineMarkdown text={h3Match[1]} />
      </h3>
    );
  }

  const h2Match = text.match(/^##\s+(.+)$/m);
  if (h2Match && text.trim() === h2Match[0]) {
    return (
      <h2 className="text-lg font-bold text-primary mt-3">
        <InlineMarkdown text={h2Match[1]} />
      </h2>
    );
  }

  // Handle numbered list items (e.g., "1. **[Easy]** Do something")
  const listMatch = text.match(/^(\d+)\.\s+(.+)/s);
  if (listMatch) {
    return (
      <div className="flex gap-3 items-start">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold flex items-center justify-center mt-0.5">
          {listMatch[1]}
        </span>
        <p className="text-primary leading-relaxed flex-1">
          <InlineMarkdown text={listMatch[2]} />
        </p>
      </div>
    );
  }

  // Regular paragraph — may contain line breaks
  const lines = text.split('\n');
  return (
    <p className="text-primary leading-relaxed">
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          <InlineMarkdown text={line} />
        </React.Fragment>
      ))}
    </p>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Parse inline markdown: **bold**, *italic*, `code`
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/s);
    if (boldMatch) {
      if (boldMatch[1]) {
        parts.push(<React.Fragment key={key++}>{boldMatch[1]}</React.Fragment>);
      }
      parts.push(
        <strong key={key++} className="font-semibold text-primary">
          {boldMatch[2]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text*
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/s);
    if (italicMatch) {
      if (italicMatch[1]) {
        parts.push(<React.Fragment key={key++}>{italicMatch[1]}</React.Fragment>);
      }
      parts.push(
        <em key={key++} className="italic text-secondary">
          {italicMatch[2]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^(.*?)`(.+?)`/s);
    if (codeMatch) {
      if (codeMatch[1]) {
        parts.push(<React.Fragment key={key++}>{codeMatch[1]}</React.Fragment>);
      }
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-sm font-mono">
          {codeMatch[2]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // No more markdown — push the rest as plain text
    parts.push(<React.Fragment key={key++}>{remaining}</React.Fragment>);
    break;
  }

  return <>{parts}</>;
}
