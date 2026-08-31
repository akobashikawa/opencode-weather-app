import { loadConfig, saveConfig } from "./src/storage.ts";
import { geocodeCity, fetchWeather } from "./src/api.ts";
import { renderMenu, printWeather, printCityList } from "./src/ui.ts";
import { yellow, green, red } from "./src/colors.ts";
import type { City, Config, Unit } from "./src/types.ts";

async function main(): Promise<void> {
  let config = await loadConfig();

  while (true) {
    renderMenu(config);
    const option = prompt(yellow("  Selecciona una opción:"));
    if (!option) continue;

    switch (option) {
      case "1": {
        if (!config.defaultCity) {
          console.log(red("\n  No hay ciudad default configurada.\n"));
          break;
        }
        const weather = await fetchWeather(config.defaultCity, config.unit);
        if (!weather) {
          console.log(red("\n  Error al obtener el clima.\n"));
          break;
        }
        console.log("");
        printWeather(config.defaultCity, weather, config.unit);
        console.log("");
        break;
      }

      case "2": {
        const all = config.defaultCity
          ? [config.defaultCity, ...config.cities]
          : [...config.cities];
        if (all.length === 0) {
          console.log(red("\n  No hay ciudades registradas.\n"));
          break;
        }
        console.log("");
        for (const city of all) {
          const weather = await fetchWeather(city, config.unit);
          if (weather) {
            printWeather(city, weather, config.unit);
          } else {
            const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
            console.log(green(`  📍 ${location}`));
            console.log(red(`  ❌ Error al obtener el clima`));
          }
          console.log("");
        }
        break;
      }

      case "3": {
        const name = prompt(yellow("  Nombre de la ciudad:"));
        if (!name) break;
        const result = await geocodeCity(name);
        if (!result) {
          console.log(red("\n  Ciudad no encontrada.\n"));
          break;
        }
        const location = [result.name, result.admin1, result.country].filter(Boolean).join(", ");
        console.log(green(`\n  Encontrada: ${location}`));
        const confirm = prompt(yellow("  ¿Agregar? (s/n):"));
        if (confirm?.toLowerCase() !== "s") break;
        const city: City = {
          name: result.name,
          latitude: result.latitude,
          longitude: result.longitude,
          country: result.country,
          admin1: result.admin1,
        };
        config.cities.push(city);
        saveConfig(config);
        console.log(green("  Ciudad agregada.\n"));
        break;
      }

      case "4": {
        if (config.cities.length === 0) {
          console.log(red("\n  No hay ciudades para eliminar.\n"));
          break;
        }
        printCityList(config.cities, "Ciudades registradas");
        const idx = prompt(yellow("  Número de ciudad a eliminar:"));
        if (!idx) break;
        const num = parseInt(idx, 10);
        if (isNaN(num) || num < 1 || num > config.cities.length) {
          console.log(red("\n  Opción inválida.\n"));
          break;
        }
        const removed = config.cities[num - 1];
        if (!removed) break;
        config.cities.splice(num - 1, 1);
        saveConfig(config);
        const loc = [removed.name, removed.admin1, removed.country].filter(Boolean).join(", ");
        console.log(green(`\n  ${loc} eliminada.\n`));
        break;
      }

      case "5": {
        const all = config.defaultCity
          ? [config.defaultCity, ...config.cities]
          : [...config.cities];
        if (all.length === 0) {
          console.log(red("\n  No hay ciudades registradas. Busque una ciudad primero (opción 3).\n"));
          break;
        }
        printCityList(all, "Ciudades disponibles");
        const idx = prompt(yellow("  Número de ciudad default:"));
        if (!idx) break;
        const num = parseInt(idx, 10);
        if (isNaN(num) || num < 1 || num > all.length) {
          console.log(red("\n  Opción inválida.\n"));
          break;
        }
        const selected = all[num - 1];
        if (!selected) break;
        if (config.defaultCity?.name === selected.name && config.defaultCity?.latitude === selected.latitude) {
          console.log(red("\n  Ya es la ciudad default.\n"));
          break;
        }
        config.defaultCity = selected;
        config.cities = config.cities.filter(
          (c) => !(c.name === selected.name && c.latitude === selected.latitude),
        );
        saveConfig(config);
        const loc = [selected.name, selected.admin1, selected.country].filter(Boolean).join(", ");
        console.log(green(`\n  Ciudad default: ${loc}\n`));
        break;
      }

      case "8": {
        const newUnit: Unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
        config.unit = newUnit;
        saveConfig(config);
        console.log(green(`\n  Unidad: ${newUnit === "celsius" ? "°C" : "°F"}\n`));
        break;
      }

      case "9": {
        console.log(green("\n  ¡Hasta luego!\n"));
        process.exit(0);
      }

      default:
        console.log(red("\n  Opción inválida.\n"));
        break;
    }
  }
}

main();
