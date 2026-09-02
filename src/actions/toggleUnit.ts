import { printSuccess } from "../presentation/output.ts";
import { loadSettings, saveSettings } from "../storage/settingsStorage.ts";
import { UNIT_LABEL } from "../utils/constants.ts";

export async function toggleUnit(): Promise<void> {
  const settings = await loadSettings();
  settings.unit = settings.unit === "celsius" ? "fahrenheit" : "celsius";
  await saveSettings(settings);
  printSuccess(`Unidad: ${UNIT_LABEL[settings.unit]}`);
}
