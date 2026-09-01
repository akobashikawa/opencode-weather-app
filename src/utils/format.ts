import type { City } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";
import { UNIT_LABEL } from "./constants.ts";

export function formatLocation(city: Pick<City, "name" | "admin1" | "country">): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}

export function formatTemperature(value: number, unit: Unit): string {
  return `${value}${UNIT_LABEL[unit]}`;
}

export function formatDay(date: string): string {
  const d = new Date(`${date}T00:00`);
  const label = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
