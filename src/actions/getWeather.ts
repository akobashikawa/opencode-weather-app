import { fetchWeather } from "../api/weather.ts";
import { printError, printWeather, printWeatherError } from "../presentation/output.ts";
import { allCities, loadCities } from "../storage/citiesStorage.ts";
import { loadSettings } from "../storage/settingsStorage.ts";

export async function getDefaultCityWeather(): Promise<void> {
  const { defaultCity } = await loadCities();
  if (!defaultCity) {
    printError("No hay ciudad default configurada.");
    return;
  }
  const { unit } = await loadSettings();
  const weather = await fetchWeather(defaultCity, unit);
  if (!weather) {
    printError("Error al obtener el clima.");
    return;
  }
  console.log("");
  printWeather(defaultCity, weather, unit);
  console.log("");
}

export async function getAllCitiesWeather(): Promise<void> {
  const cities = await loadCities();
  const all = allCities(cities);
  if (all.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  const { unit } = await loadSettings();
  console.log("");
  for (const city of all) {
    const weather = await fetchWeather(city, unit);
    if (weather) {
      printWeather(city, weather, unit);
    } else {
      printWeatherError(city);
    }
    console.log("");
  }
}
