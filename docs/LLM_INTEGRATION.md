# KJV Bible Verse Hunter
## LLM Integration Specification

**Version:** 1.0
**Last Updated:** December 2024

---

## Overview

The Bible Verse Hunter supports multiple LLM providers with a flexible routing system. Users can:
- Use local LLMs (LM Studio, Ollama) for free, private queries
- Use cloud APIs (Claude, OpenAI) for advanced capabilities
- Mix providers based on task type and preference

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LLM SERVICE LAYER                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   LLM ROUTER                          │   │
│  │  • Provider selection                                 │   │
│  │  • Request routing                                    │   │
│  │  • Fallback handling                                  │   │
│  │  • Token tracking                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐          │
│  │ LM Studio  │   │  Claude    │   │  OpenAI    │          │
│  │  Provider  │   │  Provider  │   │  Provider  │          │
│  └────────────┘   └────────────┘   └────────────┘          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 SHARED SERVICES                       │   │
│  │  • Token Counter    • Response Cache                  │   │
│  │  • Quota Manager    • Rate Limiter                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Provider Configurations

### LM Studio (Local)

**Default provider** - Free, private, offline-capable.

```typescript
interface LMStudioConfig {
  provider: 'lmstudio';
  baseUrl: string;        // Default: 'http://localhost:1234'
  model?: string;         // Auto-detected from server
  maxTokens: number;      // Default: 2048
  temperature: number;    // Default: 0.7
}
```

**API Compatibility:** OpenAI-compatible API

```typescript
// Request format
POST http://localhost:1234/v1/chat/completions
{
  "model": "local-model",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "max_tokens": 2048,
  "temperature": 0.7,
  "stream": false
}
```

**Setup Instructions:**
1. Install LM Studio from https://lmstudio.ai
2. Download a model (recommended: Llama 3, Mistral, or Phi-3)
3. Start the local server (default port 1234)
4. Configure in Bible Verse Hunter settings

---

### Claude API (Anthropic)

**Premium option** - High-quality insights, excellent for Biblical understanding.

```typescript
interface ClaudeConfig {
  provider: 'claude';
  apiKey: string;
  model: string;          // 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'
  maxTokens: number;      // Default: 2048
  temperature: number;    // Default: 0.7
}
```

**API Format:**

```typescript
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: {apiKey}
  anthropic-version: 2023-06-01
  content-type: application/json

{
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 2048,
  "messages": [
    { "role": "user", "content": "..." }
  ],
  "system": "You are a Biblical wisdom assistant..."
}
```

**Model Options:**
| Model | Best For | Cost |
|-------|----------|------|
| claude-3-opus | Complex theological analysis | $$$$ |
| claude-3-sonnet | Balanced quality/cost | $$ |
| claude-3-haiku | Fast, simple queries | $ |

---

### OpenAI API

**Alternative cloud option** - Widely compatible, good general performance.

```typescript
interface OpenAIConfig {
  provider: 'openai';
  apiKey: string;
  model: string;          // 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'
  maxTokens: number;      // Default: 2048
  temperature: number;    // Default: 0.7
}
```

**API Format:**

```typescript
POST https://api.openai.com/v1/chat/completions
Headers:
  Authorization: Bearer {apiKey}
  Content-Type: application/json

{
  "model": "gpt-4o",
  "max_tokens": 2048,
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "temperature": 0.7
}
```

**Model Options:**
| Model | Best For | Cost |
|-------|----------|------|
| gpt-4o | Best quality | $$$ |
| gpt-4o-mini | Good balance | $$ |
| gpt-3.5-turbo | Budget option | $ |

---

### Ollama (Local Alternative)

**Alternative local option** - Similar to LM Studio.

```typescript
interface OllamaConfig {
  provider: 'ollama';
  baseUrl: string;        // Default: 'http://localhost:11434'
  model: string;          // 'llama3', 'mistral', etc.
  maxTokens: number;
  temperature: number;
}
```

**API Format:**

```typescript
POST http://localhost:11434/api/chat
{
  "model": "llama3",
  "messages": [...],
  "stream": false
}
```

---

## Prompt Templates

### System Prompt (Base)

