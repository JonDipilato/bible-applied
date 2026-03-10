# Repository Guidelines

This repository contains a Tauri desktop app for exploring KJV Bible verses with AI-powered insights. Use the `app/` directory for all build, run, and code changes.

## Project Structure & Module Organization
- `app/src/`: React + TypeScript frontend. Pages live in `app/src/pages/`, shared UI in `app/src/components/`, state in `app/src/stores/`, API clients in `app/src/api/`, and global styles in `app/src/styles/globals.css`.
- `app/src-tauri/`: Rust backend, Tauri config, and SQLite assets. Migrations live in `app/src-tauri/migrations/`, and bundled data is in `app/src-tauri/data/`.
- `app/public/`: Static frontend assets.
- `docs/`: Product, architecture, database schema, and LLM integration references.

## Build, Test, and Development Commands
Run these from `app/`:
- `pnpm install`: install JS dependencies.
- `pnpm dev`: Vite dev server (web-only).
- `pnpm tauri dev`: run the desktop app with the Rust backend.
- `pnpm build`: type-check and build the frontend.
- `pnpm tauri build`: produce desktop installers/bundles.
- `pnpm preview`: preview the built frontend.

## Coding Style & Naming Conventions
- TypeScript/React uses 2-space indentation and single quotes; keep components functional and hook usage near the top of components.
- Component and page files use PascalCase (e.g., `VerseDetail.tsx`); stores and utilities use camelCase with descriptive suffixes (e.g., `settingsStore.ts`).
- Rust modules and files use `snake_case` in `app/src-tauri/src/`.
- Prefer Tailwind utility classes for UI styling; use `app/src/styles/globals.css` for shared tokens and base styles.

## Testing Guidelines
- No test runner is configured in `app/package.json` yet. If you add tests, include a script (e.g., `pnpm test`) and name files `*.test.tsx` or `*.test.ts`.
- For Rust, co-locate unit tests in `app/src-tauri/src/` with `#[cfg(test)]` modules and run them via `cargo test` in `app/src-tauri/`.

## Commit & Pull Request Guidelines
- Recent commit messages use short, imperative summaries like “Add …” or “Fix …”. Keep them concise and action-oriented.
- PRs should include a clear description, testing notes (commands run), and screenshots for UI changes. Call out any new migrations in `app/src-tauri/migrations/` and update docs when changing AI providers or schema.

## Configuration & Security Tips
- API keys and provider settings are user-configured in the app; do not commit secrets. For provider details, see `docs/LLM_INTEGRATION.md`.
