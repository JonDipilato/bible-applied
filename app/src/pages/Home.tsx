import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getGreeting } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TopicCard } from '../components/topics/TopicCard';
import { api } from '../api/bible';
import type { VerseWithBook, Topic } from '../lib/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [dailyVerse, setDailyVerse] = useState<VerseWithBook | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [verse, allTopics] = await Promise.all([
          api.bible.getRandomVerse(),
          api.topics.getTopics(),
        ]);
        setDailyVerse(verse);
        setTopics(allTopics.slice(0, 4)); // Show top 4 topics
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const greeting = getGreeting();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {greeting}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Find wisdom and apply Scripture to your life
        </p>
      </div>

      {/* Daily Verse */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Today's Verse
          </h2>
          <Button
            variant="ghost"
            rightIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => navigate('/verse/' + dailyVerse?.id)}
          >
            View Application
          </Button>
        </div>

        {dailyVerse && (
          <Card variant="verse" className="relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-primary/5 to-transparent rounded-full -mr-32 -mt-32" />

            <div className="relative">
              <p className="font-display text-2xl leading-relaxed text-gray-800 dark:text-gray-100 mb-6">
                "{dailyVerse.text}"
              </p>

              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium tracking-wide uppercase text-brand-primary">
                  {dailyVerse.bookName} {dailyVerse.chapter}:{dailyVerse.verse}
                </span>

                <Button
                  variant="primary"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  onClick={() => navigate('/verse/' + dailyVerse.id)}
                >
                  Apply This Verse
                </Button>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Quick Access Topics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Access
          </h2>
          <Button
            variant="ghost"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            onClick={() => navigate('/topics')}
          >
            View All Topics
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* Recent Activity Placeholder */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Continue Reading
        </h2>

        <Card className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your reading history will appear here
          </p>
          <Button variant="secondary" onClick={() => navigate('/bible')}>
            Start Reading
          </Button>
        </Card>
      </section>
    </div>
  );
};
