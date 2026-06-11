const STORAGE_KEY = "feho_motocycle_routes";
const CAYYOLU_START = {
  name: "Çayyolu / Başlangıç",
  description: "Her rota için 1 numaralı başlangıç noktası.",
  note: "Başlangıç noktası.",
  coords: [39.8820606, 32.6893723],
  favorite: true
};

let routes = mergeStoredRoutes(window.FEHO_ROUTES || []);

const state = {
  selectedRouteId: routes.find((route) => route.coordinates.length)?.id || routes[0]?.id,
  map: null,
  streetLayer: null,
  satelliteLayer: null,
  routeLine: null,
  markerLayer: null,
  routeRequestId: 0,
  builderStops: [],
  builderRouteId: null,
  pickingOnMap: false
};

const els = {
  routeList: document.querySelector("#routeList"),
  searchInput: document.querySelector("#searchInput"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  detailPanel: document.querySelector("#detailPanel"),
  openMapAppLink: document.querySelector("#openMapAppLink"),
  fitRouteButton: document.querySelector("#fitRouteButton"),
  downloadSelectedKml: document.querySelector("#downloadSelectedKml"),
  downloadAllKml: document.querySelector("#downloadAllKml"),
  routeStatus: document.querySelector("#routeStatus"),
  streetMapButton: document.querySelector("#streetMapButton"),
  satelliteMapButton: document.querySelector("#satelliteMapButton"),
  startNewRoute: document.querySelector("#startNewRoute"),
  builderName: document.querySelector("#builderName"),
  stopName: document.querySelector("#stopName"),
  stopCoords: document.querySelector("#stopCoords"),
  pickOnMap: document.querySelector("#pickOnMap"),
  addStop: document.querySelector("#addStop"),
  builderStops: document.querySelector("#builderStops"),
  saveBuilderRoute: document.querySelector("#saveBuilderRoute"),
  clearBuilder: document.querySelector("#clearBuilder")
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  populateDifficultyFilter();
  initMap();
  bindEvents();
  renderRouteList();
  selectRoute(state.selectedRouteId);
}

function bindEvents() {
  els.searchInput.addEventListener("input", renderRouteList);
  els.difficultyFilter.addEventListener("change", renderRouteList);
  els.fitRouteButton.addEventListener("click", () => fitRoute(getSelectedRoute()));
  els.downloadSelectedKml.addEventListener("click", () => downloadKml(getSelectedRoute()));
  els.downloadAllKml.addEventListener("click", () => downloadKml(routes, "fehos-motocycle-road-routes.kml"));
  els.streetMapButton.addEventListener("click", () => setBaseLayer("street"));
  els.satelliteMapButton.addEventListener("click", () => setBaseLayer("satellite"));
  els.startNewRoute.addEventListener("click", startBlankRoute);
  els.pickOnMap.addEventListener("click", toggleMapPicking);
  els.addStop.addEventListener("click", addManualStop);
  els.saveBuilderRoute.addEventListener("click", saveBuilderRoute);
  els.clearBuilder.addEventListener("click", clearBuilder);

  els.routeList.addEventListener("click", (event) => {
    const card = event.target.closest(".route-card");
    if (!card) return;

    const action = event.target.closest("[data-action]")?.dataset.action || "open";
    const route = getRoute(card.dataset.routeId);
    if (!route) return;

    if (action === "map") {
      window.open(getMapAppUrl(route), "_blank", "noopener");
      return;
    }

    if (action === "edit") {
      loadRouteIntoBuilder(route);
      return;
    }

    selectRoute(route.id);
  });

  els.builderStops.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.builderAction;

    if (action === "remove") {
      state.builderStops.splice(index, 1);
    }

    if (action === "up" && index > 0) {
      [state.builderStops[index - 1], state.builderStops[index]] = [state.builderStops[index], state.builderStops[index - 1]];
    }

    if (action === "down" && index < state.builderStops.length - 1) {
      [state.builderStops[index + 1], state.builderStops[index]] = [state.builderStops[index], state.builderStops[index + 1]];
    }

    renderBuilderStops();
    previewBuilderRoute();
  });
}

