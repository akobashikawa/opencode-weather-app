import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { allCities, loadCities, saveCities } from "../../src/storage/citiesStorage.ts";
import { makeBogota, makeLima, makeMadrid, readCitiesData, writeCitiesData, writeLegacyConfig } from "../helpers/fixtures.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeEach(useTempCwd);
afterEach(restoreCwd);

describe("loadCities", () => {
  it("devuelve los valores por defecto cuando no hay archivos", async () => {
    const data = await loadCities();
    expect(data.defaultCity).toBeNull();
    expect(data.cities).toEqual([]);
  });

  it("lee el archivo de ciudades cuando existe", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    const data = await loadCities();
    expect(data.defaultCity?.name).toBe("Madrid");
    expect(data.cities).toHaveLength(1);
    expect(data.cities[0]?.name).toBe("Lima");
  });

  it("aplica fallbacks cuando faltan campos en el archivo", async () => {
    await Bun.write("weather-cities.json", JSON.stringify({}));
    const data = await loadCities();
    expect(data.defaultCity).toBeNull();
    expect(data.cities).toEqual([]);
  });

  it("aplica fallback de defaultCity cuando solo hay cities", async () => {
    await Bun.write("weather-cities.json", JSON.stringify({ cities: [makeLima()] }));
    const data = await loadCities();
    expect(data.defaultCity).toBeNull();
    expect(data.cities).toHaveLength(1);
  });

  it("aplica fallback de cities cuando solo hay defaultCity", async () => {
    await Bun.write("weather-cities.json", JSON.stringify({ defaultCity: makeMadrid() }));
    const data = await loadCities();
    expect(data.defaultCity?.name).toBe("Madrid");
    expect(data.cities).toEqual([]);
  });
});

describe("migración desde weather-config.json", () => {
  it("migra el archivo legacy y persiste weather-cities.json", async () => {
    await writeLegacyConfig({ defaultCity: makeMadrid(), cities: [makeLima()] });
    const data = await loadCities();
    expect(data.defaultCity?.name).toBe("Madrid");
    expect(data.cities.map((c) => c.name)).toEqual(["Lima"]);
    expect(await Bun.file("weather-cities.json").exists()).toBe(true);
    expect(await readCitiesData()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima()] });
  });

  it("aplica fallbacks cuando el legacy tiene campos faltantes", async () => {
    await writeLegacyConfig({});
    const data = await loadCities();
    expect(data.defaultCity).toBeNull();
    expect(data.cities).toEqual([]);
    expect(await Bun.file("weather-cities.json").exists()).toBe(true);
  });

  it("ignora el legacy cuando ya existe weather-cities.json", async () => {
    await writeLegacyConfig({ defaultCity: makeBogota(), cities: [] });
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    const data = await loadCities();
    expect(data.defaultCity?.name).toBe("Madrid");
  });
});

describe("saveCities", () => {
  it("guarda y recupera los datos (roundtrip)", async () => {
    saveCities({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
    expect(await loadCities()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
  });
});

describe("allCities", () => {
  it("coloca la ciudad default primero", () => {
    const all = allCities({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
    expect(all.map((c) => c.name)).toEqual(["Madrid", "Lima", "Bogotá"]);
  });

  it("sin default devuelve la lista tal cual", () => {
    const all = allCities({ defaultCity: null, cities: [makeLima(), makeBogota()] });
    expect(all.map((c) => c.name)).toEqual(["Lima", "Bogotá"]);
  });

  it("devuelve un array nuevo sin mutar cities", () => {
    const cities = [makeLima()];
    const all = allCities({ defaultCity: null, cities });
    expect(all).not.toBe(cities);
    expect(cities).toHaveLength(1);
  });
});
