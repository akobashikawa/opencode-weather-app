import { selectCityFromList } from "./listCities.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { allCities, loadCities, saveCities } from "../storage/citiesStorage.ts";
import { formatLocation } from "../utils/format.ts";

export async function setDefaultCity(): Promise<void> {
  const cities = await loadCities();
  const all = allCities(cities);
  if (all.length === 0) {
    printError("No hay ciudades registradas. Busque una ciudad primero (opción 3).");
    return;
  }
  const selection = selectCityFromList(all, "Ciudades disponibles", "  Número de ciudad default:");
  if (!selection) return;
  const selected = selection.city;
  if (cities.defaultCity?.name === selected.name && cities.defaultCity?.latitude === selected.latitude) {
    printError("Ya es la ciudad default.");
    return;
  }
  cities.defaultCity = selected;
  cities.cities = cities.cities.filter(
    (c) => !(c.name === selected.name && c.latitude === selected.latitude),
  );
  saveCities(cities);
  printSuccess(`Ciudad default: ${formatLocation(selected)}`);
}
