import type { City, DailyForecast, Unit } from "./types.ts";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

interface GeocodeResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export async function geocodeCity(
  name: string,
): Promise<GeocodeResult | null> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  const data = await res.json() as { results?: GeocodeResult[] };
  return data.results?.[0] ?? null;
}

export async function fetchWeather(
  city: City,
  unit: Unit,
): Promise<{ temperature_2m: number; time: string } | null> {
  const unitParam = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m&temperature_unit=${unitParam}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json() as {
    current: { temperature_2m: number; time: string };
  };
  return data.current;
}

export async function fetchForecast(
  city: City,
  unit: Unit,
): Promise<DailyForecast | null> {
  const unitParam = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto&temperature_unit=${unitParam}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json() as { daily: DailyForecast; utc_offset_seconds: number };
  return { ...data.daily, utc_offset_seconds: data.utc_offset_seconds };
}
