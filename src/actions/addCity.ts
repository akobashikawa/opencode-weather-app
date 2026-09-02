import { geocodeCity } from "../api/geocoding.ts";
import { promptConfirm, promptText } from "../presentation/input.ts";
import { printError } from "../presentation/output.ts";
import { loadCities, saveCities } from "../storage/citiesStorage.ts";
import type { City } from "../types/City.ts";
import { green } from "../utils/colors.ts";
import { formatLocation } from "../utils/format.ts";

export async function addCity(): Promise<void> {
  const name = promptText("  Nombre de la ciudad:");
  if (!name) return;
  const result = await geocodeCity(name);
  if (!result) {
    printError("Ciudad no encontrada.");
    return;
  }
  console.log(green(`\n  Encontrada: ${formatLocation(result)}`));
  if (!promptConfirm("  ¿Agregar? (s/n):")) return;
  const city: City = {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  };
  const cities = await loadCities();
  cities.cities.push(city);
  await saveCities(cities);
  console.log(green("  Ciudad agregada.\n"));
}
