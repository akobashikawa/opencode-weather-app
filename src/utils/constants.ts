import type { Unit } from "../types/Weather.ts";

export const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const CITIES_FILE = "weather-cities.json";
export const SETTINGS_FILE = "weather-settings.json";
export const LEGACY_CONFIG_FILE = "weather-config.json";

export const UNIT_LABEL: Record<Unit, string> = {
  celsius: "°C",
  fahrenheit: "°F",
};

export const WMO_CODES: Record<number, string> = {
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
