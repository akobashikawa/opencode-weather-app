import { fetchForecast } from "../api/weather.ts";
import { printError, printForecast } from "../presentation/output.ts";
import { loadCities } from "../storage/citiesStorage.ts";
import { loadSettings } from "../storage/settingsStorage.ts";

export async function getForecast(): Promise<void> {
  const { defaultCity } = await loadCities();
  if (!defaultCity) {
    printError("No hay ciudad default configurada.");
    return;
  }
  const { unit } = await loadSettings();
  const forecast = await fetchForecast(defaultCity, unit);
  if (!forecast) {
    printError("Error al obtener el pronóstico.");
    return;
  }
  console.log("");
  printForecast(defaultCity, forecast, unit);
  console.log("");
}
