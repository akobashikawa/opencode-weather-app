# Revisión Weather CLI

- [x] **Colores:** cyan (menú), amarillo (prompts y temp), verde (ok), rojo (error).
  - Implementación: `src/colors.ts` — helpers ANSI (`cyan`, `yellow`, `green`, `red`) que envuelven el texto con `\x1b[NNm…\x1b[0m`, sin dependencias.
  - Guard: colores desactivados si `NO_COLOR` está definido o stdout no es TTY (`process.stdout.isTTY`) — evita códigos basura al redirigir la salida.
  - Aplicación: `src/ui.ts` (menú cyan, `printWeather` con 📍 verde + 🌡 amarillo, `printCityList` verde/rojo) e `index.ts` (5 prompts amarillos, éxitos verdes, errores y bloqueos rojos).
- [x] **AGENTS.md:** actualizado a la app real — estructura de `src/`, comandos (`run`/`dev`/`build`/`typecheck`), convenciones de config de runtime y colores.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [ ] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?
- [ ] **7 days:** Agregar la posibilidad de obtener el pronóstico del clima para los próximos 7 días