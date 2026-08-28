# AGENTS.md

## Project

Weather CLI application built with Bun.js. Single-file entrypoint at `index.ts`. README and comments are in Spanish.

## Commands

- Run: `bun index.ts`
- Install deps: `bun install`
- No test, lint, or build scripts defined in `package.json`.

## Conventions

- **Runtime**: Bun, not Node.js. Use `bun <file>`, `bun test`, `bun install`, `bunx`.
- Bun auto-loads `.env` — do not use dotenv.
- See `bun-instructions.md` for full Bun API preferences.
- TypeScript strict mode with `moduleResolution: "bundler"`.
