import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { toggleUnit } from "../../src/actions/toggleUnit.ts";
import { readSettingsData, writeSettingsData } from "../helpers/fixtures.ts";
import { captureConsole, restoreGlobals } from "../helpers/mocks.ts";
import { restoreCwd, useTempCwd } from "../helpers/tmpCwd.ts";

beforeEach(useTempCwd);
afterEach(() => {
  restoreCwd();
  restoreGlobals();
});

describe("toggleUnit", () => {
  it("cambia de celsius a fahrenheit y persiste", async () => {
    await writeSettingsData({ unit: "celsius" });
    const lines = captureConsole();
    await toggleUnit();
    expect(lines.join("\n")).toContain("Unidad: °F");
    expect(await readSettingsData()).toEqual({ unit: "fahrenheit" });
  });

  it("cambia de fahrenheit a celsius y persiste", async () => {
    await writeSettingsData({ unit: "fahrenheit" });
    const lines = captureConsole();
    await toggleUnit();
    expect(lines.join("\n")).toContain("Unidad: °C");
    expect(await readSettingsData()).toEqual({ unit: "celsius" });
  });

  it("parte del default celsius cuando no hay archivo de ajustes", async () => {
    const lines = captureConsole();
    await toggleUnit();
    expect(lines.join("\n")).toContain("Unidad: °F");
    expect(await readSettingsData()).toEqual({ unit: "fahrenheit" });
  });
});
