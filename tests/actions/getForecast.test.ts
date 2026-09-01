import { afterEach, beforeEach, beforeAll, describe, expect, it, setSystemTime } from "bun:test";
import { getForecast } from "../../src/actions/getForecast.ts";
import { makeForecast, makeMadrid, writeCitiesData, writeSettingsData } from "../helpers/fixtures.ts";
import { captureConsole, fetchUrls, restoreGlobals, stubFetch } from "../helpers/mocks.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeAll(() => {
  setSystemTime(new Date("2026-09-01T12:00:00Z"));
});

beforeEach(useTempCwd);
afterEach(() => {
  restoreCwd();
  restoreGlobals();
});

describe("getForecast", () => {
  it("avisa cuando no hay ciudad default configurada", async () => {
    const lines = captureConsole();
    await getForecast();
    expect(lines.join("\n")).toContain("No hay ciudad default configurada.");
    expect(fetchUrls()).toHaveLength(0);
  });

  it("muestra el pronóstico de 7 días de la ciudad default", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [] });
    await writeSettingsData({ unit: "celsius" });
    stubFetch(() => Response.json({ daily: makeForecast(), utc_offset_seconds: 0 }));
    const lines = captureConsole();
    await getForecast();
    const out = lines.join("\n");
    expect(out).toContain("📍 Madrid, Madrid, España");
    expect(out).toContain("Hoy: 30°C / 18°C");
    expect(out).toContain("Miércoles, 2 sept: 29°C / 17°C");
    expect(out).toContain("Tormenta");
    expect(fetchUrls()).toHaveLength(1);
    expect(fetchUrls()[0]).toContain("forecast_days=7");
    expect(fetchUrls()[0]).toContain("timezone=auto");
    expect(fetchUrls()[0]).toContain("temperature_unit=celsius");
  });

  it("avisa cuando falla la petición del pronóstico", async () => {
    await writeCitiesData({ defaultCity: makeMadrid(), cities: [] });
    stubFetch(() => new Response("boom", { status: 500 }));
    const lines = captureConsole();
    await getForecast();
    expect(lines.join("\n")).toContain("Error al obtener el pronóstico.");
  });
});
