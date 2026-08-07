// ── Capa de APIs de PanoramApp ─────────────────────────────────────────────
// Unifica las fuentes (Ticketmaster, Eventbrite, local) en un formato común:
// {
//   id, titulo, categoria, precio (bool), descripcion,
//   ubicacion, fecha (ISO), imagen, url, fuente
// }

function _fechaISO(t) {
  if (!t) return "";
  const d = new Date(t);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

function _parseCategoria(texto, genero) {
  const t = (texto || "").toLowerCase();
  const g = (genero || "").toLowerCase();
  if (t.includes("music") || t.includes("concert") || t.includes("música") || t.includes("concierto")) return "Música";
  if (t.includes("sport") || t.includes("deporte") || t.includes("fútbol") || t.includes("futbol")) return "Deporte";
  if (t.includes("film") || t.includes("cinem") || t.includes("cine")) return "Cine";
  if (t.includes("art") || t.includes("exhib") || t.includes("cultura") || t.includes("arte")) return "Cultura";
  if (t.includes("theatre") || t.includes("teatro")) return "Teatro";
  if (t.includes("food") || t.includes("gastronom") || t.includes("feria")) return "Gastronomía";
  if (t.includes("festival")) return "Festival";
  if (t.includes("family") || t.includes("familiar")) return "Familiar";
  return "Otro";
}

function _formatoTicketmaster(ev) {
  const venues = (ev._embedded && ev._embedded.venues && ev._embedded.venues[0]) || {};
  const precio = (ev.priceRanges && ev.priceRanges[0] && ev.priceRanges[0].min > 0) || false;
  return {
    id: "tm-" + (ev.id || Math.random().toString(36).slice(2, 9)),
    titulo: ev.name || "Evento",
    categoria: _parseCategoria((ev.classifications && ev.classifications[0] && ev.classifications[0].segment && ev.classifications[0].segment.name) || "", ""),
    precio,
    descripcion: (ev.classifications && ev.classifications[0] && ev.classifications[0].genre && ev.classifications[0].genre.name) || "",
    ubicacion: [venues.name, venues.city && venues.city.name].filter(Boolean).join(", "),
    fecha: _fechaISO(ev.dates && ev.dates.start && ev.dates.start.dateTime),
    imagen: (ev.images && ev.images.filter(i => i.ratio === "3_2")[0]?.url) || (ev.images && ev.images[0] && ev.images[0].url) || "",
    url: ev.url || "",
    fuente: "Ticketmaster",
  };
}

function _formatoEventbrite(ev) {
  const precio = !!(ev.is_free !== undefined ? !ev.is_free : ev.ticket_availability);
  return {
    id: "eb-" + (ev.id || Math.random().toString(36).slice(2, 9)),
    titulo: ev.name && ev.name.text || "Evento",
    categoria: _parseCategoria((ev.category && ev.category.name) || ev.subcategory && ev.subcategory.name, ""),
    precio,
    descripcion: ev.description && ev.description.text || "",
    ubicacion: (ev.venue && ev.venue.name) || ev.venue_id || "",
    fecha: _fechaISO(ev.start && ev.start.local || ev.start && ev.start.utc),
    imagen: (ev.logo && ev.logo.url) || "",
    url: ev.url || "",
    fuente: "Eventbrite",
  };
}

// ── Ticketmaster (CORS directo, API key gratuita) ───────────────────────────
async function fetchTicketmaster() {
  const cfg = CONFIG.ticketmaster;
  if (!cfg.apiKey) return [];
  const params = new URLSearchParams({
    apikey: cfg.apiKey,
    countryCode: CONFIG.pais,
    size: String(CONFIG.maxResultados),
    sort: "date,asc",
    includeTBA: "no",
    includeTest: "no",
  });
  const url = `${cfg.url}?${params.toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Ticketmaster ${resp.status}`);
  const data = await resp.json();
  return (data._embedded && data._embedded.events || []).map(_formatoTicketmaster);
}

// ── Eventbrite (requiere proxy CORS) ────────────────────────────────────────
async function fetchEventbrite() {
  const cfg = CONFIG.eventbrite;
  if (!cfg.token) return [];
  const params = new URLSearchParams({
    token: cfg.token,
    "location.address": CONFIG.ciudad,
    "location.within": "50km",
    "expand": "venue,logo",
    "page_size": "25",
  });
  const target = `${cfg.url}?${params.toString()}`;
  const resp = await fetch(cfg.proxy + encodeURIComponent(target));
  if (!resp.ok) throw new Error(`Eventbrite ${resp.status}`);
  const data = await resp.json();
  return (data.events || []).map(_formatoEventbrite);
}

// ── Datos locales (respaldo sin API key) ────────────────────────────────────
function _normalizar(texto) {
  return (texto || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ");
}

async function fetchLocal() {
  const resp = await fetch(CONFIG.panoramasUrl);
  if (!resp.ok) throw new Error(`Local ${resp.status}`);
  const data = await resp.json();
  const ciudadId = _normalizar(CONFIG.ciudadId);
  const ciudadRaiz = _normalizar(data.ciudad);
  // Si el JSON declara una ciudad raíz, los panoramas sin `ciudad` pertenecen a esa ciudad
  return (data.panoramas || [])
    .map(p => ({ ...p, fuente: "Local" }))
    .filter(p => {
      const pCiudad = _normalizar(p.ciudad || p.ubicacion || ciudadRaiz);
      return !ciudadId || !pCiudad || pCiudad.includes(ciudadId);
    });
}

// ── Orquestador: API → API → local ──────────────────────────────────────────
async function cargarPanoramas(ciudadRef) {
  // Puede recibir el id (string) o el objeto ciudad {id, nombre}
  const ciudad = (typeof ciudadRef === "object" && ciudadRef) ? ciudadRef : {};
  CONFIG.ciudadId = ciudad.id || CONFIG.ciudadId || "";
  CONFIG.ciudad = ciudad.nombre || CONFIG.ciudad || "";
  const errores = [];
  // Intentar APIs reales si hay keys configuradas
  if (CONFIG.ticketmaster.apiKey) {
    try {
      const tm = await fetchTicketmaster();
      if (tm.length) return tm;
      errores.push("Ticketmaster devolvió 0 eventos");
    } catch (e) {
      errores.push("Ticketmaster: " + e.message);
    }
  }
  if (CONFIG.eventbrite.token) {
    try {
      const eb = await fetchEventbrite();
      if (eb.length) return eb;
      errores.push("Eventbrite devolvió 0 eventos");
    } catch (e) {
      errores.push("Eventbrite: " + e.message);
    }
  }
  // Fallback local (siempre disponible)
  try {
    const local = await fetchLocal();
    if (local.length) {
      return { datos: local, aviso: errores.length ? errores.join("; ") : "" };
    }
    // Si la ciudad no tiene eventos propios, mostramos los de respaldo con un aviso
    const resp = await fetch(CONFIG.panoramasUrl);
    if (resp.ok) {
      const data = await resp.json();
      const todos = (data.panoramas || []).map(p => ({ ...p, fuente: "Local" }));
      if (todos.length) {
        return {
          datos: todos,
          aviso: "No hay panoramas locales para esta ciudad — mostrando ejemplos de respaldo.",
        };
      }
    }
  } catch (e) {
    errores.push("Local: " + e.message);
  }
  throw new Error("No se pudo cargar panoramas: " + errores.join(" | "));
}