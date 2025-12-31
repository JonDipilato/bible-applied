import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Journal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Journal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Reflect on Scripture and record your thoughts
          </p>
        </div>

        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Entry
        </Button>
      </div>

      {/* Empty state */}
      <Card className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Start Your Journal
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Record your reflections, prayers, and insights as you study Scripture.
          Your journal entries are stored locally and remain private.
        </p>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Create First Entry
        </Button>
      </Card>
    </div>
  );
};
