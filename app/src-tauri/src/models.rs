use serde::{Deserialize, Serialize};

// Bible Models
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Book {
    pub id: i64,
    pub name: String,
    pub abbreviation: String,
    pub testament: String,
    pub chapter_count: i64,
    pub sort_order: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Verse {
    pub id: i64,
    pub book_id: i64,
    pub chapter: i64,
    pub verse: i64,
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerseWithBook {
    pub id: i64,
    pub book_id: i64,
    pub chapter: i64,
    pub verse: i64,
    pub text: String,
    pub book_name: String,
    pub book_abbreviation: String,
}

// Topic Models
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Topic {
    pub id: i64,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub icon: String,
    pub color: String,
    pub verse_count: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerseWithTopic {
    pub id: i64,
    pub book_id: i64,
    pub chapter: i64,
    pub verse: i64,
    pub text: String,
    pub book_name: String,
    pub book_abbreviation: String,
    pub topic_id: i64,
    pub subtopic_id: Option<i64>,
    pub relevance_score: f64,
}

// Application Content Models
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionStep {
    pub id: i64,
    pub verse_id: i64,
    pub step_number: i64,
    pub content: String,
    pub difficulty: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReflectionQuestion {
    pub id: i64,
    pub verse_id: i64,
    pub question: String,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerseApplication {
    pub action_steps: Vec<ActionStep>,
    pub reflection_questions: Vec<ReflectionQuestion>,
}

// User Data Models
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserNote {
    pub id: i64,
    pub verse_id: Option<i64>,
    pub title: Option<String>,
    pub content: String,
    pub is_pinned: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewNote {
    pub verse_id: Option<i64>,
    pub title: Option<String>,
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserHighlight {
    pub id: i64,
    pub verse_id: i64,
    pub color: String,
    pub created_at: String,
}

// Settings Models
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub theme: String,
    pub font_size: String,
    pub llm_provider: String,  // "lmstudio", "openai", or "claude"
    pub llm_base_url: Option<String>,
    pub llm_model: Option<String>,
    pub llm_api_key: Option<String>,  // API key for OpenAI/Claude
    pub daily_verse_enabled: bool,
    pub daily_verse_time: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            font_size: "medium".to_string(),
            llm_provider: "lmstudio".to_string(),
            // For WSL accessing Windows LM Studio, use the Windows host
            // Common options: "http://localhost:1234/v1" or "http://host.docker.internal:1234/v1"
            llm_base_url: Some("http://localhost:1234/v1".to_string()),
            llm_model: None,
            llm_api_key: None,
            daily_verse_enabled: true,
            daily_verse_time: "07:00".to_string(),
        }
    }
}
