import type { City } from "../types/City.ts";
import { promptNumber } from "../presentation/input.ts";
import { printCityList } from "../presentation/output.ts";

export interface CitySelection {
  city: City;
  index: number;
}

export function selectCityFromList(cities: City[], label: string, promptMessage: string): CitySelection | null {
  printCityList(cities, label);
  const num = promptNumber(promptMessage, 1, cities.length);
  if (num === null) return null;
  const city = cities[num - 1];
  if (!city) return null;
  return { city, index: num - 1 };
}
