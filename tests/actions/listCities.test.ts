import { afterEach, describe, expect, it } from "bun:test";
import { selectCityFromList } from "../../src/actions/listCities.ts";
import { makeLima, makeMadrid } from "../helpers/fixtures.ts";
import { captureConsole, restoreGlobals, stubPrompt } from "../helpers/mocks.ts";

afterEach(restoreGlobals);

describe("selectCityFromList", () => {
  it("imprime la lista y devuelve la ciudad con su índice", () => {
    const lines = captureConsole();
    stubPrompt("2");
    const selection = selectCityFromList([makeMadrid(), makeLima()], "Ciudades disponibles", "  Número de ciudad:");
    expect(selection).toEqual({ city: makeLima(), index: 1 });
    const out = lines.join("\n");
    expect(out).toContain("Ciudades disponibles:");
    expect(out).toContain("1. Madrid, Madrid, España");
    expect(out).toContain("2. Lima, Lima, Perú");
  });

  it("devuelve null con entrada vacía", () => {
    captureConsole();
    stubPrompt("");
    expect(selectCityFromList([makeMadrid()], "Ciudades", "  Número:")).toBeNull();
  });

  it("devuelve null e imprime error con un número fuera de rango", () => {
    const lines = captureConsole();
    stubPrompt("5");
    expect(selectCityFromList([makeMadrid()], "Ciudades", "  Número:")).toBeNull();
    expect(lines.join("\n")).toContain("Opción inválida.");
  });
});
