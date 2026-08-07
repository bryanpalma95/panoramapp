// ── Configuración de PanoramApp (Guía de ciudades de Chile) ─────────────────
// Datos de ciudades: cada ciudad tiene turismo, transporte y emergencia.
const CONFIG = {
  ciudadesUrl: "datos/ciudades.json",
  climaUrl: "datos/clima.json",
  feriadosUrl: "datos/feriados.json",
  // Datos de panoramas/eventos (opcional, sección extra)
  panoramasUrl: "datos/panoramas.json",
  ticketmaster: {
    apiKey: "", // "TU_TICKETMASTER_API_KEY"
    url: "https://app.ticketmaster.com/discovery/v2/events.json",
  },
  eventbrite: {
    token: "", // "TU_EVENTBRITE_TOKEN"
    proxy: "https://corsproxy.io/?url=",
    url: "https://www.eventbriteapi.com/v3/events/search/",
  },
  pais: "CL",
  maxResultados: 50,
  // Ciudad por defecto si no se encuentra en localStorage
  ciudadDefecto: "santiago",
};