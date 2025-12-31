use std::sync::Mutex;
use tauri::Manager;

mod db;
mod models;
mod commands;
mod seed;
mod llm;

use db::Database;

// Application state
pub struct AppState {
    pub db: Mutex<Database>,
}

// Initialize the application
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logger
    env_logger::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get app data directory
            let app_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app data dir");

            // Initialize database
            let db_path = app_dir.join("bible.db");
            let db = Database::new(&db_path).expect("Failed to initialize database");

            // Store in app state
            app.manage(AppState {
                db: Mutex::new(db),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Bible commands
            commands::get_books,
            commands::get_verses,
            commands::get_verse,
            commands::get_verse_by_reference,
            commands::get_random_verse,
            // Topic commands
            commands::get_topics,
            commands::get_verses_by_topic,
            commands::get_topic_by_slug,
            // Application commands
            commands::get_verse_application,
            // Search commands
            commands::search_verses,
            // User data commands
            commands::create_note,
            commands::get_notes,
            commands::add_highlight,
            commands::get_highlights,
            // Settings commands
            commands::get_settings,
            commands::update_settings,
            // AI/LLM commands
            commands::check_llm_connection,
            commands::get_ai_insight,
            commands::generate_action_steps,
            commands::generate_reflection_questions,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
