const STORAGE_KEY = "feho_motocycle_routes";
const ROUTE_SCHEMA_VERSION = "20260612-full-routes";
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
  builderForceCayyoluStart: false,
  pickingOnMap: false
};

const els = {
  routeList: document.querySelector("#routeList"),
  searchInput: document.querySelector("#searchInput"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  detailPanel: document.querySelector("#detailPanel"),
  openMapAppButton: document.querySelector("#openMapAppButton"),
  fitRouteButton: document.querySelector("#fitRouteButton"),
  downloadSelectedKml: document.querySelector("#downloadSelectedKml"),
  downloadSelectedGeoJson: document.querySelector("#downloadSelectedGeoJson"),
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
  els.openMapAppButton.addEventListener("click", () => focusSelectedRoute());
  els.downloadSelectedKml.addEventListener("click", () => downloadKml(getSelectedRoute()));
  els.downloadSelectedGeoJson.addEventListener("click", () => downloadGeoJson(getSelectedRoute()));
  els.downloadAllKml.addEventListener("click", () => downloadKml(routes, "fehos-motocycle-road-routes.kml"));
  els.streetMapButton.addEventListener("click", () => setBaseLayer("street"));
  els.satelliteMapButton.addEventListener("click", () => setBaseLayer("satellite"));
  els.startNewRoute.addEventListener("click", startBlankRoute);
  els.pickOnMap.addEventListener("click", toggleMapPicking);
  els.addStop.addEventListener("click", addManualStop);
  els.saveBuilderRoute.addEventListener("click", saveBuilderRoute);
  els.clearBuilder.addEventListener("click", clearBuilder);

  els.routeList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      event.preventDefault();
      event.stopPropagation();
    }

    const card = event.target.closest(".route-card");
    if (!card) return;

    const action = actionButton?.dataset.action || "open";
    const route = getRoute(card.dataset.routeId);
    if (!route) return;

    if (action === "map") {
      selectRoute(route.id);
      focusSelectedRoute();
      return;
    }

    if (action === "edit") {
      loadRouteIntoBuilder(route);
      return;
    }

    selectRoute(route.id);
  });

  els.detailPanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail-action]");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const action = button.dataset.detailAction;
    if (action === "edit") loadRouteIntoBuilder(getSelectedRoute());
    if (action === "map") focusSelectedRoute();
    if (action === "kml") downloadKml(getSelectedRoute());
    if (action === "geojson") downloadGeoJson(getSelectedRoute());
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
        ${renderRoutePills(route)}
      </div>
      <h3>${escapeHtml(route.name)}</h3>
      <p>${escapeHtml(route.description)}</p>
      <div class="route-meta">
        ${getRouteMeta(route).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="button primary small-button" type="button" data-action="open">Aç</button>
        <button class="button secondary small-button" type="button" data-action="edit">Düzenle</button>
        <button class="button secondary small-button" type="button" data-action="map">Haritada Aç</button>
      </div>
    </article>
  `).join("");
}

function renderRoutePills(route) {
  const pills = [];

  if (route.isFavorite) pills.push({ label: "Favori", className: "favorite" });
  if (route.isCustom) pills.push({ label: "Benim rotam", className: "" });
  if (route.isLinkRoute) pills.push({ label: "Kaynak rota", className: "" });
  if (!route.isLinkRoute && route.coordinates.length > 1) pills.push({ label: "Dolu rota", className: "" });

  return pills
    .map((pill) => `<span class="pill ${pill.className}">${escapeHtml(pill.label)}</span>`)
    .join("");
}

function getRouteMeta(route) {
  if (route.isLinkRoute && route.coordinates.length <= 1) {
    return [
      "Kaynak rota",
      "1. durak Çayyolu",
      "GeoJSON'a hazır"
    ];
  }

  return [
    formatDistance(route.distanceKm),
    formatNullableMinutes(route.rideMinutes, route.estimatedDuration || "Süre hesaplanacak"),
    `${route.stops.length} durak`
  ];
}

function renderDetailMetrics(route) {
  const metrics = route.isLinkRoute && route.coordinates.length <= 1
    ? [
        ["Durum", "Kaynak rota"],
        ["Başlangıç", "Çayyolu"],
        ["Format", "GeoJSON/KML"],
        ["Durak", String(route.stops.length)]
      ]
    : [
        ["Mesafe", formatDistance(route.distanceKm)],
        ["Sürüş", formatNullableMinutes(route.rideMinutes, route.estimatedDuration || "Süre hesaplanacak")],
        ["Mola", formatNullableMinutes(route.breakMinutes, "Mola eklenebilir")],
        ["Durak", String(route.stops.length)]
      ];

  return metrics.map(([label, value]) => detailMetric(label, value)).join("");
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

  setRouteStatus("Örnek rota kaynak linki kayıtlı. Çayyolu başlangıcı haritada görünüyor; çizgi için Durakları Düzenle ile GeoJSON durakları ekle.");
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
      }),
      zIndexOffset: (stopsWithCoords.length - index) * 100
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
        ${renderRoutePills(route)}
      </div>
      <h2>${escapeHtml(route.name)}</h2>
      <p>${escapeHtml(route.description)}</p>
    </div>

    <div class="detail-grid">
      ${renderDetailMetrics(route)}
    </div>

    <div class="card-actions">
      <button class="button primary small-button" type="button" data-detail-action="edit">Durakları Düzenle</button>
      <button class="button secondary small-button" type="button" data-detail-action="map">Haritada Aç</button>
      <button class="button secondary small-button" type="button" data-detail-action="kml">KML indir</button>
      <button class="button secondary small-button" type="button" data-detail-action="geojson">GeoJSON</button>
    </div>

    ${renderStops(route.stops)}
  `;
}

