import type { Settings } from "../types/Config.ts";
import { defaultSettings } from "../types/Config.ts";
import type { Unit } from "../types/Weather.ts";
import { SETTINGS_FILE, LEGACY_CONFIG_FILE } from "../utils/constants.ts";

export async function loadSettings(): Promise<Settings> {
  const file = Bun.file(SETTINGS_FILE);
  if (await file.exists()) {
    const data = JSON.parse(await file.text()) as Settings;
    return { unit: data.unit ?? defaultSettings.unit };
  }
  return migrateFromLegacyConfig();
}

export function saveSettings(settings: Settings): void {
  Bun.write(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

async function migrateFromLegacyConfig(): Promise<Settings> {
  const legacy = Bun.file(LEGACY_CONFIG_FILE);
  if (!(await legacy.exists())) return { ...defaultSettings };
  const data = JSON.parse(await legacy.text()) as { unit?: Unit };
  const settings: Settings = { unit: data.unit ?? defaultSettings.unit };
  saveSettings(settings);
  return settings;
}
