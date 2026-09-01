import { describe, expect, it } from "bun:test";
import {
  CITIES_FILE,
  FORECAST_URL,
  GEOCODE_URL,
  LEGACY_CONFIG_FILE,
  SETTINGS_FILE,
  UNIT_LABEL,
  WMO_CODES,
} from "../../src/utils/constants.ts";

describe("constantes de archivos y URLs", () => {
  it("usa los nombres de archivo de runtime y legacy esperados", () => {
    expect(CITIES_FILE).toBe("weather-cities.json");
    expect(SETTINGS_FILE).toBe("weather-settings.json");
    expect(LEGACY_CONFIG_FILE).toBe("weather-config.json");
  });

  it("apunta a las APIs de Open-Meteo", () => {
    expect(GEOCODE_URL).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(FORECAST_URL).toBe("https://api.open-meteo.com/v1/forecast");
  });
});

describe("UNIT_LABEL", () => {
  it("etiqueta cada unidad", () => {
    expect(UNIT_LABEL.celsius).toBe("°C");
    expect(UNIT_LABEL.fahrenheit).toBe("°F");
  });
});

describe("WMO_CODES", () => {
  it("describe códigos conocidos", () => {
    expect(WMO_CODES[0]).toContain("Cielo claro");
    expect(WMO_CODES[61]).toContain("Lluvia ligera");
    expect(WMO_CODES[95]).toContain("Tormenta");
  });

  it("cubre el set completo de códigos WMO usados por la app", () => {
    expect(Object.keys(WMO_CODES).length).toBe(28);
  });
});
