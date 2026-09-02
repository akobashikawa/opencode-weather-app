import type { City } from "../types/City.ts";
import type { CitiesData } from "../types/Config.ts";
import { defaultCities } from "../types/Config.ts";
import { CITIES_FILE, LEGACY_CONFIG_FILE } from "../utils/constants.ts";

export async function loadCities(): Promise<CitiesData> {
  const file = Bun.file(CITIES_FILE);
  if (await file.exists()) {
    const data = JSON.parse(await file.text()) as CitiesData;
    return {
      defaultCity: data.defaultCity ?? null,
      cities: data.cities ?? [],
    };
  }
  return migrateFromLegacyConfig();
}

export async function saveCities(cities: CitiesData): Promise<void> {
  await Bun.write(CITIES_FILE, JSON.stringify(cities, null, 2));
}

export function allCities(cities: CitiesData): City[] {
  return cities.defaultCity ? [cities.defaultCity, ...cities.cities] : [...cities.cities];
}

async function migrateFromLegacyConfig(): Promise<CitiesData> {
  const legacy = Bun.file(LEGACY_CONFIG_FILE);
  if (!(await legacy.exists())) return { ...defaultCities };
  const data = JSON.parse(await legacy.text()) as { defaultCity?: City | null; cities?: City[] };
  const cities: CitiesData = {
    defaultCity: data.defaultCity ?? null,
    cities: data.cities ?? [],
  };
  await saveCities(cities);
  return cities;
}
