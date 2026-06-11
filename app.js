const routes = window.FEHO_ROUTES || [];

const state = {
  selectedRouteId: routes.find((route) => route.coordinates.length)?.id || routes[0]?.id,
  routeLine: null,
  markerLayer: null,
  map: null,
  routeRequestId: 0
};

const els = {
  statsGrid: document.querySelector("#statsGrid"),
  routeList: document.querySelector("#routeList"),
  searchInput: document.querySelector("#searchInput"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  detailPanel: document.querySelector("#detailPanel"),
  selectedGoogleLink: document.querySelector("#selectedGoogleLink"),
  showFullRoute: document.querySelector("#showFullRoute"),
  downloadSelectedKml: document.querySelector("#downloadSelectedKml"),
  downloadAllKml: document.querySelector("#downloadAllKml"),
  routeStatus: document.querySelector("#routeStatus")
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  populateFilters();
  renderStats();
  renderRouteList();
  initMap();
  selectRoute(state.selectedRouteId);
  bindEvents();
}

function bindEvents() {
  els.searchInput.addEventListener("input", renderRouteList);
  els.difficultyFilter.addEventListener("change", renderRouteList);

  els.routeList.addEventListener("click", (event) => {
    const card = event.target.closest(".route-card");
    if (!card) return;

    const route = getRoute(card.dataset.routeId);
    const action = event.target.closest("[data-action]")?.dataset.action || "open";
    if (!route) return;

    if (action === "google") {
      window.open(route.googleMapsUrl, "_blank", "noopener");
      return;
    }

    if (action === "kml") {
      downloadKml(route);
      return;
    }

    selectRoute(route.id);
    if (action === "details") {
      document.querySelector("#details").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  els.showFullRoute.addEventListener("click", () => {
    const route = getSelectedRoute();
    if (route) fitRoute(route);
  });

  els.downloadSelectedKml.addEventListener("click", () => {
    const route = getSelectedRoute();
    if (route) downloadKml(route);
  });

  els.downloadAllKml.addEventListener("click", () => {
    downloadKml(routes, "fehos-motocycle-road-all-routes.kml");
  });
}

function populateFilters() {
  const difficulties = unique(routes.map((route) => route.difficulty));

  appendOptions(els.difficultyFilter, difficulties);
}

function appendOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = titleCase(value);
    select.appendChild(option);
  });
}

function initMap() {
  if (!window.L) {
    document.querySelector("#map").innerHTML = "<div class='empty-state'>Leaflet yÃ¼klenemedi. Ä°nternet baÄŸlantÄ±sÄ±nÄ± veya CDN eriÅŸimini kontrol et.</div>";
    return;
  }

  state.map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([39.93, 32.85], 8);

  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  });

  const esriImagery = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri"
  });

  const esriStreet = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri"
  });

  // Google tile denemeleri API/servis koÅŸullarÄ±na takÄ±labilir; bu yÃ¼zden varsayÄ±lan katmanda kullanÄ±lmadÄ±.
  // const googleRoad = L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] });
  // const googleSatellite = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] });
  // const googleHybrid = L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] });

  osm.addTo(state.map);
  L.control.layers({
    "OpenStreetMap": osm,
    "Esri World Imagery": esriImagery,
    "Esri Street Map": esriStreet
  }).addTo(state.map);

  state.markerLayer = L.layerGroup().addTo(state.map);
}

function renderStats() {
  const totalKm = routes.reduce((sum, route) => sum + (Number(route.distanceKm) || 0), 0);
  const uniqueLinkCount = unique(routes.map((route) => normalizeUrl(route.googleMapsUrl))).length;
  const timedRoutes = routes.filter((route) => Number(route.rideMinutes));
  const avgRide = timedRoutes.length
    ? Math.round(timedRoutes.reduce((sum, route) => sum + route.rideMinutes, 0) / timedRoutes.length)
    : 0;
  const favoriteStops = routes.reduce((sum, route) => sum + route.stops.filter((stop) => stop.favorite).length, 0);

  const stats = [
    { value: `${routes.length} / ${uniqueLinkCount}`, label: "Rota kaydı / benzersiz link" },
    { value: `${totalKm} km`, label: "Girilen toplam mesafe" },
    { value: avgRide ? formatMinutes(avgRide) : "PlanlanÄ±yor", label: "Ortalama sÃ¼rÃ¼ÅŸ sÃ¼resi" },
    { value: favoriteStops, label: "Favori durak" }
  ];

  els.statsGrid.innerHTML = stats.map((stat) => `
    <article class="stat">
      <strong>${escapeHtml(stat.value)}</strong>
      <span>${escapeHtml(stat.label)}</span>
    </article>
  `).join("");
}