```
You are a Biblical wisdom assistant helping Christians apply Scripture to their daily lives.

Your role is to:
1. Provide accurate, faithful interpretations grounded in the KJV Bible text
2. Offer practical, actionable application guidance
3. Maintain a warm, encouraging, and pastoral tone
4. Reference specific Scripture when relevant
5. Avoid denominational bias while remaining Biblically sound

Guidelines:
- Always cite verse references in the format "Book Chapter:Verse" (e.g., John 3:16)
- Focus on practical application, not just theological explanation
- Be concise but thorough
- When uncertain, acknowledge limitations rather than speculating
```

### Semantic Search Prompt

```
SYSTEM:
{base_system_prompt}

Your task is to find Bible verses relevant to the user's query.

USER:
Find KJV Bible verses related to: "{query}"

Consider:
- Direct teachings on this topic
- Stories or examples illustrating the concept
- Promises or principles that apply
- Practical wisdom verses

Return a JSON array of the most relevant verse references with brief explanations:
[
  {
    "reference": "Proverbs 3:5-6",
    "relevance": "Direct teaching on trusting God",
    "snippet": "Trust in the LORD with all thine heart..."
  }
]

Return 5-10 most relevant verses, ranked by relevance.
```

### Verse Insights Prompt

```
SYSTEM:
{base_system_prompt}

USER:
Provide insights for applying this verse to daily life:

Verse: {reference}
Text: "{verse_text}"

{context_if_provided}

Please provide:

1. CONTEXT (2-3 sentences)
Brief historical/literary context that helps understand the verse.

2. MEANING (2-3 sentences)
What this verse teaches us in plain language.

3. APPLICATION (3-4 bullet points)
Practical ways to apply this verse today. Be specific and actionable.

4. REFLECTION QUESTION
One thought-provoking question for personal meditation.

5. RELATED VERSES (2-3 references)
Other verses that reinforce or expand on this teaching.

Keep your response concise and practical.
```

### Action Steps Prompt

```
SYSTEM:
{base_system_prompt}

Your task is to generate practical action steps for applying Scripture.

USER:
Generate 4 practical action steps for applying this verse:

Verse: {reference}
Text: "{verse_text}"

Requirements for each action step:
- Specific and concrete (not vague)
- Doable today or this week
- Varied difficulty (mix of easy and challenging)
- Connected directly to the verse's teaching

Format as JSON:
[
  {
    "step": 1,
    "action": "Write down one area where you're seeking your own understanding instead of God's",
    "difficulty": "easy",
    "timeframe": "5 minutes"
  }
]
```

### Personalized Application Prompt

```
SYSTEM:
{base_system_prompt}

The user is seeking personalized guidance for applying Scripture to their situation.

USER:
Help me apply this verse to my specific situation:

Verse: {reference}
Text: "{verse_text}"

My situation: {user_context}

Please provide:
1. How this verse specifically addresses my situation
2. 2-3 concrete steps I can take based on this verse
3. A word of encouragement grounded in this Scripture

Be pastoral, specific, and practical.
```

---

## Token Management

### Estimation (Pre-request)

```typescript
// Rough token estimation
function estimateTokens(text: string): number {
  // ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

// Check before request
async function preflightCheck(prompt: string, config: LLMConfig): Promise<{
  estimatedCost: number;
  withinQuota: boolean;
  recommendation: string;
}> {
  const inputTokens = estimateTokens(prompt);
  const outputEstimate = config.maxTokens;
  const totalEstimate = inputTokens + outputEstimate;

  const quota = await getQuotaStatus();
  const withinQuota = quota.tokens_remaining >= totalEstimate;

  return {
    estimatedCost: calculateCost(totalEstimate, config.provider),
    withinQuota,
    recommendation: withinQuota ? 'proceed' : 'use_local_or_purchase'
  };
}
```

### Usage Tracking

```typescript
interface TokenUsageRecord {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  requestType: 'search' | 'insights' | 'application';
  cached: boolean;
  timestamp: Date;
}

async function recordUsage(usage: TokenUsageRecord) {
  await db.insert('token_usage', usage);
  await updateQuota(usage.inputTokens + usage.outputTokens);
}
```

### Quota Enforcement

