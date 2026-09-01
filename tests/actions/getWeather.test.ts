import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { getAllCitiesWeather, getDefaultCityWeather } from "../../src/actions/getWeather.ts";
import { makeLima, makeMadrid, makeWeather, writeCitiesData, writeSettingsData } from "../helpers/fixtures.ts";
import { captureConsole, fetchUrls, restoreGlobals, stubFetch } from "../helpers/mocks.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeEach(useTempCwd);
afterEach(() => {
  restoreCwd();
  restoreGlobals();
});

describe("getDefaultCityWeather", () => {
  it("avisa cuando no hay ciudad default configurada", async () => {
    const lines = captureConsole();
    await getDefaultCityWeather();
    expect(lines.join("\n")).toContain("No hay ciudad default configurada.");
    expect(fetchUrls()).toHaveLength(0);
  });

  it("muestra el clima de la ciudad default en celsius", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    await writeSettingsData({ unit: "celsius" });
    stubFetch(() => Response.json({ current: makeWeather() }));
    const lines = captureConsole();
    await getDefaultCityWeather();
    const out = lines.join("\n");
    expect(out).toContain("📍 Madrid, Madrid, España");
    expect(out).toContain("21.5°C");
    expect(fetchUrls()).toHaveLength(1);
    expect(fetchUrls()[0]).toContain("latitude=40.4165");
    expect(fetchUrls()[0]).toContain("temperature_unit=celsius");
  });

  it("usa la unidad configurada al pedir el clima", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [] });
    await writeSettingsData({ unit: "fahrenheit" });
    stubFetch(() => Response.json({ current: makeWeather({ temperature_2m: 68.2 }) }));
    const lines = captureConsole();
    await getDefaultCityWeather();
    expect(lines.join("\n")).toContain("68.2°F");
    expect(fetchUrls()[0]).toContain("temperature_unit=fahrenheit");
  });

  it("avisa cuando falla la petición del clima", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [] });
    stubFetch(() => new Response("boom", { status: 500 }));
    const lines = captureConsole();
    await getDefaultCityWeather();
    expect(lines.join("\n")).toContain("Error al obtener el clima.");
  });
});

describe("getAllCitiesWeather", () => {
  it("avisa cuando no hay ciudades registradas", async () => {
    const lines = captureConsole();
    await getAllCitiesWeather();
    expect(lines.join("\n")).toContain("No hay ciudades registradas.");
    expect(fetchUrls()).toHaveLength(0);
  });

  it("muestra el clima de la default y del resto de ciudades", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    stubFetch((url) => {
      if (url.includes("latitude=-12.0464")) return Response.json({ current: makeWeather({ temperature_2m: 15 }) });
      return Response.json({ current: makeWeather() });
    });
    const lines = captureConsole();
    await getAllCitiesWeather();
    const out = lines.join("\n");
    expect(out).toContain("📍 Madrid, Madrid, España");
    expect(out).toContain("21.5°C");
    expect(out).toContain("📍 Lima, Lima, Perú");
    expect(out).toContain("15°C");
    expect(fetchUrls()).toHaveLength(2);
  });

  it("muestra el error solo para las ciudades que fallan", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    stubFetch((url) => {
      if (url.includes("latitude=-12.0464")) return new Response("boom", { status: 500 });
      return Response.json({ current: makeWeather() });
    });
    const lines = captureConsole();
    await getAllCitiesWeather();
    const out = lines.join("\n");
    expect(out).toContain("📍 Lima, Lima, Perú");
    expect(out.match(/Error al obtener el clima/g)).toHaveLength(1);
    expect(out).toContain("21.5°C");
  });
});
