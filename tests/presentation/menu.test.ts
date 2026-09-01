import { afterEach, describe, expect, it } from "bun:test";
import { showMenu } from "../../src/presentation/menu.ts";
import { captureConsole, promptCalls, restoreGlobals, stubPrompt } from "../helpers/mocks.ts";

afterEach(restoreGlobals);

describe("showMenu", () => {
  it("renderiza el menú con las 8 opciones y devuelve la elección", () => {
    const lines = captureConsole();
    stubPrompt("9");
    expect(showMenu({ cityCount: 2, unit: "celsius" })).toBe("9");
    expect(lines).toHaveLength(12);
    const out = lines.join("\n");
    expect(out).toContain("WEATHER CLI");
    expect(out).toContain("1. Clima de ciudad default");
    expect(out).toContain("Clima de todas las ciudades (2)");
    expect(out).toContain("3. Buscar y agregar ciudad");
    expect(out).toContain("4. Eliminar ciudad");
    expect(out).toContain("5. Establecer ciudad default");
    expect(out).toContain("6. Pronóstico 7 días (default)");
    expect(out).toContain("Ajustes (°C)");
    expect(out).toContain("9. Salir");
    expect(out).not.toContain("7. ");
  });

  it("muestra el contador de ciudades y la unidad dinámicos", () => {
    const lines = captureConsole();
    stubPrompt("9");
    showMenu({ cityCount: 0, unit: "fahrenheit" });
    const out = lines.join("\n");
    expect(out).toContain("Clima de todas las ciudades (0)");
    expect(out).toContain("Ajustes (°F)");
  });

  it("pregunta la opción al usuario", () => {
    captureConsole();
    stubPrompt("1");
    showMenu({ cityCount: 0, unit: "celsius" });
    expect(promptCalls()[0]).toContain("Selecciona una opción:");
  });

  it("devuelve null cuando el prompt no entrega valor", () => {
    captureConsole();
    stubPrompt();
    expect(showMenu({ cityCount: 0, unit: "celsius" })).toBeNull();
  });
});
