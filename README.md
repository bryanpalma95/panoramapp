# PanoramApp 🎉

**Guía urbana de Chile** — turismo, transporte, emergencia y panoramas en un solo lugar.

## Qué es

Aplicación web estática para explorar información útil de las principales ciudades de Chile. Permite cambiar de ciudad con un selector y navegar por secciones: turismo, transporte, emergencia, clima, feriados, panoramas y servicios.

## Características

- Selector de ciudad con datos offline (JSON local)
- **7 secciones por ciudad:** Turismo · Transporte · Emergencia · Clima · Feriados · Panoramas · Servicios
- Detección de ubicación por geolocalización del navegador (`📡`)
- Tema claro/oscuro con toggle
- Modal de detalle por panorama/servicio
- Integración opcional con **Ticketmaster** y **Eventbrite** (eventos en vivo)
- Generador de datos de ciudades vía script Python (`generar_datos.py`)

## Stack

- HTML / CSS / JS vanilla (sin frameworks ni build)
- Datos en archivos JSON locales (`datos/`)
- Python para generación de datos

## Estructura

```
panoramapp/
├── index.html
├── css/styles.css
├── js/
│   ├── config.js          # URLs de datos y API keys opcionales
│   ├── apis.js            # Llamadas a Ticketmaster / Eventbrite
│   ├── servicios-data.js  # Datos estáticos de servicios
│   └── app.js             # Lógica principal y renderizado
├── datos/
│   ├── ciudades.json      # Turismo, transporte y emergencia por ciudad
│   ├── clima.json
│   ├── feriados.json
│   └── panoramas.json
└── generar_datos.py       # Script para regenerar/extender los JSON
```

## Cómo ejecutar

Al usar `fetch()` para cargar los JSON, necesitas un servidor local:

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

## APIs opcionales

Para mostrar eventos en tiempo real, agrega tus keys en `js/config.js`:

```js
ticketmaster: { apiKey: "TU_KEY" }
eventbrite:   { token: "TU_TOKEN" }
```

Sin keys, la app funciona completamente con los datos locales.
