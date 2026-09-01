import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { removeCity } from "../../src/actions/removeCity.ts";
import { makeBogota, makeLima, makeMadrid, readCitiesData, writeCitiesData } from "../helpers/fixtures.ts";
import { captureConsole, restoreGlobals, stubPrompt } from "../helpers/mocks.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeEach(useTempCwd);
afterEach(() => {
  restoreCwd();
  restoreGlobals();
});

describe("removeCity", () => {
  it("avisa cuando no hay ciudades para eliminar", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [] });
    const lines = captureConsole();
    await removeCity();
    expect(lines.join("\n")).toContain("No hay ciudades para eliminar.");
  });

  it("muestra la lista pero no elimina nada si se cancela", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
    stubPrompt("");
    const lines = captureConsole();
    await removeCity();
    const out = lines.join("\n");
    expect(out).toContain("Ciudades registradas");
    expect(out).toContain("1. Lima, Lima, Perú");
    expect(out).not.toContain("eliminada.");
    expect(await readCitiesData()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
  });

  it("elimina la ciudad seleccionada y persiste", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima(), makeBogota()] });
    stubPrompt("2");
    const lines = captureConsole();
    await removeCity();
    expect(lines.join("\n")).toContain("Bogotá, Bogotá D.C., Colombia eliminada.");
    expect(await readCitiesData()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima()] });
  });

  it("no elimina nada con un número fuera de rango", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [makeLima()] });
    stubPrompt("9");
    const lines = captureConsole();
    await removeCity();
    const out = lines.join("\n");
    expect(out).toContain("Opción inválida.");
    expect(out).not.toContain("eliminada.");
    expect(await readCitiesData()).toEqual({ defaultCity: makeMadrid(), cities: [makeLima()] });
  });
});
