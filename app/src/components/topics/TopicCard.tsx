import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Heart,
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
  LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Topic } from '../../lib/types';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  heart: Heart,
  shield: Shield,
  activity: Activity,
  users: Users,
  briefcase: Briefcase,
  sunrise: Sunrise,
  'refresh-cw': RefreshCw,
  compass: Compass,
  cloud: Cloud,
  zap: Zap,
  'message-circle': MessageCircle,
};

interface TopicCardProps {
  topic: Topic;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, className }) => {
  const navigate = useNavigate();
  const Icon = iconMap[topic.icon] || Compass;

  const handleClick = () => {
    navigate(`/topics/${topic.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl group',
        className
      )}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${topic.color}15` }}
      >
        <Icon className="w-7 h-7" style={{ color: topic.color }} />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
        {topic.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {topic.description}
      </p>

      {/* Verse count */}
      {topic.verseCount !== undefined && (
        <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
          <span>{topic.verseCount} verses</span>
        </div>
      )}
    </div>
  );
};

// Grid layout for topics
interface TopicGridProps {
  topics: Topic[];
  className?: string;
}

export const TopicGrid: React.FC<TopicGridProps> = ({ topics, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className
      )}
    >
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
};