function renderStops(stops) {
  if (!stops.length) {
    return "<div class='empty-state'>Bu örnek kaynak link olarak kayıtlı. Dolu bir çizim için Durakları Düzenle ile haritadan nokta seç veya koordinat gir.</div>";
  }

  return `
    <ol class="stops-list">
      ${stops.map((stop, index) => `
        <li class="stop-item">
          <span class="stop-number">${index + 1}</span>
          <div>
            <h4>${escapeHtml(stop.name)}</h4>
            <p>${Array.isArray(stop.coords) ? `${stop.coords[0].toFixed(6)}, ${stop.coords[1].toFixed(6)}` : "Koordinat yok"}</p>
          </div>
        </li>
      `).join("")}
    </ol>
  `;
}

function startBlankRoute() {
  state.builderRouteId = null;
  state.builderForceCayyoluStart = false;
  state.builderStops = [];
  els.builderName.value = `ROTA-${routes.length + 1} - Yeni Loop`;
  renderBuilderStops();
  clearMapRoute();
  setRouteStatus("Yeni rota modu: ilk durak nereye tıklarsan orası olur. Kayıt GeoJSON/GeoPandas uyumlu hazırlanır.");
}

function loadRouteIntoBuilder(route) {
  selectRoute(route.id);
  state.builderRouteId = route.id;
  state.builderForceCayyoluStart = !route.isCustom;
  state.builderStops = state.builderForceCayyoluStart
    ? ensureCayyoluStart(route.stops.map(cloneStop))
    : route.stops.map(cloneStop);
  els.builderName.value = route.name;
  renderBuilderStops();
  setRouteStatus(state.builderForceCayyoluStart
    ? "Mevcut rota modu: Çayyolu 1. durak olarak korunur."
    : "Düzenleme modu: başlangıç dahil durakları istediğin gibi düzenleyebilirsin.");
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
  if (state.builderForceCayyoluStart) {
    state.builderStops = ensureCayyoluStart(state.builderStops);
    renderBuilderStops();
  }
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
  setRouteStatus("Rota kaydedildi. Haritada açabilir veya KML indirebilirsin.");
}

function focusSelectedRoute() {
  const route = getSelectedRoute();
  if (!route) return;

  if (route.coordinates.length) {
    fitRoute(route);
    setRouteStatus("Rota site içindeki Leaflet/GeoJSON haritasında açıldı.");
    return;
  }

  setRouteStatus("Bu örnek kaynak link olarak kayıtlı. Site haritasında çizmek için önce durak ekle.");
}

