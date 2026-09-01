import type { City, Config, DailyForecast, Unit } from "./types.ts";
import { allCities } from "./types.ts";
import { cyan, yellow, green, red } from "./colors.ts";

const UNIT_LABEL: Record<Unit, string> = {
  celsius: "°C",
  fahrenheit: "°F",
};

export function renderMenu(config: Config): void {
  const cityCount = allCities(config).length;
  const unitLabel = UNIT_LABEL[config.unit];

  console.log(cyan("════════════════════════════════════════"));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan("════════════════════════════════════════"));
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${cityCount})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan("  6. Pronóstico 7 días (default)"));
  console.log(cyan(`  8. Ajustes (${unitLabel})`));
  console.log(cyan("  9. Salir"));
  console.log(cyan("════════════════════════════════════════"));
}

export function printWeather(city: City, weather: { temperature_2m: number; time: string }, unit: Unit): void {
  const unitLabel = UNIT_LABEL[unit];
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  console.log(green(`  📍 ${location}`));
  console.log(yellow(`  🌡  ${weather.temperature_2m}${unitLabel}  (${weather.time})`));
}

export function printCityList(cities: City[], label: string): void {
  if (cities.length === 0) {
    console.log(red(`  No hay ciudades registradas.`));
    return;
  }
  console.log(green(`  ${label}:`));
  cities.forEach((c, i) => {
    const location = [c.name, c.admin1, c.country].filter(Boolean).join(", ");
    console.log(green(`    ${i + 1}. ${location}`));
  });
}

const WMO_CODES: Record<number, string> = {
  0: "☀️ Cielo claro",
  1: "🌤 Mayormente claro",
  2: "⛅ Parcialmente nublado",
  3: "☁️ Nublado",
  45: "🌫 Niebla",
  48: "🌫 Niebla con escarcha",
  51: "🌦 Llovizna ligera",
  53: "🌦 Llovizna",
  55: "🌧 Llovizna densa",
  56: "🌧 Llovizna helada",
  57: "🌧 Llovizna helada densa",
  61: "🌧 Lluvia ligera",
  63: "🌧 Lluvia",
  65: "🌧 Lluvia intensa",
  66: "🌧 Lluvia helada",
  67: "🌧 Lluvia helada intensa",
  71: "🌨 Nieve ligera",
  73: "🌨 Nieve",
  75: "❄️ Nieve intensa",
  77: "🌨 Granos de nieve",
  80: "🌦 Chubascos ligeros",
  81: "🌧 Chubascos",
  82: "⛈ Chubascos fuertes",
  85: "🌨 Chubascos de nieve",
  86: "❄️ Chubascos de nieve fuertes",
  95: "⛈ Tormenta",
  96: "⛈ Tormenta con granizo",
  99: "⛈ Tormenta con granizo fuerte",
};

function formatDay(date: string): string {
  const d = new Date(`${date}T00:00`);
  const label = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function printForecast(city: City, forecast: DailyForecast, unit: Unit): void {
  const unitLabel = UNIT_LABEL[unit];
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  console.log(green(`  📍 ${location}`));
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
    console.log(`  ${label}: ${yellow(`${max}${unitLabel} / ${min}${unitLabel}`)}  ${desc}`);
  }
}
