use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LlmConfig {
    pub provider: String,        // "lmstudio", "openai", "claude"
    pub base_url: Option<String>,
    pub model: Option<String>,
    pub api_key: Option<String>,
}

impl Default for LlmConfig {
    fn default() -> Self {
        Self {
            provider: "lmstudio".to_string(),
            base_url: Some("http://localhost:1234".to_string()),
            model: None,
            api_key: None,
        }
    }
}

#[derive(Debug, Serialize)]
struct OpenAiRequest {
    model: String,
    messages: Vec<ChatMessage>,
    max_tokens: Option<u32>,
    temperature: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct OpenAiResponse {
    choices: Vec<Choice>,
    usage: Option<Usage>,
}

#[derive(Debug, Deserialize)]
struct ModelsResponse {
    data: Vec<ModelInfo>,
}

#[derive(Debug, Deserialize)]
struct ModelInfo {
    id: String,
}

#[derive(Debug, Deserialize)]
struct Choice {
    message: ChatMessage,
}

#[derive(Debug, Deserialize)]
struct Usage {
    prompt_tokens: u32,
    completion_tokens: u32,
    total_tokens: u32,
}

#[derive(Debug, Serialize)]
struct ClaudeRequest {
    model: String,
    max_tokens: u32,
    messages: Vec<ChatMessage>,
}

#[derive(Debug, Deserialize)]
struct ClaudeResponse {
    content: Vec<ClaudeContent>,
    usage: ClaudeUsage,
}

#[derive(Debug, Deserialize)]
struct ClaudeContent {
    text: String,
}

#[derive(Debug, Deserialize)]
struct ClaudeUsage {
    input_tokens: u32,
    output_tokens: u32,
}

pub struct LlmClient {
    client: Client,
    config: LlmConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LlmResponse {
    pub text: String,
    pub input_tokens: u32,
    pub output_tokens: u32,
}

impl LlmClient {
    pub fn new(config: LlmConfig) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(120))
            .build()
            .expect("Failed to create HTTP client");

        Self { client, config }
    }

    /// Get the normalized base URL with /v1 suffix
    fn get_base_url(&self) -> String {
        let raw_base_url = self.config.base_url.clone().unwrap_or_else(|| {
            if self.config.provider == "openai" {
                "https://api.openai.com/v1".to_string()
            } else {
                "http://localhost:1234/v1".to_string()
            }
        });

        let base_url = raw_base_url.trim_end_matches('/').to_string();

        // Ensure /v1 suffix for LM Studio compatibility
        if !base_url.ends_with("/v1") {
            format!("{}/v1", base_url)
        } else {
            base_url
        }
    }

    /// Fetch available models from LM Studio
    async fn get_available_models(&self) -> Result<Vec<String>, String> {
        let base_url = self.get_base_url();
        let url = format!("{}/models", base_url);

        println!("[LLM] Fetching available models from: {}", url);

        let response = self.client.get(&url)
            .timeout(Duration::from_secs(10))
            .send()
            .await
            .map_err(|e| format!("Failed to fetch models: {}", e))?;

        if !response.status().is_success() {
            return Err(format!("Failed to fetch models: {}", response.status()));
        }

        let body = response.text().await
            .map_err(|e| format!("Failed to read models response: {}", e))?;

        println!("[LLM] Models response: {}", &body[..body.len().min(300)]);

        let models_response: ModelsResponse = serde_json::from_str(&body)
            .map_err(|e| format!("Failed to parse models: {}", e))?;

        Ok(models_response.data.iter().map(|m| m.id.clone()).collect())
    }

    pub async fn generate(&self, prompt: &str, system_prompt: Option<&str>) -> Result<LlmResponse, String> {
        match self.config.provider.as_str() {
            "lmstudio" | "openai" => self.call_openai_compatible(prompt, system_prompt).await,
            "claude" => self.call_claude(prompt, system_prompt).await,
            _ => Err(format!("Unsupported provider: {}", self.config.provider)),
        }
    }

