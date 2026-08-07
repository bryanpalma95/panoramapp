
// ── PanoramApp — Guía de ciudades de Chile ─────────────────────────────────
(() => {
  "use strict";

  // Estado
  const estado = {
    ciudades: [],
    ciudadActual: null,
    seccion: "turismo",
    panoramas: [],
    clima: null,
    feriados: [],
    filtroCategoria: "Todas",
    filtroGratis: false,
    busqueda: "",
    orden: "fecha",
    avisoFuente: "",
  };

  const LS_CIUDAD = "panoramapp_ciudad";
  const LS_SECCION = "panoramapp_seccion";
  const LS_FAVORITOS = "panoramapp_favoritos";
  const LS_TEMA = "panoramapp_tema";

  // ── Utilidades de DOM ────────────────────────────────────────────────────
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  // ── Inicialización ───────────────────────────────────────────────────────
  async function iniciar() {
    if ((localStorage.getItem(LS_TEMA) || "claro") === "oscuro") {
      document.body.classList.add("oscuro");
    }

    try {
      const resp = await fetch(CONFIG.ciudadesUrl);
      if (!resp.ok) throw new Error("No se pudo cargar ciudades (" + resp.status + ")");
      const data = await resp.json();
      estado.ciudades = data.ciudades || [];

      if (!estado.ciudades.length) {
        mostrarMensaje("No hay ciudades disponibles 🙁", true);
        return;
      }

      const ciudadGuardada = localStorage.getItem(LS_CIUDAD);
      const ciudadId = estado.ciudades.some(c => c.id === ciudadGuardada) ? ciudadGuardada : CONFIG.ciudadDefecto;
      cambiarCiudad(ciudadId);

      const seccionGuardada = localStorage.getItem(LS_SECCION);
      if (["turismo", "transporte", "emergencia", "clima", "feriados", "panoramas", "servicios"].includes(seccionGuardada)) {
        cambiarSeccion(seccionGuardada);
      }

      // Cargar clima y feriados en paralelo (no bloquean la app)
      cargarClima();
      cargarFeriados();

      llenarSelectorCiudades();
      configurarControles();
    } catch (e) {
      console.error(e);
      mostrarMensaje("Error: " + e.message, true);
    } finally {
      ocultarCargando();
    }
  }

  // ── Cambio de ciudad ─────────────────────────────────────────────────────
  function cambiarCiudad(id) {
    const ciudad = estado.ciudades.find(c => c.id === id);
    if (!ciudad) return;
    estado.ciudadActual = ciudad;
    localStorage.setItem(LS_CIUDAD, id);

    const sel = $("#selector-ciudad");
    if (sel) sel.value = id;

    estado.panoramas = [];
    estado.avisoFuente = "";

    cambiarSeccion(estado.seccion, false);
    renderizarCiudad();
  }

  // ── Selector de ciudades ─────────────────────────────────────────────────
  function llenarSelectorCiudades() {
    const sel = $("#selector-ciudad");
    if (!sel) return;
    sel.innerHTML = estado.ciudades.map(c =>
      `<option value="${c.id}">${c.nombre} — ${c.region}</option>`
    ).join("");
    sel.value = estado.ciudadActual ? estado.ciudadActual.id : CONFIG.ciudadDefecto;
    sel.addEventListener("change", () => cambiarCiudad(sel.value));
  }

  // ── Secciones ────────────────────────────────────────────────────────────
  function cambiarSeccion(seccion, guardar = true) {
    estado.seccion = seccion;
    if (guardar) localStorage.setItem(LS_SECCION, seccion);

    $$(".tab-btn").forEach(b => {
      b.classList.toggle("activo", b.dataset.seccion === seccion);
    });

    if (seccion === "panoramas" && !estado.panoramas.length) {
      cargarPanoramasCiudad();
      return;
    }

    renderizarContenido();
  }

  // ── Render de ciudad ─────────────────────────────────────────────────────
  function renderizarCiudad() {
    const c = estado.ciudadActual;
    if (!c) return;

    const header = $("#ciudad-header");
    if (header) {
      header.innerHTML = `
        <h2>📍 ${c.nombre}</h2>
        <span class="region-badge">${c.region}</span>
        <p class="ciudad-descripcion">${c.descripcion}</p>
      `;
    }

    renderizarContenido();
  }

  function renderizarContenido() {
    const c = estado.ciudadActual;
    const seccion = $("#seccion-contenido");
    if (!c || !seccion) return;

    switch (estado.seccion) {
      case "turismo":
        seccion.innerHTML = renderTurismo(c);
        break;
      case "transporte":
        seccion.innerHTML = renderTransporte(c);
        break;
      case "emergencia":
        seccion.innerHTML = renderEmergencia(c);
        break;
      case "clima":
        renderizarClima();
        break;
      case "feriados":
        renderizarFeriados();
        break;
      case "panoramas":
        renderizarPanoramas();
        break;
      case "servicios":
        renderizarServicios();
        break;
      default:
        seccion.innerHTML = "";
    }
  }

  // ── Clima ─────────────────────────────────────────────────────────────────
  async function cargarClima() {
    try {
      const resp = await fetch(CONFIG.climaUrl);
      if (!resp.ok) throw new Error("Clima " + resp.status);
      const data = await resp.json();
      estado.clima = data;
      if (estado.seccion === "clima") renderizarClima();
    } catch (e) {
      console.error("Error cargando clima:", e);
      estado.clima = null;
    }
  }

  function renderizarClima() {
    const seccion = $("#seccion-contenido");
    if (!seccion) return;
    const c = estado.ciudadActual;

    if (!estado.clima) {
      seccion.innerHTML = `<div class="vacio"><p>🌤️ Clima no disponible en este momento.</p></div>`;
      return;
    }

    const dias = (estado.clima.ciudades && estado.clima.ciudades[c.id] && estado.clima.ciudades[c.id].daily) || null;
    if (!dias || !dias.time || !dias.time.length) {
      seccion.innerHTML = `<div class="vacio"><p>🌤️ No hay pronóstico para ${c.nombre}.</p></div>`;
      return;
    }

    const CODES = {
      0: "☀️ Despejado", 1: "🌤️ Mayormente despejado", 2: "⛅ Parcialmente nublado", 3: "☁️ Nublado",
      45: "🌫️ Niebla", 48: "🌫️ Niebla helada", 51: "🌦️ Lluvia ligera", 53: "🌦️ Lluvia moderada",
      55: "🌧️ Lluvia fuerte", 61: "🌧️ Lluvia ligera", 63: "🌧️ Lluvia moderada", 65: "🌧️ Lluvia intensa",
      71: "🌨️ Nieve ligera", 73: "🌨️ Nieve moderada", 75: "❄️ Nieve intensa", 80: "🌦️ Chubascos",
      81: "🌧️ Chubascos moderados", 82: "🌧️ Chubascos violentos", 95: "⛈️ Tormenta", 96: "⛈️ Tormenta con granizo",
      99: "⛈️ Tormenta fuerte",
    };
    const nombreDia = (fechaISO) => {
      const d = new Date(fechaISO + "T12:00:00-04:00");
      if (isNaN(d.getTime())) return "";
      return new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" }).format(d);
    };

    seccion.innerHTML = `
      <div class="seccion-titulo">
        <h3>🌤️ Pronóstico para ${c.nombre}</h3>
        <p>Próximos 5 días · Fuente: ${estado.clima.fuente || "Open-Meteo"}</p>
      </div>
      <div class="clima-grid">
        ${dias.time.map((fecha, i) => {
          const codigo = dias.weather_code[i];
          const tMax = Math.round(dias.temperature_2m_max[i]);
          const tMin = Math.round(dias.temperature_2m_min[i]);
          const prob = dias.precipitation_probability_max[i] ?? 0;
          const esHoy = i === 0;
          return `
            <article class="clima-card ${esHoy ? "hoy" : ""}">
              <div class="clima-dia">${esHoy ? "Hoy" : nombreDia(fecha).split(",")[0]}</div>
              <div class="clima-fecha">${nombreDia(fecha).split(",")[1] || ""}</div>
              <div class="clima-icono">${CODES[codigo] || "🌡️"}</div>
              <div class="clima-temps"><span class="max">${tMax}°</span> / <span class="min">${tMin}°</span></div>
              <div class="clima-lluvia">🌧️ ${prob}%</div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  // ── Feriados ──────────────────────────────────────────────────────────────
  async function cargarFeriados() {
    try {
      const resp = await fetch(CONFIG.feriadosUrl);
      if (!resp.ok) throw new Error("Feriados " + resp.status);
      const data = await resp.json();
      estado.feriados = data.feriados || [];
      if (estado.seccion === "feriados") renderizarFeriados();
    } catch (e) {
      console.error("Error cargando feriados:", e);
      estado.feriados = [];
    }
  }

  function renderizarFeriados() {
    const seccion = $("#seccion-contenido");
    if (!seccion) return;
    const c = estado.ciudadActual;

    if (!estado.feriados.length) {
      seccion.innerHTML = `<div class="vacio"><p>📅 No hay feriados disponibles.</p></div>`;
      return;
    }

    const hoy = new Date();
    const proximos = estado.feriados
      .map(f => ({ ...f, fechaObj: new Date(f.fecha + "T12:00:00-04:00") }))
      .filter(f => !isNaN(f.fechaObj.getTime()))
      .sort((a, b) => a.fechaObj - b.fechaObj);

    const formatear = (d) => {
      return new Intl.DateTimeFormat("es-CL", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }).format(d);
    };

    const esFuturo = (d) => d >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    seccion.innerHTML = `
      <div class="seccion-titulo">
        <h3>📅 Feriados en Chile</h3>
        <p>Calendario oficial · Fuente: ${estado.feriados.length ? "apis.digital.gob.cl" : ""}</p>
      </div>
      <div class="feriados-lista">
        ${proximos.map(f => `
          <article class="feriado-card">
            <div class="feriado-fecha-mes">${new Intl.DateTimeFormat("es-CL", { month: "short" }).format(f.fechaObj).toUpperCase()}</div>
            <div class="feriado-dia">${f.fechaObj.getDate()}</div>
            <div class="feriado-info">
              <strong>${f.nombre}</strong>
              <span>${formatear(f.fechaObj)} · ${esFuturo(f.fechaObj) ? "Próximo" : "Pasado"}</span>
            </div>
            ${f.tipo ? `<span class="tag tag-gratis">${f.tipo}</span>` : ""}
          </article>
        `).join("")}
      </div>
    `;
  }
// ── Turismo ───────────────────────────────────────────────────────────────
  function renderTurismo(c) {
    const lugares = c.turismo || [];
    if (!lugares.length) return '<div class="vacio"><p>No hay información turística disponible.</p></div>';
    return `
      <div class="seccion-titulo">
        <h3>🏛️ Qué ver en ${c.nombre}</h3>
        <p>Lugares imperdibles para tu visita</p>
      </div>
      <div class="grid turismo-grid">
        ${lugares.map((l, i) => `
          <article class="tarjeta turismo-card">
            <div class="tarjeta-body">
              <div class="tarjeta-meta">
                <span class="num-sitio">${String(i + 1).padStart(2, "0")}</span>
                <span class="tag ${l.costo && l.costo.includes("Gratis") ? "tag-gratis" : "tag-pago"}">${l.costo}</span>
              </div>
              <h3>${l.titulo}</h3>
              <p class="descripcion">${l.detalle}</p>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  // ── Transporte ────────────────────────────────────────────────────────────
  function renderTransporte(c) {
    const t = c.transporte || [];
    if (!t.length) return '<div class="vacio"><p>No hay información de transporte disponible.</p></div>';
    return `
      <div class="seccion-titulo">
        <h3>🚌 Cómo moverte en ${c.nombre}</h3>
        <p>Opciones de transporte y recomendaciones</p>
      </div>
      <div class="lista-transporte">
        ${t.map(item => `
          <div class="item-transporte">
            <span class="icono-transporte">🚍</span>
            <p>${item}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ── Emergencia ────────────────────────────────────────────────────────────
  function renderEmergencia(c) {
    const em = c.emergencia || [];
    if (!em.length) return '<div class="vacio"><p>No hay información de emergencia disponible.</p></div>';

    const numerosCortos = em.filter(e => /^\d{3}$/.test(e.numero.replace(/\s/g, "")));
    const otros = em.filter(e => !/^\d{3}$/.test(e.numero.replace(/\s/g, "")));

    return `
      <div class="seccion-titulo">
        <h3>🆘 Emergencia en ${c.nombre}</h3>
        <p>Números y servicios de contacto — llámalos tocando la tarjeta</p>
      </div>

      <div class="grid emergencia-grid">
        ${numerosCortos.map(e => `
          <a class="tarjeta emergencia-card" href="tel:${e.numero.replace(/\s/g, "")}">
            <div class="emergencia-numero">${e.numero}</div>
            <div class="emergencia-nombre">${e.nombre}</div>
            <div class="emergencia-detalle">${e.detalle}</div>
            <div class="emergencia-llamar">📞 Llamar ahora</div>
          </a>
        `).join("")}
      </div>

      ${otros.length ? `
        <div class="otros-contactos">
          <h4>Otros servicios</h4>
          ${otros.map(e => `
            <div class="item-contacto">
              <div>
                <strong>${e.nombre}</strong>
                <p>${e.detalle}</p>
              </div>
              <a href="tel:${String(e.numero).replace(/[^\d+]/g, "")}" class="btn btn-secundario">📞 Llamar</a>
            </div>
          `).join("")}
        </div>
      ` : ""}
    `;
  }
// ── Panoramas: carga y render de sección ─────────────────────────────────
  async function cargarPanoramasCiudad() {
    const seccion = $("#seccion-contenido");
    if (seccion) {
      seccion.innerHTML = `<div class="cargando"><div class="spinner"></div><p>Cargando panoramas…</p></div>`;
    }

    try {
      const resultado = await cargarPanoramas(estado.ciudadActual || { id: CONFIG.ciudadDefecto });
      if (resultado && Array.isArray(resultado)) {
        estado.panoramas = resultado;
      } else if (resultado && Array.isArray(resultado.datos)) {
        estado.panoramas = resultado.datos;
        estado.avisoFuente = resultado.aviso || "";
      }
    } catch (e) {
      console.error(e);
      estado.panoramas = [];
      estado.avisoFuente = e.message;
    }

    renderizarPanoramas();
  }

  function renderizarPanoramas() {
    const seccion = $("#seccion-contenido");
    if (!seccion) return;

    if (estado.avisoFuente) {
      mostrarMensaje("⚠️ " + estado.avisoFuente);
    } else {
      const banner = $("#banner");
      if (banner) banner.classList.add("oculto");
    }

    if (!estado.panoramas.length) {
      seccion.innerHTML = `<div class="vacio"><p>😕 No hay panoramas disponibles.</p></div>`;
      return;
    }

    seccion.innerHTML = `
      <div class="seccion-titulo">
        <h3>🎉 Panoramas en ${estado.ciudadActual.nombre}</h3>
        <p>Eventos y panoramas cercanos</p>
      </div>
      <div class="controles-panoramas">
        <div class="busqueda">
          <input type="search" id="busqueda" placeholder="🔍 Buscar panorama…" aria-label="Buscar panoramas" />
        </div>
        <div class="filtros">
          <select id="filtro-categoria" aria-label="Categoría"><option value="Todas">Todas</option></select>
          <select id="orden" aria-label="Ordenar">
            <option value="fecha">📅 Por fecha</option>
            <option value="titulo">🔤 Por título</option>
            <option value="gratis">🆓 Gratis primero</option>
          </select>
          <label class="chk-gratis"><input type="checkbox" id="filtro-gratis" /> Solo gratis</label>
        </div>
      </div>
      <div class="grid" id="grid-panoramas"></div>
    `;

    llenarFiltroCategoriasPanoramas();
    renderizarGridPanoramas();
  }

  function llenarFiltroCategoriasPanoramas() {
    const cats = ["Todas", ...new Set(estado.panoramas.map(p => p.categoria).filter(Boolean))].sort();
    const sel = $("#filtro-categoria");
    if (!sel) return;
    sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join("");
    sel.addEventListener("change", () => {
      estado.filtroCategoria = sel.value;
      renderizarGridPanoramas();
    });

    const busca = $("#busqueda");
    if (busca) {
      busca.addEventListener("input", e => {
        estado.busqueda = e.target.value.trim().toLowerCase();
        renderizarGridPanoramas();
      });
    }

    const gratis = $("#filtro-gratis");
    if (gratis) {
      gratis.addEventListener("change", () => {
        estado.filtroGratis = gratis.checked;
        renderizarGridPanoramas();
      });
    }

    const orden = $("#orden");
    if (orden) {
      orden.addEventListener("change", () => {
        estado.orden = orden.value;
        renderizarGridPanoramas();
      });
    }
  }

  function renderizarGridPanoramas() {
    const grid = $("#grid-panoramas");
    if (!grid) return;

    let lista = [...estado.panoramas];
    if (estado.filtroCategoria !== "Todas") {
      lista = lista.filter(p => p.categoria === estado.filtroCategoria);
    }
    if (estado.filtroGratis) {
      lista = lista.filter(p => !p.precio);
    }
    if (estado.busqueda) {
      lista = lista.filter(p => {
        const texto = `${p.titulo} ${p.descripcion} ${p.ubicacion}`.toLowerCase();
        return texto.includes(estado.busqueda);
      });
    }

    if (!lista.length) {
      grid.innerHTML = `<div class="vacio"><p>😕 No hay panoramas que coincidan.</p></div>`;
      return;
    }

    grid.innerHTML = lista.map(p => tarjetaPanoramaHTML(p)).join("");

    $$(".tarjeta", grid).forEach(t => {
      t.addEventListener("click", e => {
        if (e.target.closest(".btn-fav")) return;
        abrirModalPanorama(t.dataset.id);
      });
    });
    $$(".btn-fav", grid).forEach(b => {
      b.addEventListener("click", e => {
        e.stopPropagation();
        toggleFavorito(b.dataset.id);
      });
    });
  }

  function tarjetaPanoramaHTML(p) {
    const favs = favoritosSet();
    const esFav = favs.has(p.id);
    const fecha = p.fecha ? formatearFecha(p.fecha) : "Fecha por confirmar";
    const precioTag = p.precio ? '<span class="tag tag-pago">💲 Pago</span>' : '<span class="tag tag-gratis">🆓 Gratis</span>';
    return `
      <article class="tarjeta" data-id="${p.id}">
        <div class="tarjeta-img">
          ${p.imagen ? `<img src="${p.imagen}" alt="${p.titulo}" loading="lazy" onerror="this.style.display='none'">` : '<div class="sin-img">🎉</div>'}
          <button class="btn-fav ${esFav ? "activo" : ""}" data-id="${p.id}" title="${esFav ? "Quitar de favoritos" : "Agregar a favoritos"}">${esFav ? "❤️" : "🤍"}</button>
          <span class="tag fuente">${p.fuente}</span>
        </div>
        <div class="tarjeta-body">
          <div class="tarjeta-meta">${precioTag}<span class="cat">${p.categoria || "Otro"}</span></div>
          <h3>${p.titulo}</h3>
          <p class="fecha">📅 ${fecha}</p>
          <p class="ubicacion">📍 ${p.ubicacion || "Ubicación no disponible"}</p>
          <p class="descripcion">${(p.descripcion || "").slice(0, 90)}${(p.descripcion || "").length > 90 ? "…" : ""}</p>
        </div>
      </article>
    `;
  }

  // ── Favoritos ─────────────────────────────────────────────────────────────
  function favoritosSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(LS_FAVORITOS) || "[]"));
    } catch {
      return new Set();
    }
  }

  function guardarFavoritos(set) {
    localStorage.setItem(LS_FAVORITOS, JSON.stringify([...set]));
  }

  function toggleFavorito(id) {
    const favs = favoritosSet();
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    guardarFavoritos(favs);
    renderizarGridPanoramas();
  }

