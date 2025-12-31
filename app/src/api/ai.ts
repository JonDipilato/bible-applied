import { invoke } from '@tauri-apps/api/core';

export interface AiInsight {
  content: string;
  tokensUsed: number;
}

export interface LlmStatus {
  connected: boolean;
  provider: string;
  model: string | null;
}

// AI API for Tauri
export const aiApi = {
  // Check LLM connection status
  checkConnection: async (): Promise<LlmStatus> => {
    return invoke<LlmStatus>('check_llm_connection');
  },

  // Get AI-generated insight for a verse
  getInsight: async (verseText: string, reference: string): Promise<AiInsight> => {
    return invoke<AiInsight>('get_ai_insight', { verseText, reference });
  },

  // Generate action steps for applying a verse
  generateActionSteps: async (verseText: string, reference: string, topic: string): Promise<AiInsight> => {
    return invoke<AiInsight>('generate_action_steps', { verseText, reference, topic });
  },

  // Generate reflection questions for a verse
  generateReflectionQuestions: async (verseText: string, reference: string): Promise<AiInsight> => {
    return invoke<AiInsight>('generate_reflection_questions', { verseText, reference });
  },
};

// Mock AI API for development
export const mockAiApi = {
  checkConnection: async (): Promise<LlmStatus> => {
    // Simulate checking connection to local LLM
    return {
      connected: true,
      provider: 'lmstudio',
      model: 'local-model',
    };
  },

  getInsight: async (_verseText: string, _reference: string): Promise<AiInsight> => {
    void _verseText; void _reference; // Suppress unused warnings
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const insights: Record<string, string> = {
      default: `**Context:** This verse was written to encourage believers in their faith journey.

**Application:** In our modern lives, this truth reminds us that God's promises remain constant regardless of our circumstances. When we face uncertainty, we can anchor ourselves in these timeless words.

**Key Takeaway:** Let this verse be a daily reminder that you are not alone - God's faithfulness extends to every moment of your life.`,
    };

    return {
      content: insights.default,
      tokensUsed: 150,
    };
  },

  generateActionSteps: async (_verseText: string, _reference: string, topic: string): Promise<AiInsight> => {
    void _verseText; void _reference; // Suppress unused warnings
    await new Promise(resolve => setTimeout(resolve, 1200));

    const steps = `1. **[Easy]** Set aside 5 minutes each morning this week to meditate on this verse and how it relates to ${topic.toLowerCase()} in your life.

2. **[Medium]** Identify one specific area where you struggle with ${topic.toLowerCase()}. Write down how this verse speaks to that struggle and share it with a trusted friend.

3. **[Challenging]** Choose one concrete action based on this verse's teaching about ${topic.toLowerCase()}. Commit to it for the next 30 days and journal your experience.`;

    return {
      content: steps,
      tokensUsed: 120,
    };
  },

  generateReflectionQuestions: async (_verseText: string, _reference: string): Promise<AiInsight> => {
    void _verseText; void _reference; // Suppress unused warnings
    await new Promise(resolve => setTimeout(resolve, 1000));

    const questions = `**Personal:** What emotions or memories does this verse stir up in you? How might God be speaking to your current situation through these words?

**Relational:** How could applying this verse improve your relationships with family, friends, or coworkers this week?

**Spiritual:** What does this verse reveal about God's character? How does it deepen your understanding of His love for you?

**Practical:** What is one specific, measurable action you can take today to live out the truth of this verse?`;

    return {
      content: questions,
      tokensUsed: 100,
    };
  },
};

// Check if Tauri is available
// Tauri 2.x uses __TAURI_INTERNALS__ instead of __TAURI__
const isTauriAvailable = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// Unified AI API that switches between Tauri and mock based on availability
export const ai = {
  checkConnection: async (): Promise<LlmStatus> => {
    return isTauriAvailable() ? aiApi.checkConnection() : mockAiApi.checkConnection();
  },
  getInsight: async (verseText: string, reference: string): Promise<AiInsight> => {
    return isTauriAvailable() ? aiApi.getInsight(verseText, reference) : mockAiApi.getInsight(verseText, reference);
  },
  generateActionSteps: async (verseText: string, reference: string, topic: string): Promise<AiInsight> => {
    return isTauriAvailable() ? aiApi.generateActionSteps(verseText, reference, topic) : mockAiApi.generateActionSteps(verseText, reference, topic);
  },
  generateReflectionQuestions: async (verseText: string, reference: string): Promise<AiInsight> => {
    return isTauriAvailable() ? aiApi.generateReflectionQuestions(verseText, reference) : mockAiApi.generateReflectionQuestions(verseText, reference);
  },
};
