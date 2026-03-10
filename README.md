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

## Quick Install

The easiest way to get started — open your terminal and run:

```bash
npx verse-forge
```

That's it. The guided installer will:
1. Detect your operating system
2. Download the right version for you
3. Walk you through AI setup step-by-step
4. Teach you how to use every feature

> **Don't have Node.js?** Download it free at [nodejs.org](https://nodejs.org/) first, then run the command above.

## Manual Download

If you prefer to download directly:
**[Releases](https://github.com/JonDipilato/bible-applied/releases)**

| Platform | File |
|----------|------|
| Windows | `.msi` or `.exe` installer |
| macOS (Apple Silicon) | `.dmg` (aarch64) |
| macOS (Intel) | `.dmg` (x64) |
| Linux (Debian/Ubuntu) | `.deb` |
| Linux (Other) | `.AppImage` |

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

---

## Need Help?

**Stuck on something?** Run the guided setup again anytime:

```bash
npx verse-forge
```

Choose from the menu:
- **"Install Bible Verse Hunter"** — re-downloads the latest version for your OS
- **"Set up AI provider"** — step-by-step walkthrough for LM Studio, Ollama, OpenAI, or Claude
- **"Learn the app"** — 7-page feature tour showing everything the app can do
- **"Build from source"** — checks your dev tools and guides you through building

**Common issues:**
- **App won't start?** Make sure you ran the installer, not just downloaded the file
- **AI not working?** Go to Settings > Test Connection to verify your provider is running
- **LM Studio / Ollama connection fails?** Make sure the local server is running before testing
- **Need a free AI option?** Choose LM Studio or Ollama — both are free and run on your computer

**Still stuck?** [Open an issue](https://github.com/JonDipilato/bible-applied/issues)

## License

MIT
