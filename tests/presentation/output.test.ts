import { beforeAll, describe, expect, it, setSystemTime } from "bun:test";
import {
  printCityList,
  printError,
  printForecast,
  printSuccess,
  printWeather,
  printWeatherError,
} from "../../src/presentation/output.ts";
import { captureConsole } from "../helpers/mocks.ts";
import { makeCity, makeForecast, makeLima, makeMadrid, makeWeather } from "../helpers/fixtures.ts";

beforeAll(() => {
  setSystemTime(new Date("2026-09-01T12:00:00Z"));
});

describe("printError", () => {
  it("imprime el mensaje con sangría y saltos de línea", () => {
    const lines = captureConsole();
    printError("Error de prueba.");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe("\n  Error de prueba.\n");
  });
});

describe("printSuccess", () => {
  it("imprime el mensaje con sangría y saltos de línea", () => {
    const lines = captureConsole();
    printSuccess("Todo bien.");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe("\n  Todo bien.\n");
  });
});

describe("printWeather", () => {
  it("imprime la ubicación y la temperatura con unidad y hora", () => {
    const lines = captureConsole();
    printWeather(makeMadrid(), makeWeather(), "celsius");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("📍 Madrid, Madrid, España");
    expect(lines[1]).toContain("21.5°C");
    expect(lines[1]).toContain("(2026-09-01T12:00)");
  });

  it("respeta la unidad fahrenheit", () => {
    const lines = captureConsole();
    printWeather(makeMadrid(), makeWeather({ temperature_2m: 68.2 }), "fahrenheit");
    expect(lines[1]).toContain("68.2°F");
  });
});

describe("printWeatherError", () => {
  it("imprime la ubicación y el error de clima", () => {
    const lines = captureConsole();
    printWeatherError(makeLima());
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("📍 Lima, Lima, Perú");
    expect(lines[1]).toContain("Error al obtener el clima");
  });
});

describe("printCityList", () => {
  it("avisa cuando no hay ciudades", () => {
    const lines = captureConsole();
    printCityList([], "Ciudades registradas");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("No hay ciudades registradas.");
  });

  it("lista las ciudades numeradas desde 1", () => {
    const lines = captureConsole();
    printCityList([makeMadrid(), makeLima()], "Ciudades registradas");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain("Ciudades registradas:");
    expect(lines[1]).toContain("1. Madrid, Madrid, España");
    expect(lines[2]).toContain("2. Lima, Lima, Perú");
  });
});

describe("printForecast", () => {
  it("imprime la ubicación y los 7 días con max/min y descripción", () => {
    const lines = captureConsole();
    printForecast(makeMadrid(), makeForecast(), "celsius");
    expect(lines).toHaveLength(8);
    expect(lines[0]).toContain("📍 Madrid, Madrid, España");
    expect(lines[1]).toContain("Hoy: 30°C / 18°C");
    expect(lines[1]).toContain("Cielo claro");
    expect(lines[2]).toContain("Miércoles, 2 sept: 29°C / 17°C");
    expect(lines[2]).toContain("Mayormente claro");
    expect(lines[7]).toContain("Tormenta");
  });

  it("usa la descripción por defecto para códigos desconocidos", () => {
    const lines = captureConsole();
    printForecast(
      makeCity(),
      makeForecast({ time: ["2026-09-01"], weather_code: [42], temperature_2m_max: [20], temperature_2m_min: [10] }),
      "celsius",
    );
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("Hoy: 20°C / 10°C");
    expect(lines[1]).toContain("Desconocido");
  });

  it("respeta el utc_offset al calcular el día de hoy", () => {
    const lines = captureConsole();
    printForecast(
      makeCity(),
      makeForecast({ time: ["2026-09-02"], weather_code: [0], temperature_2m_max: [25], temperature_2m_min: [12], utc_offset_seconds: 86400 }),
      "celsius",
    );
    expect(lines[1]).toContain("Hoy: 25°C / 12°C");
  });

  it("respeta la unidad fahrenheit", () => {
    const lines = captureConsole();
    printForecast(makeCity(), makeForecast(), "fahrenheit");
    expect(lines[1]).toContain("Hoy: 30°F / 18°F");
  });
});
