import type { Config } from "./types.ts";
import { defaultConfig } from "./types.ts";

const CONFIG_FILE = "weather-config.json";

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_FILE);
  if (!(await file.exists())) return { ...defaultConfig };

  const text = await file.text();
  const data = JSON.parse(text) as Config;
  return {
    defaultCity: data.defaultCity ?? null,
    cities: data.cities ?? [],
    unit: data.unit ?? "celsius",
  };
}

export function saveConfig(config: Config): void {
  Bun.write(CONFIG_FILE, JSON.stringify(config, null, 2));
}
