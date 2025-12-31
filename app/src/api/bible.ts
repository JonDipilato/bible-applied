import { invoke } from '@tauri-apps/api/core';
import type { Book, Verse, VerseWithBook, Topic, VerseWithTopic, VerseApplication } from '../lib/types';

// Bible API
export const bibleApi = {
  // Get all books
  getBooks: async (): Promise<Book[]> => {
    return invoke<Book[]>('get_books');
  },

  // Get verses for a chapter
  getVerses: async (bookId: number, chapter: number): Promise<Verse[]> => {
    return invoke<Verse[]>('get_verses', { bookId, chapter });
  },

  // Get a single verse by ID
  getVerse: async (verseId: number): Promise<VerseWithBook> => {
    return invoke<VerseWithBook>('get_verse', { verseId });
  },

  // Get verse by reference string (e.g., "John 3:16")
  getVerseByReference: async (reference: string): Promise<VerseWithBook> => {
    return invoke<VerseWithBook>('get_verse_by_reference', { reference });
  },

  // Get random verse (for daily verse)
  getRandomVerse: async (topicId?: number): Promise<VerseWithBook> => {
    return invoke<VerseWithBook>('get_random_verse', { topicId });
  },

  // Search verses by text
  searchVerses: async (query: string, limit?: number): Promise<VerseWithBook[]> => {
    return invoke<VerseWithBook[]>('search_verses', { query, limit });
  },
};

// Topics API
export const topicsApi = {
  // Get all topics
  getTopics: async (): Promise<Topic[]> => {
    return invoke<Topic[]>('get_topics');
  },

  // Get verses for a topic
  getVersesByTopic: async (topicId: number, limit?: number): Promise<VerseWithTopic[]> => {
    return invoke<VerseWithTopic[]>('get_verses_by_topic', { topicId, limit });
  },

  // Get topic by slug
  getTopicBySlug: async (slug: string): Promise<Topic> => {
    return invoke<Topic>('get_topic_by_slug', { slug });
  },
};

// Application Content API
export const applicationApi = {
  // Get application content for a verse
  getVerseApplication: async (verseId: number): Promise<VerseApplication> => {
    return invoke<VerseApplication>('get_verse_application', { verseId });
  },
};