    async fn call_openai_compatible(&self, prompt: &str, system_prompt: Option<&str>) -> Result<LlmResponse, String> {
        let base_url = self.get_base_url();
        println!("[LLM] Using base_url: {}", base_url);

        // Get model name - for LM Studio, try to fetch actual model if not configured
        let model = if let Some(m) = self.config.model.clone() {
            m
        } else if self.config.provider == "openai" {
            "gpt-4o-mini".to_string()
        } else {
            // For LM Studio, try to get the actual loaded model name
            match self.get_available_models().await {
                Ok(models) if !models.is_empty() => {
                    println!("[LLM] Using first available model: {}", models[0]);
                    models[0].clone()
                }
                _ => {
                    println!("[LLM] Could not fetch models, using 'local-model'");
                    "local-model".to_string()
                }
            }
        };

        println!("[LLM] Using model: {}", model);

        let mut messages = Vec::new();

        if let Some(sys) = system_prompt {
            messages.push(ChatMessage {
                role: "system".to_string(),
                content: sys.to_string(),
            });
        }

        messages.push(ChatMessage {
            role: "user".to_string(),
            content: prompt.to_string(),
        });

        let request = OpenAiRequest {
            model,
            messages,
            max_tokens: Some(1024),
            temperature: Some(0.7),
        };

        let url = format!("{}/chat/completions", base_url);

        println!("[LLM] Full request URL: {}", url);

        // Log request body for debugging
        let request_json = serde_json::to_string_pretty(&request)
            .unwrap_or_else(|_| "Failed to serialize".to_string());
        println!("[LLM] Request body:\n{}", request_json);

        let mut req = self.client.post(&url)
            .header("Content-Type", "application/json")
            .json(&request);

        if let Some(api_key) = &self.config.api_key {
            req = req.header("Authorization", format!("Bearer {}", api_key));
        }

        println!("[LLM] Sending request to: {}", url);

        let response = req.send().await
            .map_err(|e| format!("Request failed: {}", e))?;

        let status = response.status();
        println!("[LLM] Response status: {}", status);

        // Get the raw body text first for debugging
        let body_text = response.text().await
            .map_err(|e| format!("Failed to read response body: {}", e))?;

        println!("[LLM] Response body (first 500 chars): {}", &body_text[..body_text.len().min(500)]);

        if !status.is_success() {
            return Err(format!("API error {}: {}", status, body_text));
        }

        // Check if LM Studio returned an error in the body despite 200 status
        // (some versions of LM Studio do this incorrectly)
        if body_text.contains("\"error\"") && !body_text.contains("\"choices\"") {
            println!("[LLM] Detected error in response body despite 200 status");
            return Err(format!("LLM server error: {}", body_text));
        }

        let result: OpenAiResponse = serde_json::from_str(&body_text)
            .map_err(|e| format!("Failed to parse response: {} - Body: {}", e, &body_text[..body_text.len().min(200)]))?;

        let choice = result.choices.first()
            .ok_or_else(|| "No response generated".to_string())?;

        let usage = result.usage.unwrap_or(Usage {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
        });

        Ok(LlmResponse {
            text: choice.message.content.clone(),
            input_tokens: usage.prompt_tokens,
            output_tokens: usage.completion_tokens,
        })
    }

    async fn call_claude(&self, prompt: &str, system_prompt: Option<&str>) -> Result<LlmResponse, String> {
        let api_key = self.config.api_key.clone()
            .ok_or_else(|| "Claude API key required".to_string())?;

        let model = self.config.model.clone()
            .unwrap_or_else(|| "claude-3-haiku-20240307".to_string());

        let mut messages = Vec::new();

        if let Some(sys) = system_prompt {
            messages.push(ChatMessage {
                role: "system".to_string(),
                content: sys.to_string(),
            });
        }

        messages.push(ChatMessage {
            role: "user".to_string(),
            content: prompt.to_string(),
        });

        let request = ClaudeRequest {
            model,
            max_tokens: 1024,
            messages,
        };

        let response = self.client
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", api_key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .json(&request)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(format!("API error {}: {}", status, text));
        }

