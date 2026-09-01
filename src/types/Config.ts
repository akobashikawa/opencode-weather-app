import type { City } from "./City.ts";
import type { Unit } from "./Weather.ts";

export interface CitiesData {
  defaultCity: City | null;
  cities: City[];
}

export interface Settings {
  unit: Unit;
}

export const defaultCities: CitiesData = {
  defaultCity: null,
  cities: [],
};

export const defaultSettings: Settings = {
  unit: "celsius",
};
