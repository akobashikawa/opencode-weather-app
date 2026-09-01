import { afterEach, describe, expect, it } from "bun:test";
import { fetchForecast, fetchWeather } from "../../src/api/weather.ts";
import { fetchUrls, restoreGlobals, stubFetch } from "../helpers/mocks.ts";
import { makeCity, makeForecast, makeWeather } from "../helpers/fixtures.ts";

afterEach(restoreGlobals);

describe("fetchWeather", () => {
  it("pide el clima actual en celsius y devuelve data.current", async () => {
    stubFetch(() => Response.json({ current: makeWeather() }));
    const weather = await fetchWeather(makeCity(), "celsius");
    expect(weather).toEqual(makeWeather());
    expect(fetchUrls()[0]).toBe(
      "https://api.open-meteo.com/v1/forecast?latitude=40.4165&longitude=-3.7026&current=temperature_2m&temperature_unit=celsius",
    );
  });

  it("pide el clima actual en fahrenheit", async () => {
    stubFetch(() => Response.json({ current: makeWeather({ temperature_2m: 68.2 }) }));
    await fetchWeather(makeCity(), "fahrenheit");
    expect(fetchUrls()[0]).toContain("temperature_unit=fahrenheit");
  });

  it("devuelve null cuando la respuesta no es ok", async () => {
    stubFetch(() => new Response("boom", { status: 500 }));
    expect(await fetchWeather(makeCity(), "celsius")).toBeNull();
  });
});

describe("fetchForecast", () => {
  it("pide el pronóstico de 7 días y devuelve daily con utc_offset_seconds", async () => {
    const forecast = makeForecast();
    stubFetch(() => Response.json({ daily: forecast, utc_offset_seconds: 7200 }));
    const result = await fetchForecast(makeCity(), "fahrenheit");
    expect(result).toEqual({ ...forecast, utc_offset_seconds: 7200 });
    expect(fetchUrls()[0]).toBe(
      "https://api.open-meteo.com/v1/forecast?latitude=40.4165&longitude=-3.7026" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto" +
        "&temperature_unit=fahrenheit",
    );
  });

  it("pide el pronóstico en celsius", async () => {
    stubFetch(() => Response.json({ daily: makeForecast(), utc_offset_seconds: 0 }));
    await fetchForecast(makeCity(), "celsius");
    expect(fetchUrls()[0]).toContain("temperature_unit=celsius");
  });

  it("devuelve null cuando la respuesta no es ok", async () => {
    stubFetch(() => new Response("boom", { status: 503 }));
    expect(await fetchForecast(makeCity(), "celsius")).toBeNull();
  });
});
