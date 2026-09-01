export type Unit = "celsius" | "fahrenheit";

export interface CurrentWeather {
  temperature_2m: number;
  time: string;
}

export interface DailyForecast {
  utc_offset_seconds?: number;
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}
