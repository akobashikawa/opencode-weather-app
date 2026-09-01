import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CitiesData, Settings } from "../../src/types/Config.ts";
import { makeLima, makeMadrid } from "../helpers/fixtures.ts";

const CLI_PATH = join(import.meta.dir, "..", "..", "src", "index.ts");

let tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "weather-cli-"));
  tempDirs.push(dir);
  return dir;
}

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
  tempDirs = [];
});

async function runCli(input: string, cwd: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn({
    cmd: [process.execPath, CLI_PATH],
    cwd,
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, NO_COLOR: "1" },
  });
  proc.stdin.write(input);
  proc.stdin.end();
  const [exitCode, stdout, stderr] = await Promise.all([proc.exited, new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
  return { exitCode, stdout, stderr };
}

describe("CLI end-to-end", () => {
  it("muestra el menú y termina con la opción 9", async () => {
    const cwd = makeTempDir();
    const { exitCode, stdout } = await runCli("9\n", cwd);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("WEATHER CLI");
    expect(stdout).toContain("1. Clima de ciudad default");
    expect(stdout).toContain("9. Salir");
    expect(stdout).toContain("¡Hasta luego!");
  });

  it("muestra el contador de ciudades del archivo de datos", async () => {
    const cwd = makeTempDir();
    const data: CitiesData = { defaultCity: makeMadrid(), cities: [makeLima()] };
    await Bun.write(join(cwd, "weather-cities.json"), JSON.stringify(data, null, 2));
    const { stdout } = await runCli("9\n", cwd);
    expect(stdout).toContain("Clima de todas las ciudades (2)");
  });

  it("rechaza una opción inválida y sigue funcionando", async () => {
    const cwd = makeTempDir();
    const { exitCode, stdout } = await runCli("7\n9\n", cwd);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Opción inválida.");
    expect(stdout).toContain("¡Hasta luego!");
  });

  it("la opción 1 sin ciudad default avisa el error sin salir", async () => {
    const cwd = makeTempDir();
    const { exitCode, stdout } = await runCli("1\n9\n", cwd);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("No hay ciudad default configurada.");
  });

  it("la opción 8 alterna la unidad y la persiste en disco", async () => {
    const cwd = makeTempDir();
    const settings: Settings = { unit: "celsius" };
    await Bun.write(join(cwd, "weather-settings.json"), JSON.stringify(settings, null, 2));
    const { exitCode, stdout } = await runCli("8\n9\n", cwd);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Unidad: °F");
    const persisted = JSON.parse(await Bun.file(join(cwd, "weather-settings.json")).text()) as Settings;
    expect(persisted).toEqual({ unit: "fahrenheit" });
  });

  it("muestra la unidad actual en el menú de ajustes", async () => {
    const cwd = makeTempDir();
    const settings: Settings = { unit: "fahrenheit" };
    await Bun.write(join(cwd, "weather-settings.json"), JSON.stringify(settings, null, 2));
    const { stdout } = await runCli("9\n", cwd);
    expect(stdout).toContain("Ajustes (°F)");
  });
});
