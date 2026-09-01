import { selectCityFromList } from "./listCities.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { loadCities, saveCities } from "../storage/citiesStorage.ts";
import { formatLocation } from "../utils/format.ts";

export async function removeCity(): Promise<void> {
  const cities = await loadCities();
  if (cities.cities.length === 0) {
    printError("No hay ciudades para eliminar.");
    return;
  }
  const selection = selectCityFromList(cities.cities, "Ciudades registradas", "  Número de ciudad a eliminar:");
  if (!selection) return;
  const removed = cities.cities.splice(selection.index, 1)[0];
  if (!removed) return;
  saveCities(cities);
  printSuccess(`${formatLocation(removed)} eliminada.`);
}