function populateDifficultyFilter() {
  unique(routes.map((route) => route.difficulty)).forEach((difficulty) => {
    const option = document.createElement("option");
    option.value = difficulty;
    option.textContent = titleCase(difficulty);
    els.difficultyFilter.appendChild(option);
  });
}

function initMap() {
  if (!window.L) {
    document.querySelector("#map").innerHTML = "<div class='empty-state'>Leaflet yüklenemedi. İnternet bağlantısını kontrol et.</div>";
    return;
  }

  state.map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([39.93, 32.85], 8);

  state.streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  });

  state.satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri"
  });

  // Google tile örnekleri servis/API koşullarına takılabileceği için aktif kullanılmıyor.
  // const googleRoad = L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] });
  // const googleSatellite = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"] });

  state.streetLayer.addTo(state.map);
  state.markerLayer = L.layerGroup().addTo(state.map);

  state.map.on("click", (event) => {
    if (!state.pickingOnMap) return;

    const name = els.stopName.value.trim() || `Durak ${state.builderStops.length + 1}`;
    state.builderStops.push({
      name,
      description: "Haritadan seçilen durak.",
      note: "Kullanıcı tarafından eklendi.",
      coords: [roundCoord(event.latlng.lat), roundCoord(event.latlng.lng)],
      custom: true
    });
    els.stopName.value = "";
    els.stopCoords.value = "";
    renderBuilderStops();
    previewBuilderRoute();
  });
}

function setBaseLayer(type) {
  if (!state.map) return;

  if (type === "satellite") {
    state.map.removeLayer(state.streetLayer);
    state.satelliteLayer.addTo(state.map);
    els.satelliteMapButton.classList.add("active");
    els.streetMapButton.classList.remove("active");
    return;
  }

  state.map.removeLayer(state.satelliteLayer);
  state.streetLayer.addTo(state.map);
  els.streetMapButton.classList.add("active");
  els.satelliteMapButton.classList.remove("active");
}

function renderRouteList() {
  const filteredRoutes = getFilteredRoutes();

  if (!filteredRoutes.length) {
    els.routeList.innerHTML = "<div class='empty-state'>Rota bulunamadı.</div>";
    return;
  }

  els.routeList.innerHTML = filteredRoutes.map((route) => `
    <article class="route-card ${route.id === state.selectedRouteId ? "active" : ""}" data-route-id="${escapeHtml(route.id)}" tabindex="0">
      <div class="pill-row">
        ${route.isFavorite ? "<span class='pill favorite'>Favori</span>" : ""}
        ${route.isPlaceholder ? "<span class='pill warning'>Koordinat bekliyor</span>" : ""}
        ${route.isCustom ? "<span class='pill'>Benim rotam</span>" : ""}
      </div>
      <h3>${escapeHtml(route.name)}</h3>
      <p>${escapeHtml(route.description)}</p>
      <div class="route-meta">
        <span>${formatDistance(route.distanceKm)}</span>
        <span>${formatNullableMinutes(route.rideMinutes, route.estimatedDuration)}</span>
        <span>${route.stops.length || "Durak bekliyor"} durak</span>
      </div>
      <div class="card-actions">
        <button class="button primary small-button" type="button" data-action="open">Aç</button>
        <button class="button secondary small-button" type="button" data-action="edit">Düzenle</button>
        <button class="button secondary small-button" type="button" data-action="map">Harita</button>
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
  els.openMapAppLink.href = getMapAppUrl(route);
  renderRouteList();
  renderDetails(route);
  drawRoute(route);
}

async function drawRoute(route) {
  if (!state.map || !window.L) return;

  const requestId = ++state.routeRequestId;
  clearMapRoute();

  const stopsWithCoords = route.stops.filter((stop) => Array.isArray(stop.coords));
  addStopMarkers(stopsWithCoords);

  if (route.coordinates.length > 1) {
    setRouteStatus("Yol çizgisi hesaplanıyor...");

    try {
      const roadCoordinates = await fetchRoadGeometry(route.coordinates);
      if (requestId !== state.routeRequestId) return;

      route.roadGeometry = roadCoordinates;
      state.routeLine = drawRouteLine(roadCoordinates, false);
      setRouteStatus("Rota yol ağına oturtuldu. İstersen durakları düzenleyip yeni KML indirebilirsin.");
    } catch (error) {
      if (requestId !== state.routeRequestId) return;

      route.roadGeometry = null;
      state.routeLine = drawRouteLine(route.coordinates, true);
      setRouteStatus("Yol servisi cevap vermedi; geçici çizgi gösteriliyor.");
    }

    fitRoute(route);
    return;
  }

  setRouteStatus("Bu rota kısa link olarak duruyor. Durakları eklemek için Düzenle veya Yeni Rota kullan.");
  fitRoute(route);
}

function clearMapRoute() {
  if (state.routeLine) {
    state.routeLine.remove();
    state.routeLine = null;
  }

  state.markerLayer.clearLayers();
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
      ${escapeHtml(stop.note || stop.description || "")}<br>
      <small>${stop.coords[0].toFixed(6)}, ${stop.coords[1].toFixed(6)}${stop.approximate ? " · yaklaşık" : ""}</small>
    `);

    state.markerLayer.addLayer(marker);
  });
}

