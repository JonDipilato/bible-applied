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

// AI API — calls Tauri backend directly (LM Studio / OpenAI / Claude)
export const ai = {
  checkConnection: async (): Promise<LlmStatus> => {
    return invoke<LlmStatus>('check_llm_connection');
  },

  getInsight: async (verseText: string, reference: string): Promise<AiInsight> => {
    return invoke<AiInsight>('get_ai_insight', { verseText, reference });
  },

  generateActionSteps: async (verseText: string, reference: string, topic: string): Promise<AiInsight> => {
    return invoke<AiInsight>('generate_action_steps', { verseText, reference, topic });
  },

  generateReflectionQuestions: async (verseText: string, reference: string): Promise<AiInsight> => {
    return invoke<AiInsight>('generate_reflection_questions', { verseText, reference });
  },

  generateWordStudy: async (verseText: string, reference: string): Promise<AiInsight> => {
    return invoke<AiInsight>('generate_word_study', { verseText, reference });
  },
};
