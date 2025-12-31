use tauri::State;
use serde::{Deserialize, Serialize};
use crate::AppState;
use crate::models::*;
use crate::llm::{LlmClient, LlmConfig, prompts};

// Bible Commands
#[tauri::command]
pub fn get_books(state: State<'_, AppState>) -> Result<Vec<Book>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_books().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_verses(state: State<'_, AppState>, book_id: i64, chapter: i64) -> Result<Vec<Verse>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_verses(book_id, chapter).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_verse(state: State<'_, AppState>, verse_id: i64) -> Result<VerseWithBook, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_verse(verse_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_verse_by_reference(_state: State<'_, AppState>, reference: String) -> Result<VerseWithBook, String> {
    // TODO: Parse reference and look up verse
    // For now, return a placeholder error
    Err(format!("Reference parsing not yet implemented: {}", reference))
}

#[tauri::command]
pub fn get_random_verse(state: State<'_, AppState>, topic_id: Option<i64>) -> Result<VerseWithBook, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_random_verse(topic_id).map_err(|e| e.to_string())
}

// Topic Commands
#[tauri::command]
pub fn get_topics(state: State<'_, AppState>) -> Result<Vec<Topic>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_topics().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_verses_by_topic(state: State<'_, AppState>, topic_id: i64, limit: Option<i64>) -> Result<Vec<VerseWithTopic>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_verses_by_topic(topic_id, limit).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_topic_by_slug(state: State<'_, AppState>, slug: String) -> Result<Topic, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_topic_by_slug(&slug).map_err(|e| e.to_string())
}

// Application Commands
#[tauri::command]
pub fn get_verse_application(state: State<'_, AppState>, verse_id: i64) -> Result<VerseApplication, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_verse_application(verse_id).map_err(|e| e.to_string())
}

// Search Commands
#[tauri::command]
pub fn search_verses(state: State<'_, AppState>, query: String, limit: Option<i64>) -> Result<Vec<VerseWithBook>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.search_verses(&query, limit).map_err(|e| e.to_string())
}

// User Data Commands
#[tauri::command]
pub fn create_note(state: State<'_, AppState>, note: NewNote) -> Result<UserNote, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.create_note(&note).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_notes(state: State<'_, AppState>, verse_id: Option<i64>) -> Result<Vec<UserNote>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_notes(verse_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_highlight(state: State<'_, AppState>, verse_id: i64, color: String) -> Result<UserHighlight, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.add_highlight(verse_id, &color).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_highlights(state: State<'_, AppState>) -> Result<Vec<UserHighlight>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_highlights().map_err(|e| e.to_string())
}

// Settings Commands
#[tauri::command]
pub fn get_settings(state: State<'_, AppState>) -> Result<Settings, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    db.get_settings().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_settings(state: State<'_, AppState>, settings: Settings) -> Result<(), String> {
    println!("[Settings Update] Saving settings:");
    println!("  provider: {}", settings.llm_provider);
    println!("  base_url: {:?}", settings.llm_base_url);
    println!("  model: {:?}", settings.llm_model);

    let db = state.db.lock().map_err(|e| e.to_string())?;
    let result = db.update_settings(&settings).map_err(|e| e.to_string());

    if result.is_ok() {
        println!("[Settings Update] Settings saved successfully");
    } else {
        println!("[Settings Update] Error saving settings: {:?}", result);
    }

    result
}

// LLM Response types
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AiInsight {
    pub content: String,
    pub tokens_used: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LlmStatus {
    pub connected: bool,
    pub provider: String,
    pub model: Option<String>,
}

// AI/LLM Commands
#[tauri::command]
pub async fn check_llm_connection(state: State<'_, AppState>) -> Result<LlmStatus, String> {
    println!("[Check Connection] Reading settings from database...");
    let settings = {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.get_settings().map_err(|e| e.to_string())?
    };

    println!("[Check Connection] Settings loaded:");
    println!("  provider: {}", settings.llm_provider);
    println!("  base_url: {:?}", settings.llm_base_url);
    println!("  model: {:?}", settings.llm_model);

    let config = LlmConfig {
        provider: settings.llm_provider.clone(),
        base_url: settings.llm_base_url.clone(),
        model: settings.llm_model.clone(),
        api_key: settings.llm_api_key.clone(),
    };

    let client = LlmClient::new(config);
    println!("[Check Connection] Testing connection...");
    let connected = client.check_connection().await.unwrap_or(false);
    println!("[Check Connection] Result: connected={}", connected);

    Ok(LlmStatus {
        connected,
        provider: settings.llm_provider,
        model: settings.llm_model,
    })
}

#[tauri::command]
pub async fn get_ai_insight(
    state: State<'_, AppState>,
    verse_text: String,
    reference: String,
) -> Result<AiInsight, String> {
    println!("[AI Insight] Called with reference: {}", reference);

    let settings = {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.get_settings().map_err(|e| e.to_string())?
    };

    println!("[AI Insight] Provider: {}, Base URL: {:?}, Model: {:?}",
             settings.llm_provider, settings.llm_base_url, settings.llm_model);

    let config = LlmConfig {
        provider: settings.llm_provider,
        base_url: settings.llm_base_url,
        model: settings.llm_model,
        api_key: settings.llm_api_key,
    };

    let client = LlmClient::new(config);
    let prompt = prompts::verse_insight_prompt(&verse_text, &reference);

    println!("[AI Insight] Calling LLM...");
    let response = client.generate(&prompt, Some(prompts::SYSTEM_PROMPT)).await;

    match response {
        Ok(resp) => {
            println!("[AI Insight] Success! Tokens: {} in, {} out", resp.input_tokens, resp.output_tokens);
            Ok(AiInsight {
                content: resp.text,
                tokens_used: resp.input_tokens + resp.output_tokens,
            })
        }
        Err(e) => {
            println!("[AI Insight] Error: {}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn generate_action_steps(
    state: State<'_, AppState>,
    verse_text: String,
    reference: String,
    topic: String,
) -> Result<AiInsight, String> {
    let settings = {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.get_settings().map_err(|e| e.to_string())?
    };

    let config = LlmConfig {
        provider: settings.llm_provider,
        base_url: settings.llm_base_url,
        model: settings.llm_model,
        api_key: settings.llm_api_key,
    };

    let client = LlmClient::new(config);
    let prompt = prompts::action_steps_prompt(&verse_text, &reference, &topic);

    let response = client.generate(&prompt, Some(prompts::SYSTEM_PROMPT)).await?;

    Ok(AiInsight {
        content: response.text,
        tokens_used: response.input_tokens + response.output_tokens,
    })
}

#[tauri::command]
pub async fn generate_reflection_questions(
    state: State<'_, AppState>,
    verse_text: String,
    reference: String,
) -> Result<AiInsight, String> {
    let settings = {
        let db = state.db.lock().map_err(|e| e.to_string())?;
        db.get_settings().map_err(|e| e.to_string())?
    };

    let config = LlmConfig {
        provider: settings.llm_provider,
        base_url: settings.llm_base_url,
        model: settings.llm_model,
        api_key: settings.llm_api_key,
    };

    let client = LlmClient::new(config);
    let prompt = prompts::reflection_questions_prompt(&verse_text, &reference);

    let response = client.generate(&prompt, Some(prompts::SYSTEM_PROMPT)).await?;

    Ok(AiInsight {
        content: response.text,
        tokens_used: response.input_tokens + response.output_tokens,
    })
}