```typescript
interface QuotaStatus {
  tier: 'free' | 'premium';
  period: { start: Date; end: Date };
  queries: { used: number; limit: number };
  tokens: { used: number; limit: number; purchased: number };
}

async function checkQuota(): Promise<{ allowed: boolean; reason?: string }> {
  const status = await getQuotaStatus();

  if (status.tier === 'free' && status.queries.used >= status.queries.limit) {
    return {
      allowed: false,
      reason: 'Monthly query limit reached. Upgrade to premium or use local LLM.'
    };
  }

  return { allowed: true };
}
```

---

## Response Caching

### Cache Strategy

```typescript
interface CacheConfig {
  enabled: boolean;
  ttlHours: number;       // Default: 24
  maxEntries: number;     // Default: 1000
}

// What to cache
const CACHEABLE_REQUESTS = [
  'semantic_search',      // Same query = same results
  'verse_insights',       // Same verse = same base insights
  'action_steps',         // Same verse = same steps
];

// What NOT to cache
const NON_CACHEABLE = [
  'personalized_application',  // User context varies
];
```

### Cache Key Generation

```typescript
import { createHash } from 'crypto';

function generateCacheKey(request: LLMRequest): string {
  const normalized = {
    type: request.type,
    verseId: request.verseId,
    query: request.query?.toLowerCase().trim(),
    // Exclude user context for personalized requests
  };

  return createHash('sha256')
    .update(JSON.stringify(normalized))
    .digest('hex');
}
```

### Cache Lookup Flow

```
Request → Generate Key → Check Cache
                            │
                   ┌────────┴────────┐
                   ▼                 ▼
               [HIT]              [MISS]
                   │                 │
                   ▼                 ▼
           Return Cached        Call LLM
           (increment hit)          │
                                    ▼
                              Store in Cache
                                    │
                                    ▼
                              Return Response
```

---

## Error Handling

### Provider Errors

```typescript
enum LLMErrorType {
  CONNECTION_FAILED = 'connection_failed',
  AUTHENTICATION_FAILED = 'auth_failed',
  RATE_LIMITED = 'rate_limited',
  QUOTA_EXCEEDED = 'quota_exceeded',
  MODEL_UNAVAILABLE = 'model_unavailable',
  INVALID_RESPONSE = 'invalid_response',
  TIMEOUT = 'timeout',
}

interface LLMError {
  type: LLMErrorType;
  provider: string;
  message: string;
  retryable: boolean;
  retryAfter?: number;   // Seconds
}
```

### Fallback Strategy

```typescript
const FALLBACK_CHAIN = {
  'claude': ['openai', 'lmstudio'],
  'openai': ['claude', 'lmstudio'],
  'lmstudio': ['ollama'],  // Local-only fallback
};

async function requestWithFallback(request: LLMRequest): Promise<LLMResponse> {
  const primaryProvider = getActiveProvider();

  try {
    return await makeRequest(primaryProvider, request);
  } catch (error) {
    if (error.retryable && FALLBACK_CHAIN[primaryProvider]) {
      for (const fallback of FALLBACK_CHAIN[primaryProvider]) {
        try {
          return await makeRequest(fallback, request);
        } catch (fallbackError) {
          continue;
        }
      }
    }
    throw error;
  }
}
```

### User-Facing Error Messages

```typescript
const ERROR_MESSAGES: Record<LLMErrorType, string> = {
  connection_failed: 'Could not connect to AI service. Check your connection or try local AI.',
  auth_failed: 'API key is invalid. Please check your settings.',
  rate_limited: 'Too many requests. Please wait a moment and try again.',
  quota_exceeded: 'Monthly limit reached. Upgrade to premium or use local AI.',
  model_unavailable: 'Selected model is not available. Please choose another.',
  invalid_response: 'Received unexpected response. Please try again.',
  timeout: 'Request timed out. Try a simpler query or use local AI.',
};
```

---

## Settings UI Integration

### Provider Configuration Screen

```typescript
interface LLMSettingsState {
  activeProvider: string;
  providers: {
    lmstudio: {
      enabled: boolean;
      baseUrl: string;
      status: 'connected' | 'disconnected' | 'checking';
      model?: string;
    };
    claude: {
      enabled: boolean;
      apiKey: string;
      model: string;
      status: 'connected' | 'disconnected' | 'checking';
    };
    openai: {
      enabled: boolean;
      apiKey: string;
      model: string;
      status: 'connected' | 'disconnected' | 'checking';
    };
  };
  defaults: {
    maxTokens: number;
    temperature: number;
    cacheEnabled: boolean;
  };
}
```

