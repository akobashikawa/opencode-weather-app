import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import { makeBogota, makeLima, makeMadrid, readCitiesData, writeCitiesData } from "../helpers/fixtures.ts";
import { captureConsole, restoreGlobals, stubPrompt } from "../helpers/mocks.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeEach(useTempCwd);
afterEach(() => {
  restoreCwd();
  restoreGlobals();
});

describe("setDefaultCity", () => {
  it("avisa cuando no hay ciudades registradas", async () => {
    const lines = captureConsole();
    await setDefaultCity();
    expect(lines.join("\n")).toContain("No hay ciudades registradas. Busque una ciudad primero (opción 3).");
  });

  it("avisa cuando se elige la ciudad default actual", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    stubPrompt("1");
    const lines = captureConsole();
    await setDefaultCity();
    const out = lines.join("\n");
    expect(out).toContain("Ya es la ciudad default.");
    expect(out).not.toContain("Ciudad default:");
    expect(await readCitiesData()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima()] });
  });

  it("promueve la ciudad elegida a default y la quita de la lista", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
    stubPrompt("3");
    const lines = captureConsole();
    await setDefaultCity();
    expect(lines.join("\n")).toContain("Ciudad default: Bogotá, Bogotá D.C., Colombia");
    expect(await readCitiesData()).toEqual({ defaultCity: makeBogota(), cities: [makeLima()] });
  });

  it("establece default partiendo de una lista sin default", async () => {
    await writeCitiesData({ defaultCity: null, cities: [makeMadrid(), makeLima()] });
    stubPrompt("2");
    const lines = captureConsole();
    await setDefaultCity();
    expect(lines.join("\n")).toContain("Ciudad default: Lima, Lima, Perú");
    expect(await readCitiesData()).toEqual({ defaultCity: makeLima(), cities: [makeMadrid()] });
  });

  it("no cambia nada si se cancela la selección", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    stubPrompt("");
    const lines = captureConsole();
    await setDefaultCity();
    expect(lines.join("\n")).not.toContain("Ciudad default:");
    expect(await readCitiesData()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima()] });
  });
});
