import { invoke } from '@tauri-apps/api/core';
import type { Book, Verse, VerseWithBook, Topic, VerseWithTopic, VerseApplication } from '../lib/types';

// Bible API — calls Tauri backend directly
export const api = {
  bible: {
    getBooks: async (): Promise<Book[]> => {
      return invoke<Book[]>('get_books');
    },
    getVerses: async (bookId: number, chapter: number): Promise<Verse[]> => {
      return invoke<Verse[]>('get_verses', { bookId, chapter });
    },
    getVerse: async (verseId: number): Promise<VerseWithBook> => {
      return invoke<VerseWithBook>('get_verse', { verseId });
    },
    getVerseByReference: async (reference: string): Promise<VerseWithBook> => {
      return invoke<VerseWithBook>('get_verse_by_reference', { reference });
    },
    getRandomVerse: async (topicId?: number): Promise<VerseWithBook> => {
      return invoke<VerseWithBook>('get_random_verse', { topicId });
    },
    searchVerses: async (query: string, limit?: number): Promise<VerseWithBook[]> => {
      return invoke<VerseWithBook[]>('search_verses', { query, limit });
    },
    searchVersesAi: async (query: string, limit?: number): Promise<VerseWithBook[]> => {
      return invoke<VerseWithBook[]>('search_verses_ai', { query, limit });
    },
  },
  topics: {
    getTopics: async (): Promise<Topic[]> => {
      return invoke<Topic[]>('get_topics');
    },
    getVersesByTopic: async (topicId: number, limit?: number): Promise<VerseWithTopic[]> => {
      return invoke<VerseWithTopic[]>('get_verses_by_topic', { topicId, limit });
    },
    getTopicBySlug: async (slug: string): Promise<Topic> => {
      return invoke<Topic>('get_topic_by_slug', { slug });
    },
  },
  application: {
    getVerseApplication: async (verseId: number): Promise<VerseApplication> => {
      return invoke<VerseApplication>('get_verse_application', { verseId });
    },
  },
};
