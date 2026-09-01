export type Unit = "celsius" | "fahrenheit";

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface Config {
  defaultCity: City | null;
  cities: City[];
  unit: Unit;
}

export const defaultConfig: Config = {
  defaultCity: null,
  cities: [],
  unit: "celsius",
};

export function allCities(config: Config): City[] {
  return config.defaultCity ? [config.defaultCity, ...config.cities] : [...config.cities];
}
