use rusqlite::{Connection, Result, params};
use std::path::Path;
use crate::models::*;
use crate::seed;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(path: &Path) -> Result<Self> {
        let conn = Connection::open(path)?;
        let db = Self { conn };
        db.initialize()?;
        Ok(db)
    }

    fn initialize(&self) -> Result<()> {
        // Create tables
        self.conn.execute_batch(include_str!("../migrations/001_initial.sql"))?;

        // Seed topics if empty
        let topic_count: i64 = self.conn.query_row(
            "SELECT COUNT(*) FROM topics",
            [],
            |row| row.get(0)
        )?;

        if topic_count == 0 {
            self.seed_topics()?;
        }

        // Seed books if empty
        let book_count: i64 = self.conn.query_row(
            "SELECT COUNT(*) FROM books",
            [],
            |row| row.get(0)
        )?;

        if book_count == 0 {
            seed::seed_books(&self.conn)?;
        }

        // Seed topical verses if empty
        let verse_count: i64 = self.conn.query_row(
            "SELECT COUNT(*) FROM verses",
            [],
            |row| row.get(0)
        )?;

        if verse_count == 0 {
            seed::seed_topical_verses(&self.conn)?;
            seed::seed_action_steps(&self.conn)?;
            seed::seed_reflection_questions(&self.conn)?;
        }

        Ok(())
    }

    fn seed_topics(&self) -> Result<()> {
        let topics = vec![
            ("Finances & Wealth", "finances", "Biblical wisdom for money, stewardship, and generosity", "wallet", "#10B981"),
            ("Marriage & Relationships", "marriage", "Love, unity, and building strong relationships", "heart", "#EC4899"),
            ("Anxiety & Fear", "anxiety", "Finding peace and overcoming worry", "shield", "#8B5CF6"),
            ("Health & Healing", "health", "Physical and spiritual wellness", "activity", "#06B6D4"),
            ("Parenting & Family", "parenting", "Raising children and family dynamics", "users", "#F59E0B"),
            ("Work & Career", "work", "Excellence, purpose, and integrity in work", "briefcase", "#3B82F6"),
            ("Salvation & Faith", "salvation", "Coming to Christ and growing in faith", "sunrise", "#EF4444"),
            ("Forgiveness", "forgiveness", "Giving and receiving forgiveness", "refresh-cw", "#14B8A6"),
            ("Wisdom & Guidance", "wisdom", "Decision-making and discernment", "compass", "#6366F1"),
            ("Peace & Rest", "peace", "Finding calm and Sabbath rest", "cloud", "#A78BFA"),
            ("Strength & Courage", "strength", "Facing challenges with boldness", "zap", "#F97316"),
            ("Prayer", "prayer", "How to pray and persistence in prayer", "message-circle", "#84CC16"),
        ];

        for (i, (name, slug, desc, icon, color)) in topics.iter().enumerate() {
            self.conn.execute(
                "INSERT INTO topics (name, slug, description, icon, color, sort_order) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                params![name, slug, desc, icon, color, i + 1],
            )?;
        }

        Ok(())
    }

    // Bible queries
    pub fn get_books(&self) -> Result<Vec<Book>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, name, abbreviation, testament, chapter_count, sort_order FROM books ORDER BY sort_order"
        )?;

        let books = stmt.query_map([], |row| {
            Ok(Book {
                id: row.get(0)?,
                name: row.get(1)?,
                abbreviation: row.get(2)?,
                testament: row.get(3)?,
                chapter_count: row.get(4)?,
                sort_order: row.get(5)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(books)
    }

    pub fn get_verses(&self, book_id: i64, chapter: i64) -> Result<Vec<Verse>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, book_id, chapter, verse, text FROM verses WHERE book_id = ?1 AND chapter = ?2 ORDER BY verse"
        )?;

        let verses = stmt.query_map(params![book_id, chapter], |row| {
            Ok(Verse {
                id: row.get(0)?,
                book_id: row.get(1)?,
                chapter: row.get(2)?,
                verse: row.get(3)?,
                text: row.get(4)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(verses)
    }

    pub fn get_verse(&self, verse_id: i64) -> Result<VerseWithBook> {
        self.conn.query_row(
            "SELECT v.id, v.book_id, v.chapter, v.verse, v.text, b.name, b.abbreviation
             FROM verses v
             JOIN books b ON v.book_id = b.id
             WHERE v.id = ?1",
            params![verse_id],
            |row| {
                Ok(VerseWithBook {
                    id: row.get(0)?,
                    book_id: row.get(1)?,
                    chapter: row.get(2)?,
                    verse: row.get(3)?,
                    text: row.get(4)?,
                    book_name: row.get(5)?,
                    book_abbreviation: row.get(6)?,
                })
            }
        )
    }

    pub fn get_random_verse(&self, topic_id: Option<i64>) -> Result<VerseWithBook> {
        if let Some(tid) = topic_id {
            self.conn.query_row(
                "SELECT v.id, v.book_id, v.chapter, v.verse, v.text, b.name, b.abbreviation
                 FROM verses v
                 JOIN books b ON v.book_id = b.id
                 JOIN verse_topics vt ON v.id = vt.verse_id
                 WHERE vt.topic_id = ?1
                 ORDER BY RANDOM() LIMIT 1",
                params![tid],
                |row| {
                    Ok(VerseWithBook {
                        id: row.get(0)?,
                        book_id: row.get(1)?,
                        chapter: row.get(2)?,
                        verse: row.get(3)?,
                        text: row.get(4)?,
                        book_name: row.get(5)?,
                        book_abbreviation: row.get(6)?,
                    })
                }
            )
        } else {
            self.conn.query_row(
                "SELECT v.id, v.book_id, v.chapter, v.verse, v.text, b.name, b.abbreviation
                 FROM verses v
                 JOIN books b ON v.book_id = b.id
                 ORDER BY RANDOM() LIMIT 1",
                [],
                |row| {
                    Ok(VerseWithBook {
                        id: row.get(0)?,
                        book_id: row.get(1)?,
                        chapter: row.get(2)?,
                        verse: row.get(3)?,
                        text: row.get(4)?,
                        book_name: row.get(5)?,
                        book_abbreviation: row.get(6)?,
                    })
                }
            )
        }
    }

    // Topic queries
    pub fn get_topics(&self) -> Result<Vec<Topic>> {
        let mut stmt = self.conn.prepare(
            "SELECT t.id, t.name, t.slug, t.description, t.icon, t.color,
                    (SELECT COUNT(*) FROM verse_topics WHERE topic_id = t.id) as verse_count
             FROM topics t
             WHERE t.is_active = 1
             ORDER BY t.sort_order"
        )?;

        let topics = stmt.query_map([], |row| {
            Ok(Topic {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                description: row.get(3)?,
                icon: row.get(4)?,
                color: row.get(5)?,
                verse_count: row.get(6)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(topics)
    }

    pub fn get_topic_by_slug(&self, slug: &str) -> Result<Topic> {
        self.conn.query_row(
            "SELECT t.id, t.name, t.slug, t.description, t.icon, t.color,
                    (SELECT COUNT(*) FROM verse_topics WHERE topic_id = t.id) as verse_count
             FROM topics t
             WHERE t.slug = ?1",
            params![slug],
            |row| {
                Ok(Topic {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    slug: row.get(2)?,
                    description: row.get(3)?,
                    icon: row.get(4)?,
                    color: row.get(5)?,
                    verse_count: row.get(6)?,
                })
            }
        )
    }

    pub fn get_verses_by_topic(&self, topic_id: i64, limit: Option<i64>) -> Result<Vec<VerseWithTopic>> {
        let limit_clause = limit.map(|l| format!(" LIMIT {}", l)).unwrap_or_default();

        let mut stmt = self.conn.prepare(&format!(
            "SELECT v.id, v.book_id, v.chapter, v.verse, v.text, b.name, b.abbreviation,
                    vt.topic_id, vt.subtopic_id, vt.relevance_score
             FROM verses v
             JOIN books b ON v.book_id = b.id
             JOIN verse_topics vt ON v.id = vt.verse_id
             WHERE vt.topic_id = ?1
             ORDER BY vt.relevance_score DESC, b.sort_order, v.chapter, v.verse{}",
            limit_clause
        ))?;

        let verses = stmt.query_map(params![topic_id], |row| {
            Ok(VerseWithTopic {
                id: row.get(0)?,
                book_id: row.get(1)?,
                chapter: row.get(2)?,
                verse: row.get(3)?,
                text: row.get(4)?,
                book_name: row.get(5)?,
                book_abbreviation: row.get(6)?,
                topic_id: row.get(7)?,
                subtopic_id: row.get(8)?,
                relevance_score: row.get(9)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(verses)
    }

    // User data queries
    pub fn create_note(&self, note: &NewNote) -> Result<UserNote> {
        self.conn.execute(
            "INSERT INTO user_notes (verse_id, title, content) VALUES (?1, ?2, ?3)",
            params![note.verse_id, note.title, note.content],
        )?;

        let id = self.conn.last_insert_rowid();
        self.get_note(id)
    }

    pub fn get_note(&self, id: i64) -> Result<UserNote> {
        self.conn.query_row(
            "SELECT id, verse_id, title, content, is_pinned, created_at, updated_at FROM user_notes WHERE id = ?1",
            params![id],
            |row| {
                Ok(UserNote {
                    id: row.get(0)?,
                    verse_id: row.get(1)?,
                    title: row.get(2)?,
                    content: row.get(3)?,
                    is_pinned: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            }
        )
    }

    pub fn get_notes(&self, verse_id: Option<i64>) -> Result<Vec<UserNote>> {
        let (query, params): (&str, Vec<i64>) = if let Some(vid) = verse_id {
            ("SELECT id, verse_id, title, content, is_pinned, created_at, updated_at FROM user_notes WHERE verse_id = ?1 ORDER BY updated_at DESC", vec![vid])
        } else {
            ("SELECT id, verse_id, title, content, is_pinned, created_at, updated_at FROM user_notes ORDER BY updated_at DESC", vec![])
        };

        let mut stmt = self.conn.prepare(query)?;
        let notes = if params.is_empty() {
            stmt.query_map([], |row| {
                Ok(UserNote {
                    id: row.get(0)?,
                    verse_id: row.get(1)?,
                    title: row.get(2)?,
                    content: row.get(3)?,
                    is_pinned: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            })?.collect::<Result<Vec<_>>>()?
        } else {
            stmt.query_map(params![params[0]], |row| {
                Ok(UserNote {
                    id: row.get(0)?,
                    verse_id: row.get(1)?,
                    title: row.get(2)?,
                    content: row.get(3)?,
                    is_pinned: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            })?.collect::<Result<Vec<_>>>()?
        };

        Ok(notes)
    }

    pub fn add_highlight(&self, verse_id: i64, color: &str) -> Result<UserHighlight> {
        // Remove existing highlight for this verse
        self.conn.execute(
            "DELETE FROM user_highlights WHERE verse_id = ?1",
            params![verse_id],
        )?;

        self.conn.execute(
            "INSERT INTO user_highlights (verse_id, color) VALUES (?1, ?2)",
            params![verse_id, color],
        )?;

        let id = self.conn.last_insert_rowid();
        self.conn.query_row(
            "SELECT id, verse_id, color, created_at FROM user_highlights WHERE id = ?1",
            params![id],
            |row| {
                Ok(UserHighlight {
                    id: row.get(0)?,
                    verse_id: row.get(1)?,
                    color: row.get(2)?,
                    created_at: row.get(3)?,
                })
            }
        )
    }

    pub fn get_highlights(&self) -> Result<Vec<UserHighlight>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, verse_id, color, created_at FROM user_highlights"
        )?;

        let highlights = stmt.query_map([], |row| {
            Ok(UserHighlight {
                id: row.get(0)?,
                verse_id: row.get(1)?,
                color: row.get(2)?,
                created_at: row.get(3)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(highlights)
    }

    // Settings
    pub fn get_settings(&self) -> Result<Settings> {
        let mut settings = Settings::default();

        let mut stmt = self.conn.prepare("SELECT key, value FROM settings")?;
        let rows = stmt.query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        })?;

        for row in rows {
            let (key, value) = row?;
            match key.as_str() {
                "theme" => settings.theme = value,
                "font_size" => settings.font_size = value,
                "llm_provider" => settings.llm_provider = value,
                "llm_base_url" => settings.llm_base_url = Some(value),
                "llm_model" => settings.llm_model = Some(value),
                "llm_api_key" => settings.llm_api_key = Some(value),
                "daily_verse_enabled" => settings.daily_verse_enabled = value == "true",
                "daily_verse_time" => settings.daily_verse_time = value,
                _ => {}
            }
        }

        Ok(settings)
    }

    pub fn update_settings(&self, settings: &Settings) -> Result<()> {
        let pairs = vec![
            ("theme", settings.theme.clone()),
            ("font_size", settings.font_size.clone()),
            ("llm_provider", settings.llm_provider.clone()),
            ("llm_base_url", settings.llm_base_url.clone().unwrap_or_default()),
            ("llm_model", settings.llm_model.clone().unwrap_or_default()),
            ("llm_api_key", settings.llm_api_key.clone().unwrap_or_default()),
            ("daily_verse_enabled", settings.daily_verse_enabled.to_string()),
            ("daily_verse_time", settings.daily_verse_time.clone()),
        ];

        for (key, value) in pairs {
            self.conn.execute(
                "INSERT OR REPLACE INTO settings (key, value) VALUES (?1, ?2)",
                params![key, value],
            )?;
        }

        Ok(())
    }

    // Application content queries
    pub fn get_action_steps(&self, verse_id: i64) -> Result<Vec<ActionStep>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, verse_id, step_number, content, difficulty
             FROM action_steps
             WHERE verse_id = ?1
             ORDER BY step_number"
        )?;

        let steps = stmt.query_map(params![verse_id], |row| {
            Ok(ActionStep {
                id: row.get(0)?,
                verse_id: row.get(1)?,
                step_number: row.get(2)?,
                content: row.get(3)?,
                difficulty: row.get(4)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(steps)
    }

    pub fn get_reflection_questions(&self, verse_id: i64) -> Result<Vec<ReflectionQuestion>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, verse_id, question, category
             FROM reflection_questions
             WHERE verse_id = ?1"
        )?;

        let questions = stmt.query_map(params![verse_id], |row| {
            Ok(ReflectionQuestion {
                id: row.get(0)?,
                verse_id: row.get(1)?,
                question: row.get(2)?,
                category: row.get(3)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(questions)
    }

    pub fn get_verse_application(&self, verse_id: i64) -> Result<VerseApplication> {
        let action_steps = self.get_action_steps(verse_id)?;
        let reflection_questions = self.get_reflection_questions(verse_id)?;

        Ok(VerseApplication {
            action_steps,
            reflection_questions,
        })
    }

    // Search functionality
    pub fn search_verses(&self, query: &str, limit: Option<i64>) -> Result<Vec<VerseWithBook>> {
        let limit_clause = limit.map(|l| format!(" LIMIT {}", l)).unwrap_or_else(|| " LIMIT 50".to_string());
        let search_pattern = format!("%{}%", query);

        let mut stmt = self.conn.prepare(&format!(
            "SELECT v.id, v.book_id, v.chapter, v.verse, v.text, b.name, b.abbreviation
             FROM verses v
             JOIN books b ON v.book_id = b.id
             WHERE v.text LIKE ?1
             ORDER BY b.sort_order, v.chapter, v.verse{}",
            limit_clause
        ))?;

        let verses = stmt.query_map(params![search_pattern], |row| {
            Ok(VerseWithBook {
                id: row.get(0)?,
                book_id: row.get(1)?,
                chapter: row.get(2)?,
                verse: row.get(3)?,
                text: row.get(4)?,
                book_name: row.get(5)?,
                book_abbreviation: row.get(6)?,
            })
        })?.collect::<Result<Vec<_>>>()?;

        Ok(verses)
    }
}