// Mock data for development (used when Tauri is not available)
export const mockBibleApi = {
  getBooks: async (): Promise<Book[]> => {
    return [
      // Old Testament
      { id: 1, name: 'Genesis', abbreviation: 'Gen', testament: 'OT', chapterCount: 50, sortOrder: 1 },
      { id: 2, name: 'Exodus', abbreviation: 'Exod', testament: 'OT', chapterCount: 40, sortOrder: 2 },
      { id: 3, name: 'Leviticus', abbreviation: 'Lev', testament: 'OT', chapterCount: 27, sortOrder: 3 },
      { id: 4, name: 'Numbers', abbreviation: 'Num', testament: 'OT', chapterCount: 36, sortOrder: 4 },
      { id: 5, name: 'Deuteronomy', abbreviation: 'Deut', testament: 'OT', chapterCount: 34, sortOrder: 5 },
      { id: 6, name: 'Joshua', abbreviation: 'Josh', testament: 'OT', chapterCount: 24, sortOrder: 6 },
      { id: 18, name: 'Job', abbreviation: 'Job', testament: 'OT', chapterCount: 42, sortOrder: 18 },
      { id: 19, name: 'Psalms', abbreviation: 'Ps', testament: 'OT', chapterCount: 150, sortOrder: 19 },
      { id: 20, name: 'Proverbs', abbreviation: 'Prov', testament: 'OT', chapterCount: 31, sortOrder: 20 },
      { id: 21, name: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'OT', chapterCount: 12, sortOrder: 21 },
      { id: 22, name: 'Song of Solomon', abbreviation: 'Song', testament: 'OT', chapterCount: 8, sortOrder: 22 },
      { id: 23, name: 'Isaiah', abbreviation: 'Isa', testament: 'OT', chapterCount: 66, sortOrder: 23 },
      { id: 24, name: 'Jeremiah', abbreviation: 'Jer', testament: 'OT', chapterCount: 52, sortOrder: 24 },
      { id: 39, name: 'Malachi', abbreviation: 'Mal', testament: 'OT', chapterCount: 4, sortOrder: 39 },
      // New Testament
      { id: 40, name: 'Matthew', abbreviation: 'Matt', testament: 'NT', chapterCount: 28, sortOrder: 40 },
      { id: 41, name: 'Mark', abbreviation: 'Mark', testament: 'NT', chapterCount: 16, sortOrder: 41 },
      { id: 42, name: 'Luke', abbreviation: 'Luke', testament: 'NT', chapterCount: 24, sortOrder: 42 },
      { id: 43, name: 'John', abbreviation: 'John', testament: 'NT', chapterCount: 21, sortOrder: 43 },
      { id: 44, name: 'Acts', abbreviation: 'Acts', testament: 'NT', chapterCount: 28, sortOrder: 44 },
      { id: 45, name: 'Romans', abbreviation: 'Rom', testament: 'NT', chapterCount: 16, sortOrder: 45 },
      { id: 46, name: '1 Corinthians', abbreviation: '1Cor', testament: 'NT', chapterCount: 16, sortOrder: 46 },
      { id: 47, name: '2 Corinthians', abbreviation: '2Cor', testament: 'NT', chapterCount: 13, sortOrder: 47 },
      { id: 48, name: 'Galatians', abbreviation: 'Gal', testament: 'NT', chapterCount: 6, sortOrder: 48 },
      { id: 49, name: 'Ephesians', abbreviation: 'Eph', testament: 'NT', chapterCount: 6, sortOrder: 49 },
      { id: 50, name: 'Philippians', abbreviation: 'Phil', testament: 'NT', chapterCount: 4, sortOrder: 50 },
      { id: 51, name: 'Colossians', abbreviation: 'Col', testament: 'NT', chapterCount: 4, sortOrder: 51 },
      { id: 58, name: 'Hebrews', abbreviation: 'Heb', testament: 'NT', chapterCount: 13, sortOrder: 58 },
      { id: 59, name: 'James', abbreviation: 'Jas', testament: 'NT', chapterCount: 5, sortOrder: 59 },
      { id: 60, name: '1 Peter', abbreviation: '1Pet', testament: 'NT', chapterCount: 5, sortOrder: 60 },
      { id: 62, name: '1 John', abbreviation: '1John', testament: 'NT', chapterCount: 5, sortOrder: 62 },
      { id: 66, name: 'Revelation', abbreviation: 'Rev', testament: 'NT', chapterCount: 22, sortOrder: 66 },
    ];
  },

  getVerses: async (_bookId: number, _chapter: number): Promise<Verse[]> => {
    return [
      { id: 1, bookId: 1, chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
      { id: 2, bookId: 1, chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { id: 3, bookId: 1, chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
    ];
  },

  getVerse: async (_verseId: number): Promise<VerseWithBook> => {
    return {
      id: 26126,
      bookId: 43,
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      bookName: 'John',
      bookAbbreviation: 'John',
    };
  },

  getVerseByReference: async (_reference: string): Promise<VerseWithBook> => {
    return {
      id: 26126,
      bookId: 43,
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      bookName: 'John',
      bookAbbreviation: 'John',
    };
  },

  getRandomVerse: async (_topicId?: number): Promise<VerseWithBook> => {
    const verses = [
      {
        id: 1,
        bookId: 20,
        chapter: 3,
        verse: 5,
        text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
        bookName: 'Proverbs',
        bookAbbreviation: 'Prov',
      },
      {
        id: 2,
        bookId: 50,
        chapter: 4,
        verse: 6,
        text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
        bookName: 'Philippians',
        bookAbbreviation: 'Phil',
      },
      {
        id: 3,
        bookId: 40,
        chapter: 6,
        verse: 33,
        text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
        bookName: 'Matthew',
        bookAbbreviation: 'Matt',
      },
      {
        id: 4,
        bookId: 23,
        chapter: 41,
        verse: 10,
        text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
        bookName: 'Isaiah',
        bookAbbreviation: 'Isa',
      },
      {
        id: 5,
        bookId: 50,
        chapter: 4,
        verse: 13,
        text: 'I can do all things through Christ which strengtheneth me.',
        bookName: 'Philippians',
        bookAbbreviation: 'Phil',
      },
    ];
    return verses[Math.floor(Math.random() * verses.length)];
  },

  searchVerses: async (query: string, _limit?: number): Promise<VerseWithBook[]> => {
    const allVerses = [
      { id: 1, bookId: 20, chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', bookName: 'Proverbs', bookAbbreviation: 'Prov' },
      { id: 2, bookId: 20, chapter: 3, verse: 9, text: 'Honour the LORD with thy substance, and with the firstfruits of all thine increase:', bookName: 'Proverbs', bookAbbreviation: 'Prov' },
      { id: 3, bookId: 50, chapter: 4, verse: 6, text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.', bookName: 'Philippians', bookAbbreviation: 'Phil' },
      { id: 4, bookId: 50, chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.', bookName: 'Philippians', bookAbbreviation: 'Phil' },
      { id: 5, bookId: 43, chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', bookName: 'John', bookAbbreviation: 'John' },
      { id: 6, bookId: 40, chapter: 6, verse: 33, text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', bookName: 'Matthew', bookAbbreviation: 'Matt' },
      { id: 7, bookId: 23, chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', bookName: 'Isaiah', bookAbbreviation: 'Isa' },
      { id: 8, bookId: 45, chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', bookName: 'Romans', bookAbbreviation: 'Rom' },
      { id: 9, bookId: 19, chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.', bookName: 'Psalms', bookAbbreviation: 'Ps' },
      { id: 10, bookId: 24, chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', bookName: 'Jeremiah', bookAbbreviation: 'Jer' },
    ];
    const q = query.toLowerCase();
    return allVerses.filter(v => v.text.toLowerCase().includes(q));
  },
};

export const mockTopicsApi = {
  getTopics: async (): Promise<Topic[]> => {
    return [
      { id: 1, name: 'Finances & Wealth', slug: 'finances', description: 'Biblical wisdom for money, stewardship, and generosity', icon: 'wallet', color: '#10B981', verseCount: 23 },
      { id: 2, name: 'Marriage & Relationships', slug: 'marriage', description: 'Love, unity, and building strong relationships', icon: 'heart', color: '#EC4899', verseCount: 27 },
      { id: 3, name: 'Anxiety & Fear', slug: 'anxiety', description: 'Finding peace and overcoming worry', icon: 'shield', color: '#8B5CF6', verseCount: 30 },
      { id: 4, name: 'Health & Healing', slug: 'health', description: 'Physical and spiritual wellness', icon: 'activity', color: '#06B6D4', verseCount: 21 },
      { id: 5, name: 'Parenting & Family', slug: 'parenting', description: 'Raising children and family dynamics', icon: 'users', color: '#F59E0B', verseCount: 20 },
      { id: 6, name: 'Work & Career', slug: 'work', description: 'Excellence, purpose, and integrity in work', icon: 'briefcase', color: '#3B82F6', verseCount: 21 },
      { id: 7, name: 'Salvation & Faith', slug: 'salvation', description: 'Coming to Christ and growing in faith', icon: 'sunrise', color: '#EF4444', verseCount: 28 },
      { id: 8, name: 'Forgiveness', slug: 'forgiveness', description: 'Giving and receiving forgiveness', icon: 'refresh-cw', color: '#14B8A6', verseCount: 18 },
      { id: 9, name: 'Wisdom & Guidance', slug: 'wisdom', description: 'Decision-making and discernment', icon: 'compass', color: '#6366F1', verseCount: 23 },
      { id: 10, name: 'Peace & Rest', slug: 'peace', description: 'Finding calm and Sabbath rest', icon: 'cloud', color: '#A78BFA', verseCount: 23 },
      { id: 11, name: 'Strength & Courage', slug: 'strength', description: 'Facing challenges with boldness', icon: 'zap', color: '#F97316', verseCount: 20 },
      { id: 12, name: 'Prayer', slug: 'prayer', description: 'How to pray and persistence in prayer', icon: 'message-circle', color: '#84CC16', verseCount: 27 },
    ];
  },

  getVersesByTopic: async (topicId: number, _limit?: number): Promise<VerseWithTopic[]> => {
    const topicVerses: Record<number, VerseWithTopic[]> = {
      1: [ // Finances
        { id: 1, bookId: 20, chapter: 3, verse: 9, text: 'Honour the LORD with thy substance, and with the firstfruits of all thine increase:', bookName: 'Proverbs', bookAbbreviation: 'Prov', topicId: 1, relevanceScore: 1.0 },
        { id: 2, bookId: 39, chapter: 3, verse: 10, text: 'Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.', bookName: 'Malachi', bookAbbreviation: 'Mal', topicId: 1, relevanceScore: 1.0 },
        { id: 3, bookId: 40, chapter: 6, verse: 33, text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', bookName: 'Matthew', bookAbbreviation: 'Matt', topicId: 1, relevanceScore: 1.0 },
        { id: 4, bookId: 50, chapter: 4, verse: 19, text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.', bookName: 'Philippians', bookAbbreviation: 'Phil', topicId: 1, relevanceScore: 1.0 },
      ],
      3: [ // Anxiety
        { id: 5, bookId: 50, chapter: 4, verse: 6, text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.', bookName: 'Philippians', bookAbbreviation: 'Phil', topicId: 3, relevanceScore: 1.0 },
        { id: 6, bookId: 50, chapter: 4, verse: 7, text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', bookName: 'Philippians', bookAbbreviation: 'Phil', topicId: 3, relevanceScore: 1.0 },
        { id: 7, bookId: 60, chapter: 5, verse: 7, text: 'Casting all your care upon him; for he careth for you.', bookName: '1 Peter', bookAbbreviation: '1Pet', topicId: 3, relevanceScore: 1.0 },
        { id: 8, bookId: 23, chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', bookName: 'Isaiah', bookAbbreviation: 'Isa', topicId: 3, relevanceScore: 1.0 },
      ],
      7: [ // Salvation
        { id: 9, bookId: 43, chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', bookName: 'John', bookAbbreviation: 'John', topicId: 7, relevanceScore: 1.0 },
        { id: 10, bookId: 45, chapter: 10, verse: 9, text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.', bookName: 'Romans', bookAbbreviation: 'Rom', topicId: 7, relevanceScore: 1.0 },
        { id: 11, bookId: 49, chapter: 2, verse: 8, text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:', bookName: 'Ephesians', bookAbbreviation: 'Eph', topicId: 7, relevanceScore: 1.0 },
      ],
      11: [ // Strength
        { id: 12, bookId: 50, chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.', bookName: 'Philippians', bookAbbreviation: 'Phil', topicId: 11, relevanceScore: 1.0 },
        { id: 13, bookId: 23, chapter: 40, verse: 31, text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', bookName: 'Isaiah', bookAbbreviation: 'Isa', topicId: 11, relevanceScore: 1.0 },
        { id: 14, bookId: 19, chapter: 46, verse: 1, text: 'God is our refuge and strength, a very present help in trouble.', bookName: 'Psalms', bookAbbreviation: 'Ps', topicId: 11, relevanceScore: 1.0 },
      ],
    };
    return topicVerses[topicId] || [
      { id: 1, bookId: 20, chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', bookName: 'Proverbs', bookAbbreviation: 'Prov', topicId, relevanceScore: 1.0 },
    ];
  },

  getTopicBySlug: async (slug: string): Promise<Topic> => {
    const topics = await mockTopicsApi.getTopics();
    const topic = topics.find(t => t.slug === slug);
    if (!topic) throw new Error(`Topic not found: ${slug}`);
    return topic;
  },
};

export const mockApplicationApi = {
  getVerseApplication: async (_verseId: number): Promise<VerseApplication> => {
    return {
      actionSteps: [
        { id: 1, verseId: 1, stepNumber: 1, content: 'Start each day by reading this verse and meditating on its meaning', difficulty: 'easy' },
        { id: 2, verseId: 1, stepNumber: 2, content: 'Identify one area of your life where you tend to rely on your own understanding', difficulty: 'medium' },
        { id: 3, verseId: 1, stepNumber: 3, content: 'Practice surrendering a difficult decision to God through prayer', difficulty: 'challenging' },
      ],
      reflectionQuestions: [
        { id: 1, verseId: 1, question: 'What areas of your life are you trying to control without trusting God?', category: 'personal' },
        { id: 2, verseId: 1, question: 'How does trusting God impact your relationships with others?', category: 'relational' },
        { id: 3, verseId: 1, question: 'What would it look like to fully trust God in your current situation?', category: 'spiritual' },
        { id: 4, verseId: 1, question: 'What is one practical step you can take today to lean on God instead of your own understanding?', category: 'practical' },
      ],
    };
  },
};

// Check if Tauri is available
// Tauri 2.x uses __TAURI_INTERNALS__ instead of __TAURI__
const isTauriAvailable = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// Unified API that switches between Tauri and mock based on availability
export const api = {
  bible: {
    getBooks: async (): Promise<Book[]> => {
      return isTauriAvailable() ? bibleApi.getBooks() : mockBibleApi.getBooks();
    },
    getVerses: async (bookId: number, chapter: number): Promise<Verse[]> => {
      return isTauriAvailable() ? bibleApi.getVerses(bookId, chapter) : mockBibleApi.getVerses(bookId, chapter);
    },
    getVerse: async (verseId: number): Promise<VerseWithBook> => {
      return isTauriAvailable() ? bibleApi.getVerse(verseId) : mockBibleApi.getVerse(verseId);
    },
    getVerseByReference: async (reference: string): Promise<VerseWithBook> => {
      return isTauriAvailable() ? bibleApi.getVerseByReference(reference) : mockBibleApi.getVerseByReference(reference);
    },
    getRandomVerse: async (topicId?: number): Promise<VerseWithBook> => {
      return isTauriAvailable() ? bibleApi.getRandomVerse(topicId) : mockBibleApi.getRandomVerse(topicId);
    },
    searchVerses: async (query: string, limit?: number): Promise<VerseWithBook[]> => {
      return isTauriAvailable() ? bibleApi.searchVerses(query, limit) : mockBibleApi.searchVerses(query, limit);
    },
  },
  topics: {
    getTopics: async (): Promise<Topic[]> => {
      return isTauriAvailable() ? topicsApi.getTopics() : mockTopicsApi.getTopics();
    },
    getVersesByTopic: async (topicId: number, limit?: number): Promise<VerseWithTopic[]> => {
      return isTauriAvailable() ? topicsApi.getVersesByTopic(topicId, limit) : mockTopicsApi.getVersesByTopic(topicId, limit);
    },
    getTopicBySlug: async (slug: string): Promise<Topic> => {
      return isTauriAvailable() ? topicsApi.getTopicBySlug(slug) : mockTopicsApi.getTopicBySlug(slug);
    },
  },
  application: {
    getVerseApplication: async (verseId: number): Promise<VerseApplication> => {
      return isTauriAvailable() ? applicationApi.getVerseApplication(verseId) : mockApplicationApi.getVerseApplication(verseId);
    },
  },
};