### Connection Testing

```typescript
async function testProvider(provider: string): Promise<{
  success: boolean;
  latency?: number;
  model?: string;
  error?: string;
}> {
  const start = Date.now();

  try {
    const response = await makeTestRequest(provider);
    return {
      success: true,
      latency: Date.now() - start,
      model: response.model,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
```

---

## Security Considerations

### API Key Storage

```rust
// Rust backend - encrypted storage
use ring::aead::{Aad, LessSafeKey, Nonce, UnboundKey, AES_256_GCM};

pub fn encrypt_api_key(key: &str) -> Result<Vec<u8>, Error> {
    // Derive encryption key from machine-specific data
    let encryption_key = derive_machine_key()?;

    // Encrypt with AES-256-GCM
    let encrypted = seal(&encryption_key, key.as_bytes())?;

    Ok(encrypted)
}

pub fn decrypt_api_key(encrypted: &[u8]) -> Result<String, Error> {
    let encryption_key = derive_machine_key()?;
    let decrypted = open(&encryption_key, encrypted)?;
    Ok(String::from_utf8(decrypted)?)
}
```

### Request Sanitization

```typescript
// Never send user notes/journal content to cloud LLMs without consent
function sanitizeRequest(request: LLMRequest): LLMRequest {
  return {
    ...request,
    // Remove potentially sensitive user data
    userContext: request.userContext
      ? '[User has provided personal context]'
      : undefined,
  };
}

// Ask for explicit consent when using cloud + personal data
async function requestWithConsent(request: LLMRequest): Promise<LLMResponse> {
  if (isCloudProvider(activeProvider) && request.userContext) {
    const consent = await askUserConsent(
      'Send your personal notes to cloud AI for personalized insights?'
    );
    if (!consent) {
      return makeRequest(request, { stripContext: true });
    }
  }
  return makeRequest(request);
}
```

---

## Usage Examples

### Semantic Search

```typescript
// Frontend
const results = await llmApi.searchSemantic('dealing with financial stress');

// Backend flow
1. Check quota
2. Check cache (key: hash of normalized query)
3. If miss: call LLM with semantic_search prompt
4. Parse JSON response into verse references
5. Fetch full verses from database
6. Cache response
7. Track token usage
8. Return enriched results
```

### Generate Insights

```typescript
// Frontend
const insights = await llmApi.generateInsights(verseId, userContext);

// Backend flow
1. Fetch verse text from database
2. Check cache (if no user context)
3. Build prompt with verse + optional context
4. Call LLM
5. Parse structured response
6. Cache (if no user context)
7. Track usage
8. Return insights object
```

### Local LLM with Fallback

```typescript
// User preference: local first, cloud backup
const config = {
  primaryProvider: 'lmstudio',
  fallbackChain: ['claude'],
  localOnly: false,  // Allow cloud fallback
};

// Flow
1. Try LM Studio
2. If connection fails → notify user, try Claude
3. If Claude succeeds → record usage, suggest checking local server
4. If all fail → graceful degradation (show static content)
```

---

## Monitoring & Analytics

### Metrics to Track

```typescript
interface LLMMetrics {
  // Performance
  averageLatency: number;
  p95Latency: number;
  successRate: number;

  // Usage
  totalRequests: number;
  requestsByType: Record<string, number>;
  requestsByProvider: Record<string, number>;

  // Cost
  totalTokens: number;
  estimatedCost: number;
  cacheHitRate: number;

  // Errors
  errorRate: number;
  errorsByType: Record<string, number>;
}
```

### Dashboard Data

```sql
-- Daily usage summary
SELECT
    date(timestamp) as date,
    provider,
    COUNT(*) as requests,
    SUM(input_tokens + output_tokens) as total_tokens,
    AVG(CASE WHEN cached THEN 1 ELSE 0 END) as cache_hit_rate
FROM token_usage
WHERE timestamp > datetime('now', '-30 days')
GROUP BY date, provider
ORDER BY date DESC;
```

---

*LLM integration designed for flexibility, privacy, and cost control.*