function fitRoute(route) {
  if (!route || !state.map || !window.L) return;

  const points = getRouteLineCoordinates(route);
  if (points.length > 1) {
    state.map.fitBounds(L.latLngBounds(points), { padding: [42, 42], maxZoom: 12 });
    return;
  }

  if (points.length === 1) {
    state.map.setView(points[0], 12);
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

function renderDetails(route) {
  els.detailPanel.innerHTML = `
    <div>
      <div class="pill-row">
        <span class="pill">${escapeHtml(titleCase(route.difficulty))}</span>
        ${route.isPlaceholder ? "<span class='pill warning'>Koordinat bekliyor</span>" : ""}
        ${route.isCustom ? "<span class='pill'>Benim rotam</span>" : ""}
      </div>
      <h2>${escapeHtml(route.name)}</h2>
      <p>${escapeHtml(route.description)}</p>
    </div>

    <div class="detail-grid">
      ${detailMetric("Mesafe", formatDistance(route.distanceKm))}
      ${detailMetric("Sürüş", formatNullableMinutes(route.rideMinutes, route.estimatedDuration))}
      ${detailMetric("Mola", formatNullableMinutes(route.breakMinutes, "Planlanacak"))}
      ${detailMetric("Durak", String(route.stops.length || "Bekliyor"))}
    </div>

    <div class="card-actions">
      <button class="button primary small-button" type="button" onclick="window.FEHO_APP.editSelected()">Durakları Düzenle</button>
      <a class="button secondary small-button" href="${escapeHtml(getMapAppUrl(route))}" target="_blank" rel="noopener">Harita Uygulaması</a>
      <button class="button secondary small-button" type="button" onclick="window.FEHO_APP.downloadSelected()">KML indir</button>
    </div>

    ${renderStops(route.stops)}
  `;
}

function renderStops(stops) {
  if (!stops.length) {
    return "<div class='empty-state'>Bu rotada durak yok. Haritadan nokta seçerek veya koordinat girerek ekleyebilirsin.</div>";
  }

  return `
    <ol class="stops-list">
      ${stops.map((stop, index) => `
        <li class="stop-item">
          <span class="stop-number">${index + 1}</span>
          <div>
            <h4>${escapeHtml(stop.name)}</h4>
            <p>${Array.isArray(stop.coords) ? `${stop.coords[0].toFixed(6)}, ${stop.coords[1].toFixed(6)}` : "Koordinat bekliyor"}</p>
          </div>
        </li>
      `).join("")}
    </ol>
  `;
}

function startBlankRoute() {
  state.builderRouteId = null;
  state.builderStops = [cloneStop(CAYYOLU_START)];
  els.builderName.value = `ROTA-${routes.length + 1} - Yeni Loop`;
  renderBuilderStops();
  previewBuilderRoute();
  setRouteStatus("Yeni rota modu: durak eklemek için koordinat gir veya Haritadan Seç'e bas.");
}

function loadRouteIntoBuilder(route) {
  selectRoute(route.id);
  state.builderRouteId = route.id;
  state.builderStops = ensureCayyoluStart(route.stops.map(cloneStop));
  els.builderName.value = route.name;
  renderBuilderStops();
  setRouteStatus("Düzenleme modu: durak sırasını değiştir, yeni durak ekle ve kaydet.");
}

function toggleMapPicking() {
  state.pickingOnMap = !state.pickingOnMap;
  els.pickOnMap.classList.toggle("primary", state.pickingOnMap);
  els.pickOnMap.classList.toggle("secondary", !state.pickingOnMap);
  setRouteStatus(state.pickingOnMap ? "Haritada tıkladığın yer yeni durak olacak." : "Haritadan seçme kapandı.");
}

function addManualStop() {
  const coords = parseCoords(els.stopCoords.value);
  if (!coords) {
    setRouteStatus("Koordinat formatı: 39.8820606, 32.6893723");
    return;
  }

  state.builderStops.push({
    name: els.stopName.value.trim() || `Durak ${state.builderStops.length + 1}`,
    description: "Kullanıcı tarafından eklendi.",
    note: "Manuel durak.",
    coords,
    custom: true
  });

  els.stopName.value = "";
  els.stopCoords.value = "";
  renderBuilderStops();
  previewBuilderRoute();
}

function renderBuilderStops() {
  if (!state.builderStops.length) {
    els.builderStops.innerHTML = "<li class='empty-state'>Henüz durak yok.</li>";
    return;
  }

  els.builderStops.innerHTML = state.builderStops.map((stop, index) => `
    <li class="builder-stop">
      <span class="stop-number">${index + 1}</span>
      <div>
        <strong>${escapeHtml(stop.name)}</strong>
        <span>${stop.coords ? `${stop.coords[0].toFixed(6)}, ${stop.coords[1].toFixed(6)}` : "Koordinat yok"}</span>
      </div>
      <div class="card-actions">
        <button class="button secondary small-button" type="button" data-builder-action="up" data-index="${index}">↑</button>
        <button class="button secondary small-button" type="button" data-builder-action="down" data-index="${index}">↓</button>
        <button class="button secondary small-button" type="button" data-builder-action="remove" data-index="${index}">Sil</button>
      </div>
    </li>
  `).join("");
}

function previewBuilderRoute() {
  state.builderStops = ensureCayyoluStart(state.builderStops);
  renderBuilderStops();
  const route = buildRouteFromBuilder(false);
  if (!route) return;

  clearMapRoute();
  addStopMarkers(route.stops.filter((stop) => Array.isArray(stop.coords)));
  if (route.coordinates.length > 1) {
    state.routeLine = drawRouteLine(route.coordinates, true);
  }
  fitRoute(route);
}

function saveBuilderRoute() {
  const route = buildRouteFromBuilder(true);
  if (!route) return;

  const storedRoutes = getStoredRoutes().filter((item) => item.id !== route.id);
  storedRoutes.push(route);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedRoutes));

  routes = mergeStoredRoutes(window.FEHO_ROUTES || []);
  state.selectedRouteId = route.id;
  populateDifficultyFilterReset();
  renderRouteList();
  selectRoute(route.id);
  setRouteStatus("Rota kaydedildi. Harita uygulamasında açabilir veya KML indirebilirsin.");
}