        let result: ClaudeResponse = response.json().await
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        let text = result.content.first()
            .map(|c| c.text.clone())
            .unwrap_or_default();

        Ok(LlmResponse {
            text,
            input_tokens: result.usage.input_tokens,
            output_tokens: result.usage.output_tokens,
        })
    }

    pub async fn check_connection(&self) -> Result<bool, String> {
        // Simple health check
        match self.config.provider.as_str() {
            "lmstudio" | "ollama" => {
                let base_url = self.get_base_url();
                let url = format!("{}/models", base_url);
                println!("[LLM Check] Testing connection to: {}", url);

                let response = self.client.get(&url)
                    .timeout(Duration::from_secs(5))
                    .send()
                    .await
                    .map_err(|e| format!("Connection failed: {}", e))?;

                let status = response.status();
                println!("[LLM Check] Response status: {}", status);

                if status.is_success() {
                    // Try to log what models are available
                    if let Ok(body) = response.text().await {
                        println!("[LLM Check] Available models: {}", &body[..body.len().min(500)]);
                    }
                }

                Ok(status.is_success())
            }
            "openai" => {
                // For OpenAI, try to list models if API key is set
                if let Some(api_key) = &self.config.api_key {
                    let response = self.client
                        .get("https://api.openai.com/v1/models")
                        .header("Authorization", format!("Bearer {}", api_key))
                        .timeout(Duration::from_secs(5))
                        .send()
                        .await
                        .map_err(|e| format!("Connection failed: {}", e))?;
                    Ok(response.status().is_success())
                } else {
                    Err("OpenAI API key required".to_string())
                }
            }
            "claude" => {
                // For Claude, we can't easily test without making a real request
                // Just check if API key is set
                if self.config.api_key.is_some() {
                    Ok(true)
                } else {
                    Err("Claude API key required".to_string())
                }
            }
            _ => Ok(false),
        }
    }
}

// Prompt templates for Bible verse application
pub mod prompts {
    pub const SYSTEM_PROMPT: &str = r#"You are a knowledgeable Bible study assistant helping Christians understand and apply Scripture to their daily lives. Your responses should be:
- Rooted in biblical truth and context
- Practical and actionable
- Encouraging and edifying
- Respectful of the KJV translation
Keep responses concise but meaningful."#;

    pub fn verse_insight_prompt(verse_text: &str, reference: &str) -> String {
        format!(
            r#"Provide a brief, practical insight for this Bible verse:

{} - "{}"

Include:
1. What this verse meant in its original context (1-2 sentences)
2. How it applies to modern life (2-3 sentences)
3. One key takeaway for today

Keep the total response under 200 words."#,
            reference, verse_text
        )
    }

    pub fn action_steps_prompt(verse_text: &str, reference: &str, topic: &str) -> String {
        format!(
            r#"Generate 3 practical action steps for applying this Bible verse about {}:

{} - "{}"

For each step:
- Make it specific and doable this week
- Label difficulty: (easy/medium/challenging)
- Keep each step to 1-2 sentences

Format as:
1. [Easy] Step description
2. [Medium] Step description
3. [Challenging] Step description"#,
            topic, reference, verse_text
        )
    }

    pub fn reflection_questions_prompt(verse_text: &str, reference: &str) -> String {
        format!(
            r#"Generate 4 reflection questions for personal study of this Bible verse:

{} - "{}"

Create one question for each category:
1. Personal: How does this apply to my inner life?
2. Relational: How does this affect my relationships?
3. Spiritual: What does this reveal about God or faith?
4. Practical: What concrete action can I take?

Make questions thought-provoking but not overwhelming."#,
            reference, verse_text
        )
    }

    pub fn semantic_search_prompt(query: &str) -> String {
        format!(
            r#"A user is searching for Bible verses about: "{}"

List 5-10 relevant Bible topics or themes that would match this search, separated by commas. Focus on:
- The main topic
- Related emotional/spiritual needs
- Common life situations this relates to

Just list the topics, nothing else."#,
            query
        )
    }
}
