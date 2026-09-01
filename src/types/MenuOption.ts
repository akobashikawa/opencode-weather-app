import type { Unit } from "./Weather.ts";

export type MenuKey = "1" | "2" | "3" | "4" | "5" | "6" | "8" | "9";

export interface MenuContext {
  cityCount: number;
  unit: Unit;
}

export interface MenuOption {
  key: MenuKey;
  label: (ctx: MenuContext) => string;
}
