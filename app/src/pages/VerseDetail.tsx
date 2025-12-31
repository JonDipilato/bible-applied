import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Highlighter,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../api/bible';
import { ai } from '../api/ai';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn, formatReference } from '../lib/utils';
import type { VerseWithBook, VerseApplication, ActionStep, ReflectionQuestion } from '../lib/types';

export function VerseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAiInsight, setShowAiInsight] = useState(false);
  const [aiInsightExpanded, setAiInsightExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'actions' | 'questions' | 'ai'>('actions');

  const verseId = id ? parseInt(id, 10) : 0;

  // Fetch verse data
  const { data: verse, isLoading: verseLoading } = useQuery({
    queryKey: ['verse', verseId],
    queryFn: () => api.bible.getVerse(verseId),
    enabled: verseId > 0,
  });

  // Fetch application content
  const { data: application, isLoading: applicationLoading } = useQuery({
    queryKey: ['application', verseId],
    queryFn: () => api.application.getVerseApplication(verseId),
    enabled: verseId > 0,
  });

  // AI insight mutation
  const aiInsightMutation = useMutation({
    mutationFn: async () => {
      if (!verse) throw new Error('Verse not loaded');
      const reference = formatReference(verse.bookName, verse.chapter, verse.verse);
      return ai.getInsight(verse.text, reference);
    },
  });

  // Action steps mutation
  const actionStepsMutation = useMutation({
    mutationFn: async () => {
      if (!verse) throw new Error('Verse not loaded');
      const reference = formatReference(verse.bookName, verse.chapter, verse.verse);
      // Use "life" as default topic if not available
      const topic = application?.topic || 'life';
      return ai.generateActionSteps(verse.text, reference, topic);
    },
  });

  // Reflection questions mutation
  const reflectionMutation = useMutation({
    mutationFn: async () => {
      if (!verse) throw new Error('Verse not loaded');
      const reference = formatReference(verse.bookName, verse.chapter, verse.verse);
      return ai.generateReflectionQuestions(verse.text, reference);
    },
  });

  const handleGetAiInsight = () => {
    setShowAiInsight(true);
    aiInsightMutation.mutate();
  };

  const handleGenerateActionSteps = () => {
    actionStepsMutation.mutate();
  };

  const handleGenerateReflections = () => {
    reflectionMutation.mutate();
  };

  if (verseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary">Verse not found</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const reference = formatReference(verse.bookName, verse.chapter, verse.verse);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-display font-bold text-primary">{reference}</h1>
          <p className="text-sm text-secondary">{verse.bookName}</p>
        </div>
      </div>

      {/* Verse Card */}
      <Card className="p-6 verse-card">
        <p className="verse-text text-xl leading-relaxed">"{verse.text}"</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" title="Add to favorites">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Highlight">
            <Highlighter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Add note">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Share">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button
            variant="primary"
            size="sm"
            onClick={handleGetAiInsight}
            disabled={aiInsightMutation.isPending}
          >
            {aiInsightMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            AI Insight
          </Button>
        </div>
      </Card>

      {/* AI Insight */}
      {showAiInsight && (
        <Card className="p-4 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-brand-primary/20">
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => setAiInsightExpanded(!aiInsightExpanded)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary" />
              <span className="font-semibold text-primary">AI Insight</span>
            </div>
            {aiInsightExpanded ? (
              <ChevronUp className="h-4 w-4 text-secondary" />
            ) : (
              <ChevronDown className="h-4 w-4 text-secondary" />
            )}
          </button>

          {aiInsightExpanded && (
            <div className="mt-4">
              {aiInsightMutation.isPending ? (
                <div className="flex items-center gap-2 text-secondary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating insight...</span>
                </div>
              ) : aiInsightMutation.isError ? (
                <p className="text-red-500">Failed to generate insight. Please try again.</p>
              ) : aiInsightMutation.data ? (
                <div className="prose prose-sm max-w-none text-primary">
                  <div className="whitespace-pre-wrap">{aiInsightMutation.data.content}</div>
                  <p className="text-xs text-secondary mt-3">
                    Tokens used: {aiInsightMutation.data.tokensUsed}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </Card>
      )}

      {/* Application Content Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'actions'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-secondary hover:text-primary'
            )}
            onClick={() => setActiveTab('actions')}
          >
            <CheckCircle2 className="h-4 w-4 inline mr-2" />
            Action Steps
          </button>
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'questions'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-secondary hover:text-primary'
            )}
            onClick={() => setActiveTab('questions')}
          >
            <HelpCircle className="h-4 w-4 inline mr-2" />
            Reflection Questions
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {applicationLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          </div>
        ) : (
          <>
            {activeTab === 'actions' && (
              <ActionSteps
                steps={application?.actionSteps || []}
                onGenerate={handleGenerateActionSteps}
                isGenerating={actionStepsMutation.isPending}
                generatedContent={actionStepsMutation.data?.content}
                error={actionStepsMutation.isError ? 'Failed to generate action steps' : undefined}
              />
            )}
            {activeTab === 'questions' && (
              <ReflectionQuestions
                questions={application?.reflectionQuestions || []}
                onGenerate={handleGenerateReflections}
                isGenerating={reflectionMutation.isPending}
                generatedContent={reflectionMutation.data?.content}
                error={reflectionMutation.isError ? 'Failed to generate reflection questions' : undefined}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface ActionStepsProps {
  steps: ActionStep[];
  onGenerate: () => void;
  isGenerating: boolean;
  generatedContent?: string;
  error?: string;
}

function ActionSteps({ steps, onGenerate, isGenerating, generatedContent, error }: ActionStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (id: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedSteps(newCompleted);
  };

  // Show AI-generated content if available
  if (generatedContent) {
    return (
      <Card className="p-6 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-brand-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-brand-primary" />
          <span className="font-semibold text-primary">AI-Generated Action Steps</span>
        </div>
        <div className="prose prose-sm max-w-none text-primary whitespace-pre-wrap">
          {generatedContent}
        </div>
      </Card>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-12 w-12 text-secondary mx-auto mb-3" />
        <p className="text-secondary">No action steps available for this verse yet.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
    );
  }

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    challenging: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <Card
          key={step.id}
          className={cn(
            'p-4 transition-all cursor-pointer',
            completedSteps.has(step.id) && 'bg-brand-primary/5 border-brand-primary/20'
          )}
          onClick={() => toggleStep(step.id)}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              completedSteps.has(step.id)
                ? 'bg-brand-primary border-brand-primary'
                : 'border-border'
            )}>
              {completedSteps.has(step.id) && (
                <CheckCircle2 className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-secondary">Step {step.stepNumber}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full capitalize',
                  difficultyColors[step.difficulty] || 'bg-gray-100 text-gray-700'
                )}>
                  {step.difficulty}
                </span>
              </div>
              <p className={cn(
                'text-primary',
                completedSteps.has(step.id) && 'line-through text-secondary'
              )}>
                {step.content}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface ReflectionQuestionsProps {
  questions: ReflectionQuestion[];
  onGenerate: () => void;
  isGenerating: boolean;
  generatedContent?: string;
  error?: string;
}

function ReflectionQuestions({ questions, onGenerate, isGenerating, generatedContent, error }: ReflectionQuestionsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Show AI-generated content if available
  if (generatedContent) {
    return (
      <Card className="p-6 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-brand-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-brand-primary" />
          <span className="font-semibold text-primary">AI-Generated Reflection Questions</span>
        </div>
        <div className="prose prose-sm max-w-none text-primary whitespace-pre-wrap">
          {generatedContent}
        </div>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="h-12 w-12 text-secondary mx-auto mb-3" />
        <p className="text-secondary">No reflection questions available for this verse yet.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    personal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    relational: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    spiritual: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    practical: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  const categoryIcons: Record<string, string> = {
    personal: '💭',
    relational: '🤝',
    spiritual: '✨',
    practical: '🎯',
  };

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <Card
          key={question.id}
          className="p-4 cursor-pointer hover:border-brand-primary/30 transition-colors"
          onClick={() => setExpandedQuestion(
            expandedQuestion === question.id ? null : question.id
          )}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{categoryIcons[question.category] || '❓'}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full capitalize',
                  categoryColors[question.category] || 'bg-gray-100 text-gray-700'
                )}>
                  {question.category}
                </span>
              </div>
              <p className="text-primary font-medium">{question.question}</p>

              {expandedQuestion === question.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <textarea
                    className="w-full p-3 rounded-lg border border-border bg-background text-primary resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    rows={4}
                    placeholder="Write your reflection here..."
                  />
                  <div className="flex justify-end mt-2">
                    <Button variant="primary" size="sm">
                      Save Reflection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default VerseDetail;
