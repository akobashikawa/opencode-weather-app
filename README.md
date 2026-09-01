## Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad. Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.

## Stack

- Bun.js
- OpenMeteo

## Estructura

```bash
src/
├── actions/                # Acciones principales que puede ejecutar el usuario
│   ├── getWeather.ts       # Clima actual (ciudad default y todas las ciudades)
│   ├── getForecast.ts      # Pronóstico de 7 días
│   ├── addCity.ts          # Agregar una ciudad a la lista
│   ├── removeCity.ts       # Eliminar una ciudad
│   ├── setDefaultCity.ts   # Establecer la ciudad por defecto
│   ├── listCities.ts       # Listado y selección de ciudades (helper compartido)
│   └── toggleUnit.ts       # Alternar °C/°F
├── presentation/           # Interacción de consola/CLI
│   ├── menu.ts             # Renderizado del menú y selección de opciones
│   ├── output.ts           # Mensajes hacia el usuario
│   └── input.ts            # Captura y validación de inputs
├── storage/                # Lectura/escritura de datos locales
│   ├── citiesStorage.ts    # Persistencia de ciudades (weather-cities.json)
│   └── settingsStorage.ts  # Persistencia de ajustes (weather-settings.json)
├── types/                  # Tipos y contratos TypeScript globales
│   ├── City.ts             # Tipo City
│   ├── Weather.ts          # Unit, CurrentWeather, DailyForecast
│   ├── MenuOption.ts       # MenuKey, MenuContext, MenuOption
│   └── Config.ts           # CitiesData, Settings y defaults
├── api/                    # Integración con APIs externas (Open-Meteo)
│   ├── geocoding.ts        # Coordenadas de una ciudad
│   └── weather.ts          # Clima actual y pronóstico
├── utils/                  # Utilidades reutilizables
│   ├── colors.ts           # Colores ANSI para la consola
│   ├── constants.ts        # URLs, etiquetas de unidad, códigos WMO, archivos
│   └── format.ts           # Formateadores (ubicaciones, temperaturas, fechas)
└── index.ts                # Punto de entrada (loop del menú y dispatch)
```

## Comandos

```bash
bun install          # instalar dependencias
bun src/index.ts     # ejecutar la app
bun run dev          # ejecutar con --watch
bun run build        # generar binario en dist/weather
bun run typecheck    # verificación de tipos (modo estricto)
```

## Versionado y releases

La versión se define en el campo `version` de `package.json`. Al hacer push a `master`, el workflow de GitHub Actions (`.github/workflows/release.yml`):

1. Comprueba si ya existe el tag `v<versión>`; si existe, se omite el release (idempotente).
2. Compila el binario en linux x64, macOS (arm64) y Windows x64 mediante `bun run build` (que antes ejecuta typecheck y tests).
3. Crea el tag `v<versión>` y un release en GitHub con los binarios adjuntos: `weather-linux-x64`, `weather-macos-arm64`, `weather-windows-x64.exe`.

Para publicar una nueva versión: subir el campo `version` en `package.json` y hacer push a `master`.

## Datos locales

Al ejecutarse, la app crea en la raíz del proyecto:

- `weather-cities.json`: ciudad por defecto y lista de ciudades.
- `weather-settings.json`: preferencias (unidad de temperatura).

Si existe un `weather-config.json` de versiones anteriores, sus datos se migran automáticamente a los dos archivos anteriores en el primer arranque. Los archivos reales están en `.gitignore`; los samples (`weather-cities-sample.json` y `weather-settings-sample.json`) son los que se versionan.

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m
```

## Inicializar proyecto

```bash
bun init
```

### Ejemplo del menú
Esta es la apariencia que deseamos crear

```bash
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (3)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días (default)
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción: 5
```