// ── Modal de panorama ─────────────────────────────────────────────────────
  function abrirModalPanorama(id) {
    const p = estado.panoramas.find(x => x.id === id);
    if (!p) return;
    const modal = $("#modal");
    const cuerpo = $("#modal-cuerpo");
    if (!modal || !cuerpo) return;

    const favs = favoritosSet();
    const esFav = favs.has(id);
    const fecha = p.fecha ? formatearFecha(p.fecha) : "Fecha por confirmar";
    const precioTag = p.precio ? '<span class="tag tag-pago">💲 Pago</span>' : '<span class="tag tag-gratis">🆓 Gratis</span>';

    cuerpo.innerHTML = `
      ${p.imagen ? `<img class="modal-img" src="${p.imagen}" alt="${p.titulo}" onerror="this.style.display='none'">` : ""}
      <div class="modal-meta">${precioTag}<span class="cat">${p.categoria || "Otro"}</span><span class="fuente">${p.fuente}</span></div>
      <h2>${p.titulo}</h2>
      <p><strong>📅</strong> ${fecha}</p>
      <p><strong>📍</strong> ${p.ubicacion || "Ubicación no disponible"}</p>
      <p class="modal-desc">${p.descripcion || "Sin descripción disponible."}</p>
      <div class="modal-acciones">
        ${p.url ? `<a class="btn btn-primario" href="${p.url}" target="_blank" rel="noopener">🎟️ Ir al evento</a>` : ""}
        <button class="btn btn-secundario btn-fav-modal">${esFav ? "❤️ Quitar de favoritos" : "🤍 Guardar"}</button>
        <button class="btn btn-secundario btn-compartir">📤 Compartir</button>
        <button class="btn btn-cerrar" id="modal-cerrar">✖ Cerrar</button>
      </div>
    `;

    modal.classList.remove("oculto");
    modal.classList.add("visible");
    document.body.style.overflow = "hidden";

    $("#modal-cerrar").addEventListener("click", cerrarModal);
    modal.addEventListener("click", e => { if (e.target === modal) cerrarModal(); });
    $(".btn-fav-modal", cuerpo).addEventListener("click", () => {
      toggleFavorito(id);
      abrirModalPanorama(id);
    });
    $(".btn-compartir", cuerpo).addEventListener("click", () => {
      const texto = `${p.titulo} 🎉\n${fecha}\n📍 ${p.ubicacion || ""}\n${p.url || ""}`;
      if (navigator.share) {
        navigator.share({ title: p.titulo, text: texto, url: p.url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(texto).then(() => mostrarMensaje("¡Copiado al portapapeles!")).catch(() => {});
      }
    });
  }

  function cerrarModal() {
    const modal = $("#modal");
    if (!modal) return;
    modal.classList.add("oculto");
    modal.classList.remove("visible");
    document.body.style.overflow = "";
  }

  // ── Servicios (directorio turístico) ─────────────────────────────────────
  function renderizarServicios() {
    const seccion = $("#seccion-contenido");
    if (!seccion) return;
    const c = estado.ciudadActual;

    seccion.innerHTML = `
      <div class="seccion-titulo">
        <h3>🛠️ Servicios turísticos</h3>
        <p>Hoteles, restaurantes, transporte y más en ${c.nombre}</p>
      </div>
      <div class="iframe-servicios">
        <iframe src="servicios/index.html?ciudad=${encodeURIComponent(c.id)}" title="Directorio de servicios turísticos" loading="lazy"></iframe>
      </div>
    `;
  }

  // ── Controles generales ───────────────────────────────────────────────────
  function configurarControles() {
    $$(".tab-btn").forEach(b => {
      b.addEventListener("click", () => cambiarSeccion(b.dataset.seccion));
    });

    $("#btn-tema")?.addEventListener("click", toggleTema);
    $("#btn-geo")?.addEventListener("click", () => {
      if (!navigator.geolocation) return mostrarMensaje("Tu navegador no soporta geolocalización 🙁", true);
      mostrarMensaje("📡 Buscando tu ubicación…");
      navigator.geolocation.getCurrentPosition(pos => {
        let mejor = null, mejorDist = Infinity;
        estado.ciudades.forEach(ciudad => {
          const d = Math.hypot(ciudad.lat - pos.coords.latitude, ciudad.lon - pos.coords.longitude);
          if (d < mejorDist) { mejorDist = d; mejor = ciudad; }
        });
        if (mejor) {
          cambiarCiudad(mejor.id);
          mostrarMensaje(`📍 Estás cerca de ${mejor.nombre} — te mostramos esa ciudad`);
          setTimeout(() => { const b = $("#banner"); if (b) b.classList.add("oculto"); }, 4000);
        }
      }, () => mostrarMensaje("No se pudo obtener tu ubicación 🙁", true), { timeout: 10000 });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !$("#modal").classList.contains("oculto")) cerrarModal();
    });
  }

  // ── Utilidades ────────────────────────────────────────────────────────────
  function mostrarMensaje(texto, esError = false) {
    const banner = $("#banner");
    if (!banner) return;
    banner.textContent = texto;
    banner.classList.toggle("error", esError);
    banner.classList.remove("oculto");
  }

  function ocultarCargando() {
    const sp = $("#cargando");
    if (sp) sp.classList.add("oculto");
    const cont = $("#contenido");
    if (cont) cont.classList.remove("oculto");
  }

  function formatearFecha(fechaISO) {
    const d = new Date(fechaISO);
    if (isNaN(d.getTime())) return "Fecha por confirmar";
    return new Intl.DateTimeFormat("es-CL", {
      weekday: "long", day: "numeric", month: "long",
      hour: "numeric", minute: "2-digit",
    }).format(d);
  }

  function toggleTema() {
    document.body.classList.toggle("oscuro");
    localStorage.setItem(LS_TEMA, document.body.classList.contains("oscuro") ? "oscuro" : "claro");
  }

  // ── Arranque ──────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", iniciar);
})();
