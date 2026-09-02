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
- `tests/` — mirrors the `src/` layout (`utils/`, `storage/`, `api/`, `presentation/`, `actions/`, `integration/`), plus shared helpers in `tests/helpers/` (temp-cwd isolation, fixtures, `fetch`/`prompt`/console stubs)

## Commands

- Run: `bun src/index.ts` (or `bun run dev` with `--watch`)
- Build binary: `bun run build` → `dist/weather` (runs `typecheck` + `bun run test` first; the compile step is skipped if either fails)
- Typecheck: `bun run typecheck` (strict mode — run it after edits)
- Test: `bun run test` (i.e. `bun test --parallel`); watch: `bun run test:watch`; run a subset with `bun test tests/<folder> --parallel`
- Install deps: `bun install`
- Smoke test (non-interactive): `printf '9\n' | NO_COLOR=1 bun src/index.ts`
- No lint script yet.

## CI / Releases

- `.github/workflows/release.yml` runs on push to `master`: reads `version` from `package.json`; if tag `v<version>` doesn't exist yet, it builds the linux x64 binary via `bun run build` (so typecheck + tests also gate the release) and publishes a GitHub release (`gh`) with `weather-linux-x64` attached.
- Bun is pinned in CI (`bun-version` in `setup-bun`) for reproducible builds — bump it deliberately, don't rely on "latest".
- To publish a new release: bump `version` in `package.json` and push to `master`. Pushes without a version bump skip the release job (idempotent).
- Uses the auto-provisioned `GITHUB_TOKEN` with `permissions: contents: write` — no extra secrets required.

## Conventions

- **Runtime**: Bun, not Node.js. Use `bun <file>`, `bun test`, `bun install`, `bunx`.
- Bun auto-loads `.env` — do not use dotenv.
- See `bun-instructions.md` for full Bun API preferences.
- TypeScript strict mode with `moduleResolution: "bundler"` and `noUncheckedIndexedAccess` — prefer guards over `!` assertions.
- **State**: actions load/save state per invocation via `src/storage/` — there is no shared config object; each storage module owns its JSON file.
- `weather-cities.json` and `weather-settings.json` are runtime data in the project root (gitignored); `weather-cities-sample.json` and `weather-settings-sample.json` are the tracked samples — never commit the real ones.
- Colors only via the `src/utils/colors.ts` helpers (cyan menu, yellow prompts/temperature, green ok, red errors); they respect `NO_COLOR`/non-TTY — don't hardcode ANSI anywhere else.
- **Testing**: Bun's built-in runner (`bun:test`), no external test deps. Tests live in `tests/` mirroring the `src/` layout, with shared helpers in `tests/helpers/` (temp-cwd isolation, `fetch`/`prompt` stubs, ANSI-stripped console capture). Unit tests never touch the network or the real `weather-cities.json`/`weather-settings.json`; integration tests spawn the CLI as a subprocess (`NO_COLOR=1`, temp cwd, piped stdin). Test descriptions are in Spanish.
- **Why `bun test --parallel`**: test isolation uses `process.chdir()` + relative paths (`tests/helpers/tmpCwd.ts`), which is process-global — only safe if test files never overlap in one process. `--parallel` runs each file in its own worker process. Plain `bun test` overlapped tests on 4-core CI runners with Bun 1.4.0 and leaked cwd state between files. Don't remove the flag.
