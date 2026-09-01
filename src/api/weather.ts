import type { City } from "../types/City.ts";
import type { CurrentWeather, DailyForecast, Unit } from "../types/Weather.ts";
import { FORECAST_URL } from "../utils/constants.ts";

export async function fetchWeather(city: City, unit: Unit): Promise<CurrentWeather | null> {
  const unitParam = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m&temperature_unit=${unitParam}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json() as {
    current: CurrentWeather;
  };
  return data.current;
}

export async function fetchForecast(city: City, unit: Unit): Promise<DailyForecast | null> {
  const unitParam = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto&temperature_unit=${unitParam}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json() as { daily: DailyForecast; utc_offset_seconds: number };
  return { ...data.daily, utc_offset_seconds: data.utc_offset_seconds };
}
