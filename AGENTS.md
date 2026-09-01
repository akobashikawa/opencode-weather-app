# AGENTS.md

## Project

Interactive, menu-driven weather CLI built with Bun. Weather data comes from the Open-Meteo APIs (geocoding + current weather). Features: default city, multi-city list, °C/°F toggle, ANSI-colored output. README and comments are in Spanish.

Structure: `index.ts` is the entrypoint (menu loop) and `src/` holds the modules:

- `src/api.ts` — Open-Meteo fetches (geocoding + current weather)
- `src/storage.ts` — config load/save
- `src/ui.ts` — menu and output rendering
- `src/colors.ts` — ANSI color helpers
- `src/types.ts` — `City`, `Config`, `Unit` types and the `allCities()` helper

## Commands

- Run: `bun index.ts` (or `bun run dev` with `--watch`)
- Build binary: `bun run build` → `dist/weather`
- Typecheck: `bun run typecheck` (strict mode — run it after edits)
- Install deps: `bun install`
- No test or lint scripts yet.

## Conventions

- **Runtime**: Bun, not Node.js. Use `bun <file>`, `bun test`, `bun install`, `bunx`.
- Bun auto-loads `.env` — do not use dotenv.
- See `bun-instructions.md` for full Bun API preferences.
- TypeScript strict mode with `moduleResolution: "bundler"` and `noUncheckedIndexedAccess` — prefer guards over `!` assertions.
- `weather-config.json` is runtime data in the project root (gitignored); `weather-config-sample.json` is the tracked sample — never commit the real one.
- Colors only via the `src/colors.ts` helpers (cyan menu, yellow prompts/temperature, green ok, red errors); they respect `NO_COLOR`/non-TTY — don't hardcode ANSI anywhere else.
