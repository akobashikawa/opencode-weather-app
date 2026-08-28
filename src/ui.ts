import type { City, Config, Unit } from "./types.ts";

const UNIT_LABEL: Record<Unit, string> = {
  celsius: "°C",
  fahrenheit: "°F",
};

export function renderMenu(config: Config): void {
  const cityCount = config.cities.length;
  const unitLabel = UNIT_LABEL[config.unit];

  console.log("════════════════════════════════════════");
  console.log("         WEATHER CLI");
  console.log("════════════════════════════════════════");
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${cityCount})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitLabel})`);
  console.log("  9. Salir");
  console.log("════════════════════════════════════════");
}

export function printWeather(city: City, weather: { temperature_2m: number; time: string }, unit: Unit): void {
  const unitLabel = UNIT_LABEL[unit];
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  console.log(`  📍 ${location}`);
  console.log(`  🌡  ${weather.temperature_2m}${unitLabel}  (${weather.time})`);
}

export function printCityList(cities: City[], label: string): void {
  if (cities.length === 0) {
    console.log(`  No hay ciudades registradas.`);
    return;
  }
  console.log(`  ${label}:`);
  cities.forEach((c, i) => {
    const location = [c.name, c.admin1, c.country].filter(Boolean).join(", ");
    console.log(`    ${i + 1}. ${location}`);
  });
}
