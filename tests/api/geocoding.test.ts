import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { geocodeCity } from "../../src/api/geocoding.ts";
import { fetchUrls, restoreGlobals, stubFetch } from "../helpers/mocks.ts";
import { makeGeocodeResult } from "../helpers/fixtures.ts";

beforeEach(() => {
  stubFetch(() => Response.json({ results: [makeGeocodeResult()] }));
});
afterEach(restoreGlobals);

describe("geocodeCity", () => {
  it("devuelve el primer resultado", async () => {
    const result = await geocodeCity("Madrid");
    expect(result).toEqual(makeGeocodeResult());
  });

  it("construye la URL con count=1, language=es y format=json", async () => {
    await geocodeCity("Madrid");
    expect(fetchUrls()[0]).toBe("https://geocoding-api.open-meteo.com/v1/search?name=Madrid&count=1&language=es&format=json");
  });

  it("codifica nombres con espacios y caracteres especiales", async () => {
    await geocodeCity("Buenos Aires");
    expect(fetchUrls()[0]).toContain("name=Buenos%20Aires");
    await geocodeCity("Ciudad de México");
    expect(fetchUrls()[1]).toContain("name=Ciudad%20de%20M%C3%A9xico");
  });

  it("devuelve null cuando no hay resultados", async () => {
    stubFetch(() => Response.json({}));
    expect(await geocodeCity("Narnia")).toBeNull();
  });
});
