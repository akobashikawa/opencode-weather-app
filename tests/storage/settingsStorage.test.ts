import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { loadSettings, saveSettings } from "../../src/storage/settingsStorage.ts";
import { readSettingsData, writeLegacyConfig, writeSettingsData } from "../helpers/fixtures.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeEach(useTempCwd);
afterEach(restoreCwd);

describe("loadSettings", () => {
  it("devuelve celsius por defecto cuando no hay archivos", async () => {
    expect(await loadSettings()).toEqual({ unit: "celsius" });
  });

  it("lee la unidad del archivo cuando existe", async () => {
    await writeSettingsData({ unit: "fahrenheit" });
    expect(await loadSettings()).toEqual({ unit: "fahrenheit" });
  });

  it("aplica el default cuando el archivo no tiene unit", async () => {
    await Bun.write("weather-settings.json", JSON.stringify({}));
    expect(await loadSettings()).toEqual({ unit: "celsius" });
  });
});

describe("migración desde weather-config.json", () => {
  it("migra la unidad del legacy y persiste weather-settings.json", async () => {
    await writeLegacyConfig({ unit: "fahrenheit" });
    expect(await loadSettings()).toEqual({ unit: "fahrenheit" });
    expect(await Bun.file("weather-settings.json").exists()).toBe(true);
    expect(await readSettingsData()).toEqual({ unit: "fahrenheit" });
  });

  it("aplica el default cuando el legacy no tiene unit", async () => {
    await writeLegacyConfig({});
    expect(await loadSettings()).toEqual({ unit: "celsius" });
    expect(await Bun.file("weather-settings.json").exists()).toBe(true);
  });

  it("ignora el legacy cuando ya existe weather-settings.json", async () => {
    await writeLegacyConfig({ unit: "fahrenheit" });
    await writeSettingsData({ unit: "celsius" });
    expect(await loadSettings()).toEqual({ unit: "celsius" });
  });
});

describe("saveSettings", () => {
  it("guarda y recupera la unidad (roundtrip)", async () => {
    saveSettings({ unit: "fahrenheit" });
    expect(await loadSettings()).toEqual({ unit: "fahrenheit" });
  });
});
