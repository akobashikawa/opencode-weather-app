import type { MenuContext, MenuOption } from "../types/MenuOption.ts";
import { cyan } from "../utils/colors.ts";
import { UNIT_LABEL } from "../utils/constants.ts";
import { promptText } from "./input.ts";

const LINE = "════════════════════════════════════════";

const MENU_OPTIONS: MenuOption[] = [
  { key: "1", label: () => "Clima de ciudad default" },
  { key: "2", label: (ctx) => `Clima de todas las ciudades (${ctx.cityCount})` },
  { key: "3", label: () => "Buscar y agregar ciudad" },
  { key: "4", label: () => "Eliminar ciudad" },
  { key: "5", label: () => "Establecer ciudad default" },
  { key: "6", label: () => "Pronóstico 7 días (default)" },
  { key: "8", label: (ctx) => `Ajustes (${UNIT_LABEL[ctx.unit]})` },
  { key: "9", label: () => "Salir" },
];

function renderMenu(ctx: MenuContext): void {
  console.log(cyan(LINE));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(LINE));
  for (const option of MENU_OPTIONS) {
    console.log(cyan(`  ${option.key}. ${option.label(ctx)}`));
  }
  console.log(cyan(LINE));
}

export function showMenu(ctx: MenuContext): string | null {
  renderMenu(ctx);
  return promptText("  Selecciona una opción:");
}