function buildRouteFromBuilder(showErrors) {
  const name = els.builderName.value.trim();

  if (!name) {
    if (showErrors) setRouteStatus("Rota adı gerekli.");
    return null;
  }

  const rawStops = state.builderStops.map(cloneStop);
  const stops = (state.builderForceCayyoluStart ? ensureCayyoluStart(rawStops) : rawStops)
    .filter((stop) => Array.isArray(stop.coords));
  if (stops.length < 2) {
    if (showErrors) setRouteStatus("Rota için en az 2 koordinatlı durak gerekli.");
    return null;
  }

  const baseRoute = state.builderRouteId ? getRoute(state.builderRouteId) : null;
  const id = state.builderRouteId || `custom-${Date.now()}`;
  const distanceKm = calculateRouteDistanceKm(stops.map((stop) => stop.coords));
  const rideMinutes = estimateRideMinutes(distanceKm);
  const breakMinutes = Math.max(15, stops.length * 10);

  return {
    id,
    name,
    description: "Kullanıcı tarafından oluşturulan GeoJSON/GeoPandas uyumlu rota.",
    startPoint: stops[0].name,
    endPoint: stops[stops.length - 1].name,
    distanceKm,
    estimatedDuration: formatMinutes(rideMinutes),
    rideMinutes,
    breakMinutes,
    totalMinutes: rideMinutes + breakMinutes,
    difficulty: baseRoute?.difficulty || "özel",
    recommendedSeason: baseRoute?.recommendedSeason || "Kullanıcı seçer",
    roadCharacter: "Kullanıcı tarafından düzenlenen rota.",
    fuelServiceNote: "Yakıt/servis notu eklenecek.",
    googleMapsUrl: baseRoute?.googleMapsUrl || "",
    image: "assets/hero-cover.jpeg",
    isCustom: true,
    schemaVersion: ROUTE_SCHEMA_VERSION,
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
  state.builderForceCayyoluStart = false;
  state.builderStops = [];
  els.builderName.value = "";
  els.stopName.value = "";
  els.stopCoords.value = "";
  renderBuilderStops();
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

function downloadGeoJson(routeOrRoutes, filename) {
  if (!routeOrRoutes) return;

  const selectedRoutes = Array.isArray(routeOrRoutes) ? routeOrRoutes : [routeOrRoutes];
  const geojson = buildGeoJson(selectedRoutes);
  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/geo+json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${slugify(selectedRoutes[0].name)}.geojson`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildGeoJson(selectedRoutes) {
  return {
    type: "FeatureCollection",
    name: "Feho's Motocycle Road",
    features: selectedRoutes.flatMap(routeToGeoJsonFeatures)
  };
}

function routeToGeoJsonFeatures(route) {
  const features = [];
  const lineCoordinates = getRouteLineCoordinates(route);

  if (lineCoordinates.length > 1) {
    features.push({
      type: "Feature",
      properties: {
        id: route.id,
        name: route.name,
        kind: "route-line",
        source: route.googleMapsUrl || "local",
        difficulty: route.difficulty
      },
      geometry: {
        type: "LineString",
        coordinates: lineCoordinates.map(([lat, lng]) => [lng, lat])
      }
    });
  } else {
    features.push({
      type: "Feature",
      properties: {
        id: route.id,
        name: route.name,
        kind: "source-link",
        source: route.googleMapsUrl || "local",
        difficulty: route.difficulty
      },
      geometry: null
    });
  }

  route.stops
    .filter((stop) => Array.isArray(stop.coords))
    .forEach((stop, index) => {
      features.push({
        type: "Feature",
        properties: {
          routeId: route.id,
          routeName: route.name,
          stopIndex: index + 1,
          name: stop.name,
          kind: "stop"
        },
        geometry: {
          type: "Point",
          coordinates: [stop.coords[1], stop.coords[0]]
        }
      });
    });

  return features;
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
        <name>${xml(route.name)} - koordinat yok</name>
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
  const staticIds = new Set(staticRoutes.map((route) => route.id));
  const byId = new Map(staticRoutes.map((route) => [route.id, normalizeRoute(route)]));

  storedRoutes.forEach((route) => {
    if (!route?.id) return;

    if (staticIds.has(route.id) && !isUserEditedSeedRoute(route)) {
      return;
    }

    byId.set(route.id, normalizeRoute(route));
  });

  return [...byId.values()];
}

function normalizeRoute(route) {
  const stops = Array.isArray(route.stops) ? route.stops.map(cloneStop) : [];
  return {
    ...route,
    stops,
    coordinates: stops
      .filter((stop) => Array.isArray(stop.coords))
      .map((stop) => stop.coords)
  };
}

function isUserEditedSeedRoute(route) {
  if (route.schemaVersion !== ROUTE_SCHEMA_VERSION) return false;
  if (!route.isCustom) return false;
  if (!Array.isArray(route.stops) || route.stops.length < 2) return false;
  return route.stops.every((stop) => Array.isArray(stop.coords));
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

function calculateRouteDistanceKm(coordinates) {
  const total = coordinates.reduce((sum, point, index) => {
    if (!index) return sum;
    return sum + haversineKm(coordinates[index - 1], point);
  }, 0);

  return Math.max(1, Math.round(total));
}

function haversineKm([lat1, lng1], [lat2, lng2]) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function estimateRideMinutes(distanceKm) {
  const minutes = Math.max(15, Math.round((distanceKm / 55) * 60));
  return Math.ceil(minutes / 5) * 5;
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
  return Number(value) ? `${value} km` : "Mesafe eklenebilir";
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
  buildGeoJson,
  focusSelected: focusSelectedRoute,
  editSelected() {
    const route = getSelectedRoute();
    if (route) loadRouteIntoBuilder(route);
  },
  downloadSelected() {
    downloadKml(getSelectedRoute());
  },
  downloadSelectedGeoJson() {
    downloadGeoJson(getSelectedRoute());
  }
};
