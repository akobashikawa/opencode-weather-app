import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { Colors } from "../helpers/colors.ts";

const originalNoColor = process.env.NO_COLOR;
const originalIsTTY = process.stdout.isTTY;

async function importColors(query: string): Promise<Colors> {
  return (await import(`../../src/utils/colors.ts?${query}`)) as Colors;
}

function setIsTTY(value: boolean): void {
  Object.defineProperty(process.stdout, "isTTY", { value, configurable: true });
}

function restoreEnv(): void {
  if (originalNoColor === undefined) delete process.env.NO_COLOR;
  else process.env.NO_COLOR = originalNoColor;
  setIsTTY(originalIsTTY === true);
}

describe("colors", () => {
  beforeAll(() => {
    setIsTTY(true);
  });

  afterAll(restoreEnv);

  it("desactiva los colores cuando NO_COLOR está definido aunque haya TTY", async () => {
    process.env.NO_COLOR = "1";
    const colors = await importColors("no-color");
    expect(colors.cyan("hola")).toBe("hola");
    expect(colors.yellow("hola")).toBe("hola");
    expect(colors.green("hola")).toBe("hola");
    expect(colors.red("hola")).toBe("hola");
  });

  it("desactiva los colores cuando no hay TTY", async () => {
    delete process.env.NO_COLOR;
    setIsTTY(false);
    const colors = await importColors("sin-tty");
    expect(colors.cyan("hola")).toBe("hola");
    expect(colors.red("hola")).toBe("hola");
    setIsTTY(true);
  });

  it("envuelve el texto con el código ANSI correcto cuando hay TTY", async () => {
    delete process.env.NO_COLOR;
    setIsTTY(true);
    const colors = await importColors("con-tty");
    expect(colors.cyan("hola")).toBe("\x1b[36mhola\x1b[0m");
    expect(colors.yellow("hola")).toBe("\x1b[33mhola\x1b[0m");
    expect(colors.green("hola")).toBe("\x1b[32mhola\x1b[0m");
    expect(colors.red("hola")).toBe("\x1b[31mhola\x1b[0m");
  });
});