function buildRouteFromBuilder(showErrors) {
  const name = els.builderName.value.trim();

  if (!name) {
    if (showErrors) setRouteStatus("Rota adı gerekli.");
    return null;
  }

  const stops = ensureCayyoluStart(state.builderStops).filter((stop) => Array.isArray(stop.coords));
  if (stops.length < 2) {
    if (showErrors) setRouteStatus("Rota için en az 2 koordinatlı durak gerekli.");
    return null;
  }

  const baseRoute = state.builderRouteId ? getRoute(state.builderRouteId) : null;
  const id = state.builderRouteId || `custom-${Date.now()}`;

  return {
    id,
    name,
    description: "Kullanıcı tarafından oluşturulan rota.",
    startPoint: stops[0].name,
    endPoint: stops[stops.length - 1].name,
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: baseRoute?.difficulty || "özel",
    recommendedSeason: baseRoute?.recommendedSeason || "Planlanacak",
    roadCharacter: "Kullanıcı tarafından düzenlenen rota.",
    fuelServiceNote: "Yakıt/servis notu eklenecek.",
    googleMapsUrl: baseRoute?.googleMapsUrl || "",
    image: "assets/hero-cover.jpeg",
    isCustom: true,
    notes: ["Tarayıcıda oluşturuldu."],
    rideAdvice: "Sürüş öncesi yolu ve hava durumunu kontrol et.",
    riskWarnings: "Yol riski kullanıcı tarafından kontrol edilmeli.",
    coffeeFoodPhoto: "Durak notları kullanıcı tarafından tamamlanabilir.",
    stops,
    coordinates: stops.map((stop) => stop.coords)
  };
}

