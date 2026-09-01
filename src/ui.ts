import type { City, Config, Unit } from "./types.ts";
import { cyan, yellow, green, red } from "./colors.ts";

const UNIT_LABEL: Record<Unit, string> = {
  celsius: "°C",
  fahrenheit: "°F",
};

export function renderMenu(config: Config): void {
  const cityCount = config.cities.length;
  const unitLabel = UNIT_LABEL[config.unit];

  console.log(cyan("════════════════════════════════════════"));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan("════════════════════════════════════════"));
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${cityCount})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan(`  8. Ajustes (${unitLabel})`));
  console.log(cyan("  9. Salir"));
  console.log(cyan("════════════════════════════════════════"));
}

export function printWeather(city: City, weather: { temperature_2m: number; time: string }, unit: Unit): void {
  const unitLabel = UNIT_LABEL[unit];
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  console.log(green(`  📍 ${location}`));
  console.log(yellow(`  🌡  ${weather.temperature_2m}${unitLabel}  (${weather.time})`));
}

export function printCityList(cities: City[], label: string): void {
  if (cities.length === 0) {
    console.log(red(`  No hay ciudades registradas.`));
    return;
  }
  console.log(green(`  ${label}:`));
  cities.forEach((c, i) => {
    const location = [c.name, c.admin1, c.country].filter(Boolean).join(", ");
    console.log(green(`    ${i + 1}. ${location}`));
  });
}
