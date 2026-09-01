import type { City } from "../types/City.ts";
import type { CurrentWeather, DailyForecast, Unit } from "../types/Weather.ts";
import { green, red, yellow } from "../utils/colors.ts";
import { UNIT_LABEL, WMO_CODES } from "../utils/constants.ts";
import { formatDay, formatLocation, formatTemperature } from "../utils/format.ts";

export function printError(message: string): void {
  console.log(red(`\n  ${message}\n`));
}

export function printSuccess(message: string): void {
  console.log(green(`\n  ${message}\n`));
}

export function printWeather(city: City, weather: CurrentWeather, unit: Unit): void {
  console.log(green(`  📍 ${formatLocation(city)}`));
  console.log(yellow(`  🌡  ${formatTemperature(weather.temperature_2m, unit)}  (${weather.time})`));
}

export function printWeatherError(city: City): void {
  console.log(green(`  📍 ${formatLocation(city)}`));
  console.log(red(`  ❌ Error al obtener el clima`));
}

export function printCityList(cities: City[], label: string): void {
  if (cities.length === 0) {
    console.log(red(`  No hay ciudades registradas.`));
    return;
  }
  console.log(green(`  ${label}:`));
  cities.forEach((c, i) => {
    console.log(green(`    ${i + 1}. ${formatLocation(c)}`));
  });
}

export function printForecast(city: City, forecast: DailyForecast, unit: Unit): void {
  console.log(green(`  📍 ${formatLocation(city)}`));
  const nowMs = Date.now() + (forecast.utc_offset_seconds ?? 0) * 1000;
  const today = new Date(nowMs).toISOString().slice(0, 10);
  for (let i = 0; i < forecast.time.length; i++) {
    const date = forecast.time[i];
    const code = forecast.weather_code[i];
    const max = forecast.temperature_2m_max[i];
    const min = forecast.temperature_2m_min[i];
    if (date === undefined || code === undefined || max === undefined || min === undefined) continue;
    const label = date === today ? "Hoy" : formatDay(date);
    const desc = WMO_CODES[code] ?? "🌀 Desconocido";
    console.log(`  ${label}: ${yellow(`${formatTemperature(max, unit)} / ${formatTemperature(min, unit)}`)}  ${desc}`);
  }
}
