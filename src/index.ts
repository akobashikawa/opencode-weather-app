import { addCity } from "./actions/addCity.ts";
import { getForecast } from "./actions/getForecast.ts";
import { getAllCitiesWeather, getDefaultCityWeather } from "./actions/getWeather.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { toggleUnit } from "./actions/toggleUnit.ts";
import { showMenu } from "./presentation/menu.ts";
import { printError, printSuccess } from "./presentation/output.ts";
import { allCities, loadCities } from "./storage/citiesStorage.ts";
import { loadSettings } from "./storage/settingsStorage.ts";

async function main(): Promise<void> {
  while (true) {
    const cities = await loadCities();
    const settings = await loadSettings();
    const option = showMenu({ cityCount: allCities(cities).length, unit: settings.unit });
    if (!option) continue;

    switch (option) {
      case "1":
        await getDefaultCityWeather();
        break;
      case "2":
        await getAllCitiesWeather();
        break;
      case "3":
        await addCity();
        break;
      case "4":
        await removeCity();
        break;
      case "5":
        await setDefaultCity();
        break;
      case "6":
        await getForecast();
        break;
      case "8":
        await toggleUnit();
        break;
      case "9":
        printSuccess("¡Hasta luego!");
        process.exit(0);
        break;
      default:
        printError("Opción inválida.");
        break;
    }
  }
}

main();
