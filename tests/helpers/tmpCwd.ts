import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const originalCwd = process.cwd();
let tempDir: string | null = null;

export function useTempCwd(): void {
  tempDir = mkdtempSync(join(tmpdir(), "weather-test-"));
  process.chdir(tempDir);
}

export function restoreCwd(): void {
  process.chdir(originalCwd);
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
}

export function currentTempDir(): string {
  if (!tempDir) throw new Error("useTempCwd() no fue llamado");
  return tempDir;
}
