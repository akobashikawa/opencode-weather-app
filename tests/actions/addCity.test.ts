import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { addCity } from "../../src/actions/addCity.ts";
import {
  makeBogota,
  makeGeocodeResult,
  makeLima,
  makeMadrid,
  readCitiesData,
  writeCitiesData,
} from "../helpers/fixtures.ts";
import { captureConsole, fetchUrls, restoreGlobals, stubFetch, stubPrompt } from "../helpers/mocks.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";
import { GEOCODE_URL } from "../../src/utils/constants.ts";

beforeEach(useTempCwd);
afterEach(() => {
  restoreCwd();
  restoreGlobals();
});

function stubGeocodeFound(): void {
  stubFetch((url) => {
    if (url.startsWith(GEOCODE_URL)) return Response.json({ results: [makeGeocodeResult()] });
    return Response.json({});
  });
}

describe("addCity", () => {
  it("no hace nada cuando el nombre queda vacío", async () => {
    stubPrompt("");
    const lines = captureConsole();
    await addCity();
    expect(fetchUrls()).toHaveLength(0);
    expect(await Bun.file("weather-cities.json").exists()).toBe(false);
    expect(lines.join("\n")).not.toContain("Ciudad agregada.");
  });

  it("avisa cuando la ciudad no se encuentra", async () => {
    stubPrompt("Narnia");
    stubFetch((url) => {
      if (url.startsWith(GEOCODE_URL)) return Response.json({});
      return Response.json({});
    });
    const lines = captureConsole();
    await addCity();
    expect(lines.join("\n")).toContain("Ciudad no encontrada.");
    expect(await Bun.file("weather-cities.json").exists()).toBe(false);
  });

  it("muestra la ciudad encontrada pero no guarda si se cancela", async () => {
    stubPrompt("Madrid", "n");
    stubGeocodeFound();
    const lines = captureConsole();
    await addCity();
    const out = lines.join("\n");
    expect(out).toContain("Encontrada: Madrid, Madrid, España");
    expect(out).not.toContain("Ciudad agregada.");
    expect(await Bun.file("weather-cities.json").exists()).toBe(false);
  });

  it("guarda la ciudad confirmada", async () => {
    stubPrompt("Madrid", "s");
    stubGeocodeFound();
    const lines = captureConsole();
    await addCity();
    expect(lines.join("\n")).toContain("Ciudad agregada.");
    expect(await readCitiesData()).toEqual({ defaultCity: null, cities: [makeMadrid()] });
  });

  it("anexa la ciudad nueva a las existentes sin tocar la default", async () => {
    await writeCitiesData({ defaultCity: makeLima(), cities: [makeBogota()] });
    stubPrompt("Madrid", "s");
    stubGeocodeFound();
    captureConsole();
    await addCity();
    const data = await readCitiesData();
    expect(data.defaultCity?.name).toBe("Lima");
    expect(data.cities.map((c) => c.name)).toEqual(["Bogotá", "Madrid"]);
  });
});
