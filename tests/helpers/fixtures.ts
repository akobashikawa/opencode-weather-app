import type { City } from "../../src/types/City.ts";
import type { CitiesData, Settings } from "../../src/types/Config.ts";
import type { CurrentWeather, DailyForecast } from "../../src/types/Weather.ts";
import type { GeocodeResult } from "../../src/api/geocoding.ts";
import { CITIES_FILE, LEGACY_CONFIG_FILE, SETTINGS_FILE } from "../../src/utils/constants.ts";

export function makeCity(overrides: Partial<City> = {}): City {
  return {
    name: "Madrid",
    latitude: 40.4165,
    longitude: -3.7026,
    country: "España",
    admin1: "Madrid",
    ...overrides,
  };
}

export function makeMadrid(): City {
  return makeCity();
}

export function makeLima(): City {
  return makeCity({ name: "Lima", latitude: -12.0464, longitude: -77.0428, country: "Perú", admin1: "Lima" });
}

export function makeBogota(): City {
  return makeCity({ name: "Bogotá", latitude: 4.711, longitude: -74.0721, country: "Colombia", admin1: "Bogotá D.C." });
}

export function makeGeocodeResult(overrides: Partial<GeocodeResult> = {}): GeocodeResult {
  return {
    name: "Madrid",
    latitude: 40.4165,
    longitude: -3.7026,
    country: "España",
    admin1: "Madrid",
    ...overrides,
  };
}

export function makeWeather(overrides: Partial<CurrentWeather> = {}): CurrentWeather {
  return {
    temperature_2m: 21.5,
    time: "2026-09-01T12:00",
    ...overrides,
  };
}

export function makeForecast(overrides: Partial<DailyForecast> = {}): DailyForecast {
  return {
    utc_offset_seconds: 0,
    time: ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06", "2026-09-07"],
    weather_code: [0, 1, 2, 3, 45, 61, 95],
    temperature_2m_max: [30, 29, 27, 25, 22, 20, 28],
    temperature_2m_min: [18, 17, 16, 15, 14, 13, 17],
    ...overrides,
  };
}

export async function writeCitiesData(data: CitiesData): Promise<void> {
  await Bun.write(CITIES_FILE, JSON.stringify(data, null, 2));
}

export async function readCitiesData(): Promise<CitiesData> {
  return JSON.parse(await Bun.file(CITIES_FILE).text()) as CitiesData;
}

export async function writeSettingsData(settings: Settings): Promise<void> {
  await Bun.write(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function readSettingsData(): Promise<Settings> {
  return JSON.parse(await Bun.file(SETTINGS_FILE).text()) as Settings;
}

export async function writeLegacyConfig(data: unknown): Promise<void> {
  await Bun.write(LEGACY_CONFIG_FILE, JSON.stringify(data, null, 2));
}
