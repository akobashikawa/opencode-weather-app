# AGENTS.md

## Project

Interactive, menu-driven weather CLI built with Bun. Weather data comes from the Open-Meteo APIs (geocoding + current weather + 7-day forecast). Features: default city, multi-city list, 7-day forecast for the default city, °C/°F toggle, ANSI-colored output. README and comments are in Spanish.

Structure: `src/index.ts` is the entrypoint (menu loop + dispatch to actions). Code is layered by responsibility (see `file-system.md` for the reference layout):

- `src/actions/` — one file per user action: `getWeather.ts` (default city + all cities), `getForecast.ts`, `addCity.ts`, `removeCity.ts`, `setDefaultCity.ts`, `listCities.ts` (shared list/selection helper), `toggleUnit.ts`
- `src/presentation/` — console interaction: `menu.ts` (render + option prompt), `output.ts` (printing), `input.ts` (prompt wrappers with validation)
- `src/storage/` — `citiesStorage.ts` (`weather-cities.json`: defaultCity + cities, plus `allCities()`) and `settingsStorage.ts` (`weather-settings.json`: unit); both migrate from the legacy `weather-config.json` on first load
- `src/types/` — shared types: `City.ts`, `Weather.ts` (Unit, CurrentWeather, DailyForecast), `MenuOption.ts`, `Config.ts` (CitiesData, Settings, defaults)
- `src/api/` — `geocoding.ts`, `weather.ts` (Open-Meteo fetches)
- `src/utils/` — `colors.ts`, `constants.ts` (URLs, unit labels, WMO codes, storage file names), `format.ts` (location/temperature/date formatters)

## Commands

- Run: `bun src/index.ts` (or `bun run dev` with `--watch`)
- Build binary: `bun run build` → `dist/weather`
- Typecheck: `bun run typecheck` (strict mode — run it after edits)
- Install deps: `bun install`
- Smoke test (non-interactive): `printf '9\n' | NO_COLOR=1 bun src/index.ts`
- No test or lint scripts yet.

## Conventions

- **Runtime**: Bun, not Node.js. Use `bun <file>`, `bun test`, `bun install`, `bunx`.
- Bun auto-loads `.env` — do not use dotenv.
- See `bun-instructions.md` for full Bun API preferences.
- TypeScript strict mode with `moduleResolution: "bundler"` and `noUncheckedIndexedAccess` — prefer guards over `!` assertions.
- **State**: actions load/save state per invocation via `src/storage/` — there is no shared config object; each storage module owns its JSON file.
- `weather-cities.json` and `weather-settings.json` are runtime data in the project root (gitignored); `weather-cities-sample.json` and `weather-settings-sample.json` are the tracked samples — never commit the real ones.
- Colors only via the `src/utils/colors.ts` helpers (cyan menu, yellow prompts/temperature, green ok, red errors); they respect `NO_COLOR`/non-TTY — don't hardcode ANSI anywhere else.
