import { afterEach, describe, expect, it } from "bun:test";
import { promptConfirm, promptNumber, promptText } from "../../src/presentation/input.ts";
import { captureConsole, promptCalls, restoreGlobals, stubPrompt } from "../helpers/mocks.ts";

afterEach(restoreGlobals);

describe("promptText", () => {
  it("devuelve el valor introducido y pasa el mensaje al prompt", () => {
    stubPrompt("Madrid");
    expect(promptText("  Nombre de la ciudad:")).toBe("Madrid");
    expect(promptCalls()[0]).toContain("Nombre de la ciudad:");
  });

  it("devuelve null cuando el prompt no entrega valor", () => {
    stubPrompt();
    expect(promptText("  Nombre:")).toBeNull();
  });

  it("devuelve la cadena vacía tal cual (los actions la tratan como cancelación)", () => {
    stubPrompt("");
    expect(promptText("  Nombre:")).toBe("");
  });
});

describe("promptNumber", () => {
  it("devuelve el número cuando está dentro del rango", () => {
    stubPrompt("3");
    expect(promptNumber("  Número:", 1, 5)).toBe(3);
  });

  it("acepta los límites del rango", () => {
    stubPrompt("1", "5");
    expect(promptNumber("  Número:", 1, 5)).toBe(1);
    expect(promptNumber("  Número:", 1, 5)).toBe(5);
  });

  it("devuelve null con entrada vacía sin mensaje de error", () => {
    const lines = captureConsole();
    stubPrompt("");
    expect(promptNumber("  Número:", 1, 5)).toBeNull();
    expect(lines.join("\n")).not.toContain("Opción inválida.");
  });

  it("devuelve null e imprime error con entrada no numérica", () => {
    const lines = captureConsole();
    stubPrompt("abc");
    expect(promptNumber("  Número:", 1, 5)).toBeNull();
    expect(lines.join("\n")).toContain("Opción inválida.");
  });

  it("devuelve null e imprime error fuera de rango", () => {
    const lines = captureConsole();
    stubPrompt("0", "6");
    expect(promptNumber("  Número:", 1, 5)).toBeNull();
    expect(promptNumber("  Número:", 1, 5)).toBeNull();
    expect(lines.filter((line) => line.includes("Opción inválida."))).toHaveLength(2);
  });
});

describe("promptConfirm", () => {
  it("acepta con s y con S", () => {
    stubPrompt("s", "S");
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(true);
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(true);
  });

  it("rechaza con n, otras respuestas o entrada vacía", () => {
    stubPrompt("n", "no", "x", "");
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(false);
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(false);
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(false);
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(false);
  });

  it("rechaza cuando el prompt no entrega valor", () => {
    stubPrompt();
    expect(promptConfirm("  ¿Agregar? (s/n):")).toBe(false);
  });
});