function renderRouteList() {
  const filteredRoutes = getFilteredRoutes();

  if (!filteredRoutes.length) {
    els.routeList.innerHTML = "<div class='empty-state'>Bu filtrelerle rota bulunamadÄ±.</div>";
    return;
  }

  els.routeList.innerHTML = filteredRoutes.map((route) => `
    <article class="route-card ${route.id === state.selectedRouteId ? "active" : ""}" data-route-id="${escapeHtml(route.id)}" tabindex="0">
      <div class="card-top">
        <div>
          <div class="pill-row">
            ${route.isFavorite ? "<span class='pill favorite'>Favori</span>" : ""}
            ${route.isPlaceholder ? "<span class='pill warning'>Koordinat bekliyor</span>" : ""}
            ${getDuplicateLinkCount(route) > 1 ? "<span class='pill warning'>Aynı link</span>" : ""}
          </div>
          <h3>${escapeHtml(route.name)}</h3>
        </div>
      </div>
      <p>${escapeHtml(route.description)}</p>
      <div class="route-meta">
        <span>Mesafe: ${formatDistance(route.distanceKm)}</span>
        <span>SÃ¼rÃ¼ÅŸ: ${formatNullableMinutes(route.rideMinutes, route.estimatedDuration)}</span>
        <span>Mola: ${formatNullableMinutes(route.breakMinutes, "Planlanacak")}</span>
        <span>Toplam: ${formatNullableMinutes(route.totalMinutes, "Planlanacak")}</span>
        <span>Durak: ${route.stops.length || "Bekliyor"}</span>
      </div>
      <div class="mini-timeline">
        ${renderMiniTimeline(route)}
      </div>
      <p><strong>Yol:</strong> ${escapeHtml(route.roadCharacter)}</p>
      <p><strong>YakÄ±t/servis:</strong> ${escapeHtml(route.fuelServiceNote)}</p>
      <div class="card-actions">
        <button class="button primary small-button" type="button" data-action="open">RotayÄ± AÃ§</button>
        <button class="button secondary small-button" type="button" data-action="google">Google Maps</button>
        <button class="button secondary small-button" type="button" data-action="details">Detaylar</button>
        <button class="button secondary small-button" type="button" data-action="kml">KML indir</button>
      </div>
    </article>
  `).join("");
}

function getFilteredRoutes() {
  const query = els.searchInput.value.trim().toLocaleLowerCase("tr");
  const difficulty = els.difficultyFilter.value;

  return routes.filter((route) => {
    const matchesDifficulty = difficulty === "all" || route.difficulty === difficulty;
    const matchesQuery = !query || getSearchText(route).includes(query);
    return matchesDifficulty && matchesQuery;
  });
}

function selectRoute(routeId) {
  const route = getRoute(routeId);
  if (!route) return;

  state.selectedRouteId = route.id;
  els.selectedGoogleLink.href = route.googleMapsUrl;
  renderRouteList();
  renderDetails(route);
  drawRoute(route);
}

async function drawRoute(route) {
  if (!state.map || !window.L) return;

  const requestId = ++state.routeRequestId;

  if (state.routeLine) {
    state.routeLine.remove();
    state.routeLine = null;
  }

  state.markerLayer.clearLayers();

  const stopsWithCoords = route.stops.filter((stop) => Array.isArray(stop.coords));

  addStopMarkers(stopsWithCoords);

  if (route.coordinates.length > 1) {
    setRouteStatus("Yol çizgisi hesaplanıyor...");

    try {
      const roadCoordinates = await fetchRoadGeometry(route.coordinates);
      if (requestId !== state.routeRequestId) return;

      route.roadGeometry = roadCoordinates;
      state.routeLine = drawRouteLine(roadCoordinates, false);
      setRouteStatus("Rota çizgisi OSRM ile yol ağına oturtuldu. Google Maps linki asıl rota referansıdır.");
    } catch (error) {
      if (requestId !== state.routeRequestId) return;

      route.roadGeometry = null;
      state.routeLine = drawRouteLine(route.coordinates, true);
      setRouteStatus("Yol servisi cevap vermedi; geçici düz çizgi gösteriliyor. Google Maps butonu asıl rota referansıdır.");
    }

    fitRoute(route);
    return;
  }

  setRouteStatus("Bu rota için durak koordinatları bekleniyor; Google Maps linki arşivde tutuluyor.");
  fitRoute(route);
}

