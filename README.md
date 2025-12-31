# Bible Verse Hunter

A beautiful desktop app for exploring KJV Bible verses with AI-powered insights, action steps, and reflection questions.

![Bible Verse Hunter](docs/screenshot.png)

## Features

- Browse the complete KJV Bible by book and chapter
- Topic-based verse collections (Faith, Love, Wisdom, etc.)
- AI-powered verse insights and applications
- Generate personalized action steps and reflection questions
- Personal notes and highlights
- Dark/Light mode support

## Download

Download the latest release for your platform:
**[Releases](https://github.com/JonDipilato/bible-applied/releases)**

- **Windows**: `.msi` or `.exe` installer
- **macOS**: `.dmg` (Intel & Apple Silicon)
- **Linux**: `.deb` or `.AppImage`

---

## AI Setup Guide

The app supports multiple AI providers for generating insights. Choose one:

### Option 1: LM Studio (Free, Local, Private)

Best for: Running AI completely offline on your own computer.

1. **Download LM Studio**: https://lmstudio.ai/
2. **Install a model**:
   - Open LM Studio → Search tab
   - Search for `TheBloke/Mistral-7B-Instruct-v0.2-GGUF` (or any chat model)
   - Download the Q4_K_M version (good balance of speed/quality)
3. **Start the server**:
   - Go to the "Local Server" tab (left sidebar)
   - Click "Start Server"
   - Note the server address (usually `http://localhost:1234`)
4. **Configure the app**:
   - Open Bible Verse Hunter → Settings
   - Provider: `LM Studio`
   - Server URL: `http://localhost:1234`
   - Click "Test Connection"

### Option 2: Ollama (Free, Local, Private)

Best for: Easy local setup with simple commands.

1. **Install Ollama**: https://ollama.ai/
2. **Pull a model**:
   ```bash
   ollama pull mistral
   ```
3. **Ollama runs automatically** on `http://localhost:11434`
4. **Configure the app**:
   - Open Bible Verse Hunter → Settings
   - Provider: `LM Studio` (uses same API format)
   - Server URL: `http://localhost:11434/v1`
   - Click "Test Connection"

### Option 3: OpenAI API (Paid, Cloud)

Best for: Highest quality responses, no local setup.

1. **Get an API key**: https://platform.openai.com/api-keys
2. **Configure the app**:
   - Open Bible Verse Hunter → Settings
   - Provider: `OpenAI`
   - API Key: `sk-...` (your key)
   - Model: `gpt-4o-mini` (affordable) or `gpt-4o` (best quality)
   - Click "Test Connection"

**Cost**: ~$0.01-0.03 per insight generated

### Option 4: Claude API (Paid, Cloud)

Best for: Thoughtful, nuanced theological insights.

1. **Get an API key**: https://console.anthropic.com/
2. **Configure the app**:
   - Open Bible Verse Hunter → Settings
   - Provider: `Claude`
   - API Key: `sk-ant-...` (your key)
   - Model: `claude-3-haiku-20240307` (fast/cheap) or `claude-3-sonnet-20240229` (better)
   - Click "Test Connection"

**Cost**: ~$0.01-0.05 per insight generated

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Rust](https://rustup.rs/)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/JonDipilato/bible-applied.git
cd bible-applied/app

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

### Build for Production

```bash
pnpm tauri build
```

Installers will be in `src-tauri/target/release/bundle/`

---

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, React Query
- **Backend**: Rust, Tauri 2.0
- **Database**: SQLite (embedded)
- **AI**: OpenAI-compatible API (LM Studio, Ollama, OpenAI, Claude)

## License

MIT
