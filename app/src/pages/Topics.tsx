import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { TopicGrid } from '../components/topics/TopicCard';
import { VerseCard } from '../components/bible/VerseCard';
import { api } from '../api/bible';

export const Topics: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch all topics
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: () => api.topics.getTopics(),
  });

  // Fetch topic details if slug is present
  const { data: currentTopic } = useQuery({
    queryKey: ['topic', slug],
    queryFn: () => api.topics.getTopicBySlug(slug!),
    enabled: !!slug,
  });

  // Fetch verses for the topic if slug is present
  const { data: verses, isLoading: versesLoading } = useQuery({
    queryKey: ['topicVerses', currentTopic?.id],
    queryFn: () => api.topics.getVersesByTopic(currentTopic!.id),
    enabled: !!currentTopic?.id,
  });

  // Show topic detail view if slug is present
  if (slug) {
    if (versesLoading || !currentTopic) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentTopic.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {currentTopic.description}
          </p>
          <p className="text-sm text-brand-primary mt-2">
            {verses?.length || 0} verses
          </p>
        </div>

        <div className="space-y-4">
          {verses?.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              showActions={true}
              showNavigation={true}
            />
          ))}
        </div>

        {(!verses || verses.length === 0) && (
          <p className="text-center py-8 text-gray-500">
            No verses found for this topic yet.
          </p>
        )}
      </div>
    );
  }

  const loading = topicsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Browse Topics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Find verses for every area of life
        </p>
      </div>

      {/* Topics Grid */}
      <TopicGrid topics={topics || []} />
    </div>
  );
};