function clearBuilder() {
  state.builderRouteId = null;
  state.builderStops = [];
  els.builderName.value = "";
  els.stopName.value = "";
  els.stopCoords.value = "";
  renderBuilderStops();
}

function getMapAppUrl(route) {
  if (route.googleMapsUrl && !route.isCustom) {
    return route.googleMapsUrl;
  }

  const points = route.stops.filter((stop) => Array.isArray(stop.coords));

  if (points.length >= 2) {
    const origin = points[0].coords.join(",");
    const destination = points[points.length - 1].coords.join(",");
    const waypoints = points.slice(1, -1).map((stop) => stop.coords.join(",")).join("|");
    const waypointQuery = waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : "";
    return `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointQuery}`;
  }

  return route.googleMapsUrl || "https://www.google.com/maps";
}

function downloadKml(routeOrRoutes, filename) {
  if (!routeOrRoutes) return;

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
        <name>${xml(route.name)} - rota çizgisi</name>
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
        <description>${xml("Durak koordinatları eklenmeli. Harita linki: " + (route.googleMapsUrl || ""))}</description>
      </Placemark>`;

  const stops = route.stops
    .filter((stop) => Array.isArray(stop.coords))
    .map((stop, index) => `
      <Placemark>
        <name>${index + 1}. ${xml(stop.name)}</name>
        <description>${xml(`${stop.description || ""} ${stop.note || ""}`.trim())}</description>
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

function mergeStoredRoutes(staticRoutes) {
  const storedRoutes = getStoredRoutes();
  const byId = new Map(staticRoutes.map((route) => [route.id, route]));

  storedRoutes.forEach((route) => {
    byId.set(route.id, route);
  });

  return [...byId.values()].map((route) => ({
    ...route,
    coordinates: route.stops
      .filter((stop) => Array.isArray(stop.coords))
      .map((stop) => stop.coords)
  }));
}

function ensureCayyoluStart(stops) {
  const cleanedStops = stops
    .filter((stop) => Array.isArray(stop.coords))
    .map(cloneStop)
    .filter((stop) => !isCayyoluStop(stop));

  return [cloneStop(CAYYOLU_START), ...cleanedStops];
}

function cloneStop(stop) {
  return {
    ...stop,
    coords: Array.isArray(stop.coords) ? [...stop.coords] : null
  };
}

function isCayyoluStop(stop) {
  if (!Array.isArray(stop.coords)) return false;

  const [lat, lng] = stop.coords;
  return Math.abs(lat - CAYYOLU_START.coords[0]) < 0.0005
    && Math.abs(lng - CAYYOLU_START.coords[1]) < 0.0005;
}

function getStoredRoutes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function populateDifficultyFilterReset() {
  const current = els.difficultyFilter.value;
  els.difficultyFilter.innerHTML = '<option value="all">Tüm zorluklar</option>';
  populateDifficultyFilter();
  els.difficultyFilter.value = [...els.difficultyFilter.options].some((option) => option.value === current) ? current : "all";
}

function getSelectedRoute() {
  return getRoute(state.selectedRouteId);
}

function getRoute(routeId) {
  return routes.find((route) => route.id === routeId);
}

function getRouteLineCoordinates(route) {
  return Array.isArray(route.roadGeometry) && route.roadGeometry.length > 1
    ? route.roadGeometry
    : route.coordinates;
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

function parseCoords(value) {
  const match = String(value).trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  return [roundCoord(lat), roundCoord(lng)];
}

function detailMetric(label, value) {
  return `
    <div class="detail-metric">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function setRouteStatus(message) {
  els.routeStatus.textContent = message;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
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
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function roundCoord(value) {
  return Math.round(value * 1000000) / 1000000;
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
  buildKml,
  editSelected() {
    const route = getSelectedRoute();
    if (route) loadRouteIntoBuilder(route);
  },
  downloadSelected() {
    downloadKml(getSelectedRoute());
  }
};