function addStopMarkers(stopsWithCoords) {
  stopsWithCoords.forEach((stop, index) => {
    const marker = L.marker(stop.coords, {
      icon: L.divIcon({
        className: "",
        html: `<span class="numbered-marker">${index + 1}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    });

    marker.bindPopup(`
      <strong>${escapeHtml(stop.name)}</strong><br>
      ${escapeHtml(stop.description || stop.note || "")}<br>
      <small>${stop.coords[0].toFixed(6)}, ${stop.coords[1].toFixed(6)}${stop.approximate ? " Â· yaklaÅŸÄ±k" : ""}</small>
    `);

    state.markerLayer.addLayer(marker);
  });
}

function fitRoute(route) {
  if (!state.map || !window.L) return;

  const points = getRouteLineCoordinates(route);
  if (points.length > 1) {
    state.map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 12 });
    return;
  }

  if (points.length === 1) {
    state.map.setView(points[0], 11);
    return;
  }

  state.map.setView([39.93, 32.85], 8);
}

function drawRouteLine(coordinates, isFallback) {
  return L.polyline(coordinates, {
    color: isFallback ? "#d96f55" : "#f2a33a",
    weight: isFallback ? 4 : 6,
    opacity: 0.95,
    lineJoin: "round",
    dashArray: isFallback ? "10 10" : null
  }).addTo(state.map);
}

async function fetchRoadGeometry(coordinates) {
  const waypointText = coordinates.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const radiuses = coordinates.map(() => "5000").join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${waypointText}?overview=full&geometries=geojson&steps=false&continue_straight=false&radiuses=${radiuses}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OSRM ${response.status}`);
  }

  const data = await response.json();
  const geometry = data.routes?.[0]?.geometry?.coordinates;

  if (!Array.isArray(geometry) || geometry.length < 2) {
    throw new Error("OSRM geometry missing");
  }

  return geometry.map(([lng, lat]) => [lat, lng]);
}

function getRouteLineCoordinates(route) {
  return Array.isArray(route.roadGeometry) && route.roadGeometry.length > 1
    ? route.roadGeometry
    : route.coordinates;
}

function setRouteStatus(message) {
  if (els.routeStatus) {
    els.routeStatus.textContent = message;
  }
}

function renderDetails(route) {
  const hasStops = route.stops.length > 0;

  els.detailPanel.innerHTML = `
    <div>
      <div class="pill-row">
        <span class="pill">${escapeHtml(titleCase(route.difficulty))}</span>
        ${route.isFavorite ? "<span class='pill favorite'>Favori rota</span>" : ""}
        ${route.isPlaceholder ? "<span class='pill warning'>Koordinat bekliyor</span>" : ""}
      </div>
      <h3>${escapeHtml(route.name)}</h3>
      <p>${escapeHtml(route.description)}</p>
    </div>

    <div class="detail-grid">
      ${detailMetric("Mesafe", formatDistance(route.distanceKm))}
      ${detailMetric("SÃ¼rÃ¼ÅŸ", formatNullableMinutes(route.rideMinutes, route.estimatedDuration))}
      ${detailMetric("Mola", formatNullableMinutes(route.breakMinutes, "Planlanacak"))}
      ${detailMetric("Toplam", formatNullableMinutes(route.totalMinutes, "Planlanacak"))}
    </div>

    <div class="advice-grid">
      ${adviceCard("BaÅŸlangÄ±Ã§ / BitiÅŸ", `${route.startPoint} â†’ ${route.endPoint}`)}
      ${adviceCard("Ã–nerilen mevsim", route.recommendedSeason)}
      ${adviceCard("SÃ¼rÃ¼ÅŸ tavsiyesi", route.rideAdvice)}
      ${adviceCard("Risk / uyarÄ±", route.riskWarnings)}
      ${adviceCard("Kahve / yemek / fotoÄŸraf", route.coffeeFoodPhoto)}
      ${adviceCard("Notlar", route.notes.join(" "))}
    </div>

    <div>
      <h4>Durak timeline</h4>
      ${hasStops ? renderStops(route.stops) : "<div class='empty-state'>Bu rota iÃ§in durak koordinatlarÄ± henÃ¼z eklenmedi. `routes.js` iÃ§inde stops alanÄ±nÄ± doldurunca harita ve KML otomatik oluÅŸur.</div>"}
    </div>

    <div class="detail-actions">
      <a class="button primary" href="${escapeHtml(route.googleMapsUrl)}" target="_blank" rel="noopener">Google Maps'te AÃ§</a>
      <button class="button secondary" type="button" onclick="window.FEHO_APP.downloadSelected()">KML indir</button>
    </div>
  `;
}

function renderStops(stops) {
  return `
    <ol class="stops-list">
      ${stops.map((stop, index) => `
        <li class="stop-item">
          <span class="stop-number">${index + 1}</span>
          <div>
            <h4>${escapeHtml(stop.name)}</h4>
            <p>${escapeHtml(stop.note || stop.description || "")}</p>
            <p>${Array.isArray(stop.coords) ? `${stop.coords[0].toFixed(6)}, ${stop.coords[1].toFixed(6)}${stop.approximate ? " Â· yaklaÅŸÄ±k koordinat" : ""}` : "Koordinat bekliyor"}</p>
          </div>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderMiniTimeline(route) {
  if (!route.stops.length) return "<span>Duraklar eklenecek</span>";
  return route.stops.slice(0, 4).map((stop, index) => `<span>${index + 1}. ${escapeHtml(stop.name)}</span>`).join("") +
    (route.stops.length > 4 ? `<span>+${route.stops.length - 4} durak</span>` : "");
}

function detailMetric(label, value) {
  return `
    <div class="detail-metric">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function adviceCard(title, text) {
  return `
    <article class="advice-card">
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function downloadKml(routeOrRoutes, filename) {
  const selectedRoutes = Array.isArray(routeOrRoutes) ? routeOrRoutes : [routeOrRoutes];
  const kml = buildKml(selectedRoutes);
  const blob = new Blob([kml], {
    type: "application/vnd.google-earth.kml+xml;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${slugify(selectedRoutes[0].name)}.kml`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildKml(selectedRoutes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Feho's Motocycle Road</name>
    ${selectedRoutes.map(routeToKml).join("\n")}
  </Document>
</kml>`;
}

function routeToKml(route) {
  const lineCoordinates = getRouteLineCoordinates(route);
  const line = lineCoordinates.length > 1
    ? `
      <Placemark>
        <name>${xml(route.name)} - rota Ã§izgisi</name>
        <description>${xml(route.description)}</description>
        <Style><LineStyle><color>ff3aa3f2</color><width>5</width></LineStyle></Style>
        <LineString>
          <tessellate>1</tessellate>
          <coordinates>${lineCoordinates.map(([lat, lng]) => `${lng},${lat},0`).join(" ")}</coordinates>
        </LineString>
      </Placemark>`
    : `
      <Placemark>
        <name>${xml(route.name)} - koordinat bekliyor</name>
        <description>${xml("Bu rota kÄ±sa link olarak arÅŸivlendi; durak koordinatlarÄ± routes.js iÃ§inde manuel tamamlanmalÄ±. Google Maps: " + route.googleMapsUrl)}</description>
      </Placemark>`;

  const stops = route.stops
    .filter((stop) => Array.isArray(stop.coords))
    .map((stop, index) => `
      <Placemark>
        <name>${index + 1}. ${xml(stop.name)}</name>
        <description>${xml(`${stop.description || ""} ${stop.note || ""}${stop.approximate ? " YaklaÅŸÄ±k koordinat." : ""}`.trim())}</description>
        <Point><coordinates>${stop.coords[1]},${stop.coords[0]},0</coordinates></Point>
      </Placemark>`)
    .join("\n");

  return `
    <Folder>
      <name>${xml(route.name)}</name>
      ${line}
      ${stops}
    </Folder>`;
}

function getSelectedRoute() {
  return getRoute(state.selectedRouteId);
}

function getRoute(routeId) {
  return routes.find((route) => route.id === routeId);
}

function getDuplicateLinkCount(route) {
  const url = normalizeUrl(route.googleMapsUrl);
  return routes.filter((item) => normalizeUrl(item.googleMapsUrl) === url).length;
}

function getSearchText(route) {
  return [
    route.name,
    route.description,
    route.difficulty,
    route.startPoint,
    route.endPoint,
    route.roadCharacter,
    route.fuelServiceNote,
    route.notes.join(" "),
    route.stops.map((stop) => `${stop.name} ${stop.description} ${stop.note}`).join(" ")
  ].join(" ").toLocaleLowerCase("tr");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
}

function normalizeUrl(url) {
  return String(url || "").replace(/\?.*$/, "").trim();
}

function formatDistance(value) {
  return Number(value) ? `${value} km` : "Mesafe planlanacak";
}

function formatNullableMinutes(minutes, fallback) {
  return Number(minutes) ? formatMinutes(minutes) : fallback;
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins} dk`;
  if (!mins) return `${hours} sa`;
  return `${hours} sa ${mins} dk`;
}

function titleCase(value) {
  return String(value)
    .split(" ")
    .map((word) => word.replace(/^./, (letter) => letter.toLocaleUpperCase("tr")))
    .join(" ");
}

function slugify(value) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ÄŸ/g, "g")
    .replace(/Ã¼/g, "u")
    .replace(/ÅŸ/g, "s")
    .replace(/Ä±/g, "i")
    .replace(/Ã¶/g, "o")
    .replace(/Ã§/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function xml(value) {
  return escapeHtml(value);
}

window.FEHO_APP = {
  selectRoute,
  buildKml,
  downloadSelected() {
    const route = getSelectedRoute();
    if (route) downloadKml(route);
  }
};

