import { printError } from "./output.ts";
import { yellow } from "../utils/colors.ts";

export function promptText(message: string): string | null {
  return prompt(yellow(message));
}

export function promptNumber(message: string, min: number, max: number): number | null {
  const value = prompt(yellow(message));
  if (!value) return null;
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    printError("Opción inválida.");
    return null;
  }
  return num;
}

export function promptConfirm(message: string): boolean {
  const value = prompt(yellow(message));
  return value?.toLowerCase() === "s";
}
