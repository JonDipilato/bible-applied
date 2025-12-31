import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Edit3, Share2, ChevronRight, Heart } from 'lucide-react';
import { cn, formatReference } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useUserStore } from '../../stores/userStore';
import type { VerseWithBook, HighlightColor } from '../../lib/types';

interface VerseCardProps {
  verse: VerseWithBook;
  showActions?: boolean;
  showNavigation?: boolean;
  highlighted?: HighlightColor;
  className?: string;
  onClick?: () => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  showActions = true,
  showNavigation = true,
  highlighted,
  className,
  onClick,
}) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useUserStore();
  const favorite = isFavorite(verse.id);

  const reference = formatReference(verse.bookName, verse.chapter, verse.verse);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (showNavigation) {
      navigate(`/verse/${verse.id}`);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(verse.id);
  };

  // Highlight background class
  const highlightClass = highlighted
    ? {
        yellow: 'bg-highlight-yellow/50',
        green: 'bg-highlight-green/50',
        blue: 'bg-highlight-blue/50',
        pink: 'bg-highlight-pink/50',
        orange: 'bg-highlight-orange/50',
      }[highlighted]
    : '';

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm border-l-4 border-l-brand-primary transition-all duration-200',
        showNavigation && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
        highlightClass,
        className
      )}
    >
      {/* Reference */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-medium tracking-wide uppercase text-brand-primary">
          {reference}
        </span>
        {showNavigation && (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Verse text */}
      <p className="font-display text-lg leading-relaxed text-gray-800 dark:text-gray-200 mb-4">
        "{verse.text}"
      </p>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
          <Button
            variant="icon"
            onClick={handleFavorite}
            className={cn(
              'p-2',
              favorite && 'text-red-500 bg-red-50 dark:bg-red-500/10'
            )}
          >
            <Heart className={cn('w-4 h-4', favorite && 'fill-current')} />
          </Button>
          <Button variant="icon" className="p-2">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="icon" className="p-2">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="icon" className="p-2">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Compact verse display for lists
interface VerseItemProps {
  verse: VerseWithBook;
  onClick?: () => void;
  className?: string;
}

export const VerseItem: React.FC<VerseItemProps> = ({
  verse,
  onClick,
  className,
}) => {
  const navigate = useNavigate();
  const reference = formatReference(verse.bookName, verse.chapter, verse.verse);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/verse/${verse.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 border-b border-gray-100 dark:border-slate-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors',
        className
      )}
    >
      <span className="font-mono text-xs font-medium tracking-wide uppercase text-brand-primary block mb-1">
        {reference}
      </span>
      <p className="font-display text-base leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-2">
        {verse.text}
      </p>
    </div>
  );
};
