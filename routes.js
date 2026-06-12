// Feho's Motocycle Road rota arşivi.
// Yeni rota eklemek için bu listedeki bir objeyi kopyala, id/name/stops/coordinates alanlarını doldur.
// Google Maps kısa linklerinden otomatik koordinat çekilmez; yaklaşık yazılan noktalar `approximate: true` ile işaretlendi.

const CAYYOLU_START_POINT = "Çayyolu / Başlangıç";

function createCayyoluStartStop() {
  return {
    name: CAYYOLU_START_POINT,
    description: "Mevcut rota arşivinin ortak çıkış noktası.",
    coords: [39.8820606, 32.6893723],
    note: "Google Maps kaynak linki bu noktadan devam edecek şekilde düzenlenebilir."
  };
}

function routeStop(name, coords, description, note, extra = {}) {
  return {
    name,
    description,
    note,
    coords,
    approximate: true,
    ...extra
  };
}

window.FEHO_ROUTES = [
  {
    id: "ankara-camkoru-beypazari-loop",
    name: "ROTA-1 - Ankara - Kızılcahamam - Çamkoru - Beypazarı",
    description: "Ankara çıkışlı, orman yolları, yayla havası ve Beypazarı dönüş keyfini tek güne sığdıran uzun premium tur.",
    startPoint: "Çayyolu / Başlangıç",
    endPoint: "Raci Bademli Parkı / Ankara dönüş",
    distanceKm: 360,
    estimatedDuration: "5 sa 30 dk sürüş",
    rideMinutes: 330,
    breakMinutes: 120,
    totalMinutes: 450,
    difficulty: "orta",
    recommendedSeason: "İlkbahar, yaz, sonbahar",
    roadCharacter: "Orman geçişleri, yayla bağlantıları, virajlı asfalt ve ilçe içi sakin tempo.",
    fuelServiceNote: "Kızılcahamam, Beypazarı ve Ayaş yakıt/servis için en güvenli noktalar.",
    googleMapsUrl: "https://maps.app.goo.gl/5y3ds12TfeYtYML37",
    image: "assets/hero-cover.jpeg",
    isFavorite: true,
    notes: [
      "Yayla bağlantılarında asfalt kalitesi değişebilir.",
      "Beypazarı sonrası dönüşte gün batımı saatini hesapla."
    ],
    rideAdvice: "Sabah erken çık, Çamkoru ve Eğriova tarafında tempoyu düşür; manzara duraklarını kısa ama sık tut.",
    riskWarnings: "Yayla yollarında mıcır, traktör geçişi ve ani sis olabilir. Orman içi virajlarda kör noktalara dikkat.",
    coffeeFoodPhoto: "Kızılcahamam kahve molası, Çamkoru orman fotoğrafı, Beypazarı yemek/dinlenme molası.",
    stops: [
      {
        name: "Çayyolu / Başlangıç",
        description: "Her rota için 1 numaralı başlangıç noktası.",
        note: "Depo, lastik basıncı ve zincir kontrolü için son sakin nokta.",
        coords: [39.8820606, 32.6893723],
        favorite: true
      },
      {
        name: "Kızılcahamam",
        description: "İlk büyük mola ve yakıt alternatifi.",
        note: "Kısa kahve molası için iyi durak.",
        coords: [40.4697, 32.6506],
        approximate: true
      },
      {
        name: "Çamlıdere",
        description: "Yayla ve orman etaplarına geçiş kapısı.",
        note: "Market ve kısa ihtiyaç molası planlanabilir.",
        coords: [40.4896, 32.4746],
        approximate: true
      },
      {
        name: "Çamkoru Tabiat Parkı",
        description: "Orman içinde sakin tempo ve fotoğraf molası.",
        note: "Hafta sonu kalabalık olabilir.",
        coords: [40.5146, 32.4836],
        approximate: true,
        favorite: true
      },
      {
        name: "Ara koordinat noktası",
        description: "Kullanıcının rotada verdiği manuel koordinat.",
        note: "Bu nokta hassas koordinat olarak korundu.",
        coords: [40.4478629, 32.3049811]
      },
      {
        name: "Çamlıdere Benli Yaylası",
        description: "Yayla havası ve açık manzara.",
        note: "Yol şartı mevsime göre değişebilir.",
        coords: [40.555, 32.32],
        approximate: true
      },
      {
        name: "Eğriova Tabiat Parkı",
        description: "Göl/orman hissi veren rota durağı.",
        note: "Fotoğraf molası için değerli durak.",
        coords: [40.62, 32.064],
        approximate: true,
        favorite: true
      },
      {
        name: "Beypazarı",
        description: "Yemek, dinlenme ve yakıt için ana durak.",
        note: "Uzun dönüş öncesi mola süresini burada kullan.",
        coords: [40.1675, 31.9211],
        approximate: true
      },
      {
        name: "Ayaş",
        description: "Ankara dönüşünden önce son ilçe molası.",
        note: "Akşam dönüşünde trafik kontrolü yap.",
        coords: [40.0193, 32.3335],
        approximate: true
      },
      {
        name: "Raci Bademli Parkı / Ankara dönüş",
        description: "Dönüş ve kapanış noktası.",
        note: "Rotayı burada bitir, ekipmanları toparla.",
        coords: [39.8820606, 32.6893723]
      }
    ]
  },
  {
    id: "ayas-gudul-karagol-yayla",
    name: "ROTA-2 - Ankara - Ayaş - Güdül - Karagöl",
    description: "Göletler, kamp noktaları ve kuzey Ankara yaylalarını bağlayan uzun, keşif hissi yüksek rota.",
    startPoint: "Çayyolu / Başlangıç",
    endPoint: "Yıldırım Elören Köyü Yaylası",
    distanceKm: 330,
    estimatedDuration: "5 sa sürüş",
    rideMinutes: 300,
    breakMinutes: 150,
    totalMinutes: 450,
    difficulty: "zor",
    recommendedSeason: "Yaz ve erken sonbahar",
    roadCharacter: "Gölet bağlantıları, kırsal asfalt, kamp yolu ve yayla geçişleri.",
    fuelServiceNote: "Ayaş, Güdül ve Kızılcahamam dışında servis imkanı sınırlı kabul edilmeli.",
    googleMapsUrl: "https://maps.app.goo.gl/hmC6p52MifLXf7yc8",
    image: "assets/hero-cover.jpeg",
    isFavorite: true,
    notes: [
      "Kamp ekipmanı varsa yük dağılımını çıkıştan önce kontrol et.",
      "Yayla ve mesire alanlarında telefon çekimi zayıflayabilir."
    ],
    rideAdvice: "Güdül sonrası yakıtı ve suyu tamamla; Karagöl ve yayla etaplarında düşük vites, sakin çizgi ve bol mesafe bırak.",
    riskWarnings: "Yayla bağlantılarında gevşek zemin, hayvan geçişi ve ani hava değişimi olabilir.",
    coffeeFoodPhoto: "Ayaş kısa kahve, No9 Camping dinlenme, Karagöl fotoğraf ve Yıldırım Elören yayla gün batımı.",
    stops: [
      {
        name: "Çayyolu / Başlangıç",
        description: "Her rota için 1 numaralı başlangıç noktası.",
        note: "Uzun rota için depo tam başlamak iyi olur.",
        coords: [39.8820631, 32.6892643],
        favorite: true
      },
      {
        name: "Ayaş",
        description: "Batı çıkışındaki ilk ana durak.",
        note: "Kahve ve kısa ihtiyaç molası.",
        coords: [40.0193, 32.3335],
        approximate: true
      },
      {
        name: "Kirazdibi Göleti",
        description: "Gölet manzaralı ara durak.",
        note: "Fotoğraf için kısa mola.",
        coords: [40.158, 32.257],
        approximate: true,
        favorite: true
      },
      {
        name: "Güdül",
        description: "Kırsal etap öncesi toparlanma noktası.",
        note: "Su ve atıştırmalık tamamla.",
        coords: [40.2104, 32.2453],
        approximate: true
      },
      {
        name: "No9 Camping",
        description: "Kamp ve dinlenme karakterli durak.",
        note: "Uzun mola için uygun rota noktası.",
        coords: [40.245, 32.24],
        approximate: true,
        favorite: true
      },
      {
        name: "Kızılcahamam",
        description: "Servis, yakıt ve yemek için güçlü merkez.",
        note: "Sonraki göl/yayla kısmı için hazırlık.",
        coords: [40.4697, 32.6506],
        approximate: true
      },
      {
        name: "Füreyya Göleti",
        description: "Sakin gölet geçişi.",
        note: "Zemin kontrolü yaparak yaklaş.",
        coords: [40.535, 32.595],
        approximate: true
      },
      {
        name: "Karagöl",
        description: "Rotanın en fotojenik göl duraklarından biri.",
        note: "Hafta sonu kalabalık olabilir.",
        coords: [40.569, 32.642],
        approximate: true,
        favorite: true
      },
      {
        name: "Ay Kayası Mesire Alanı",
        description: "Mesire alanı ve kısa mola noktası.",
        note: "Dönüş planını burada tekrar kontrol et.",
        coords: [40.585, 32.705],
        approximate: true
      },
      {
        name: "Yıldırım Elören Köyü Yaylası",
        description: "Yayla bitiş noktası.",
        note: "Hava kararmadan dönüş ya da kamp kararı ver.",
        coords: [40.64, 32.78],
        approximate: true,
        favorite: true
      }
    ]
  },
  {
    id: "shortlink-srgczrt5",
    name: "ROTA-3 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak haritada durak eklenerek dolu rotaya çevrilebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Kaynak link mevcut; uygulama içi GeoJSON durakları eklenebilir.",
    fuelServiceNote: "Yakıt/servis notu manuel eklenecek.",
    googleMapsUrl: "https://maps.app.goo.gl/SRgcZRt5fKw2LBr96",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Kısa link kaynak olarak saklandı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Risk notları manuel keşif sonrası yazılacak.",
    coffeeFoodPhoto: "Kahve, yemek ve fotoğraf noktaları eklenecek.",
    stops: [createCayyoluStartStop()]
  },
  {
    id: "shortlink-4snox352",
    name: "ROTA-4 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak uygulama içinde düzenlenebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Kaynak link mevcut; uygulama içi GeoJSON durakları eklenebilir.",
    fuelServiceNote: "Yakıt/servis notu manuel eklenecek.",
    googleMapsUrl: "https://maps.app.goo.gl/4snox352yB9KXWYT9",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Bu kısa link rota verisi olarak saklandı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Yol riski henüz girilmedi.",
    coffeeFoodPhoto: "Keşif noktaları eklenecek.",
    stops: [createCayyoluStartStop()]
  },
  {
    id: "shortlink-usqazh6",
    name: "ROTA-5 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak uygulama içinde düzenlenebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Yayla/bağlantı karakteri manuel veri sonrası yazılacak.",
    fuelServiceNote: "Servis notu eksik.",
    googleMapsUrl: "https://maps.app.goo.gl/UsQAzH6u6wf3YAoQ9?g_st=iw",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Kısa link korundu, koordinat çıkarımı otomatik yapılmadı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Planlanacak.",
    coffeeFoodPhoto: "Planlanacak.",
    stops: [createCayyoluStartStop()]
  },
  {
    id: "shortlink-ergphj3-06",
    name: "ROTA-6 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak uygulama içinde düzenlenebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Kaynak link mevcut; uygulama içi GeoJSON durakları eklenebilir.",
    fuelServiceNote: "Yakıt/servis notu manuel eklenecek.",
    googleMapsUrl: "https://maps.app.goo.gl/eRgPHj3Bpx7Hq6RP7",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Kısa link korundu, koordinat çıkarımı otomatik yapılmadı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Planlanacak.",
    coffeeFoodPhoto: "Planlanacak.",
    stops: [createCayyoluStartStop()]
  },
  {
    id: "shortlink-r6hys8",
    name: "ROTA-7 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak uygulama içinde düzenlenebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Kamp karakteri manuel veri sonrası yazılacak.",
    fuelServiceNote: "Yakıt/servis notu manuel eklenecek.",
    googleMapsUrl: "https://maps.app.goo.gl/R6hyS8Ucq9dtmymw9",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Kısa link kaynak olarak saklandı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Planlanacak.",
    coffeeFoodPhoto: "Planlanacak.",
    stops: [createCayyoluStartStop()]
  },
  {
    id: "shortlink-hldd8",
    name: "ROTA-8 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak uygulama içinde düzenlenebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Kaynak link mevcut; uygulama içi GeoJSON durakları eklenebilir.",
    fuelServiceNote: "Yakıt/servis notu manuel eklenecek.",
    googleMapsUrl: "https://maps.app.goo.gl/HLDD8sg5Wtj9BZMK6",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Bu kısa link rota verisi olarak saklandı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Planlanacak.",
    coffeeFoodPhoto: "Planlanacak.",
    stops: [createCayyoluStartStop()]
  },
  {
    id: "shortlink-b3f4v",
    name: "ROTA-9 - Kaynak Link Taslağı",
    description: "Kısa link kaynak olarak kayıtlı; bu örnek taslak uygulama içinde düzenlenebilir.",
    startPoint: CAYYOLU_START_POINT,
    endPoint: "Planlanacak",
    distanceKm: null,
    estimatedDuration: "Planlanacak",
    rideMinutes: null,
    breakMinutes: null,
    totalMinutes: null,
    difficulty: "taslak",
    recommendedSeason: "Planlanacak",
    roadCharacter: "Kaynak link mevcut; uygulama içi GeoJSON durakları eklenebilir.",
    fuelServiceNote: "Yakıt/servis notu manuel eklenecek.",
    googleMapsUrl: "https://maps.app.goo.gl/b3f4VUrnfoiPCqnf8",
    image: "assets/hero-cover.jpeg",
    isLinkRoute: true,
    notes: ["Rota arşivinin son kısa link kaydı."],
    rideAdvice: "Uygulama içinde durak ekleyerek GeoJSON/KML rotası oluştur.",
    riskWarnings: "Planlanacak.",
    coffeeFoodPhoto: "Planlanacak.",
    stops: [createCayyoluStartStop()]
  }
];

function fillRouteByLink(googleMapsUrl, details) {
  const route = window.FEHO_ROUTES.find((item) => item.googleMapsUrl === googleMapsUrl);
  if (!route) return;

  Object.assign(route, {
    ...details,
    startPoint: CAYYOLU_START_POINT,
    image: "assets/hero-cover.jpeg",
    isLinkRoute: false,
    isFavorite: Boolean(details.isFavorite),
    notes: [
      "Google Maps kısa linki kaynak olarak saklandı.",
      "Durak koordinatları uygulama içinde düzenlenebilir ve GeoJSON/KML olarak indirilebilir."
    ],
    coordinates: details.stops
      .filter((stop) => Array.isArray(stop.coords))
      .map((stop) => stop.coords)
  });
}

fillRouteByLink("https://maps.app.goo.gl/SRgcZRt5fKw2LBr96", {
  name: "ROTA-3 - Kızılcahamam - Gerede - Beypazarı Loop",
  description: "Çayyolu çıkışlı, Kızılcahamam orman hattından Gerede platosuna uzanıp Beypazarı ve Ayaş üzerinden kapanan uzun loop.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 430,
  estimatedDuration: "7 sa sürüş",
  rideMinutes: 420,
  breakMinutes: 150,
  totalMinutes: 570,
  difficulty: "zor",
  recommendedSeason: "İlkbahar, yaz, sonbahar",
  roadCharacter: "Uzun asfalt geçişleri, orman yolları, yayla bağlantıları ve geniş loop temposu.",
  fuelServiceNote: "Kızılcahamam, Gerede, Beypazarı ve Ayaş yakıt için ana güvenli duraklar.",
  rideAdvice: "Sabah erken çık; Gerede ve Dörtdivan hattında hava serinleyebilir, Beypazarı dönüşünde yorgunluk payı bırak.",
  riskWarnings: "Orman ve yayla geçişlerinde mıcır, sis ve hayvan geçişi olabilir.",
  coffeeFoodPhoto: "Kızılcahamam kahve, Dörtdivan orman fotoğrafı, Beypazarı yemek molası.",
  isFavorite: true,
  stops: [
    createCayyoluStartStop(),
    routeStop("Kahramankazan", [40.2043, 32.6814], "Kuzey çıkışında ritim toplama noktası.", "Trafik sonrası kısa kontrol."),
    routeStop("Kızılcahamam", [40.4697, 32.6506], "İlk büyük mola ve yakıt alternatifi.", "Kahve ve yakıt için iyi merkez.", { favorite: true }),
    routeStop("Çamlıdere", [40.4896, 32.4746], "Yayla bağlantılarına geçiş kapısı.", "Tempo düşür, orman hattı başlıyor."),
    routeStop("Benli Yaylası", [40.555, 32.32], "Açık yayla havası ve manzara.", "Zemin mevsime göre değişebilir.", { favorite: true }),
    routeStop("Gerede Güney Geçişi", [40.756, 32.294], "Rotanın kuzey platosu.", "Hava değişimine dikkat."),
    routeStop("Dörtdivan Orman Hattı", [40.7202, 32.0632], "Orman içi virajlı bağlantı.", "Kör virajlarda temkinli sür."),
    routeStop("Beypazarı", [40.1675, 31.9211], "Yemek ve uzun mola merkezi.", "Dönüş öncesi dinlen.", { favorite: true }),
    routeStop("Ayaş", [40.0193, 32.3335], "Ankara dönüşünden önce son ilçe molası.", "Akşam trafiğini kontrol et."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

fillRouteByLink("https://maps.app.goo.gl/4snox352yB9KXWYT9", {
  name: "ROTA-4 - Beypazarı - Nallıhan - Sarıyar Loop",
  description: "Batı Ankara hattında Beypazarı, Nallıhan ve Sarıyar baraj çevresini bağlayan manzaralı uzun tur.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 360,
  estimatedDuration: "6 sa sürüş",
  rideMinutes: 360,
  breakMinutes: 130,
  totalMinutes: 490,
  difficulty: "zor",
  recommendedSeason: "İlkbahar ve sonbahar",
  roadCharacter: "Kırsal asfalt, vadi geçişleri, baraj manzarası ve uzun dönüş temposu.",
  fuelServiceNote: "Ayaş, Beypazarı ve Nallıhan dışında yakıtı sınırlı düşün.",
  rideAdvice: "Beypazarı sonrası menzilini kontrol et; baraj hattında fotoğraf molasını kısa tut.",
  riskWarnings: "Vadi yollarında yol yüzeyi ve rüzgar değişebilir.",
  coffeeFoodPhoto: "Beypazarı yemek, Nallıhan fotoğraf, Sarıyar baraj manzarası.",
  stops: [
    createCayyoluStartStop(),
    routeStop("Ayaş", [40.0193, 32.3335], "Batı çıkışının ilk molası.", "Kısa kahve için uygun."),
    routeStop("Beypazarı", [40.1675, 31.9211], "Ana yemek ve yakıt durağı.", "Uzun rotaya burada hazırlan.", { favorite: true }),
    routeStop("İnözü Vadisi", [40.178, 31.903], "Vadi manzaralı kısa durak.", "Fotoğraf molası."),
    routeStop("Nallıhan", [40.1853, 31.3519], "Batıdaki ana ilçe durağı.", "Yakıt ve su tamamla.", { favorite: true }),
    routeStop("Nallıhan Kuş Cenneti", [40.141, 31.658], "Renkli jeolojik manzara.", "Yol kenarı duruşlarında dikkat."),
    routeStop("Sarıyar Barajı", [40.036, 31.423], "Baraj çevresi manzaralı geçiş.", "Rüzgar ve ağır araçlara dikkat."),
    routeStop("Güdül", [40.2104, 32.2453], "Kırsal dönüş bağlantısı.", "Son dönüş öncesi toparlan."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

fillRouteByLink("https://maps.app.goo.gl/UsQAzH6u6wf3YAoQ9?g_st=iw", {
  name: "ROTA-5 - Ayaş - Güdül - Sorgun - Kızılcahamam",
  description: "Ayaş ve Güdül kırsalından Sorgun gölet hattına, oradan Kızılcahamam üzerinden Ankara'ya dönen keyifli loop.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 300,
  estimatedDuration: "5 sa sürüş",
  rideMinutes: 300,
  breakMinutes: 120,
  totalMinutes: 420,
  difficulty: "orta",
  recommendedSeason: "İlkbahar, yaz, sonbahar",
  roadCharacter: "Gölet geçişleri, kırsal asfalt, yayla hissi ve rahat dönüş.",
  fuelServiceNote: "Ayaş, Güdül ve Kızılcahamam yakıt/servis için ana duraklar.",
  rideAdvice: "Sorgun ve Çamlıdere çevresinde tempoyu sakin tut; orman geçişlerinde görüşü koru.",
  riskWarnings: "Gölet çevresinde gevşek zemin ve hafta sonu araç trafiği olabilir.",
  coffeeFoodPhoto: "Ayaş kahve, Sorgun gölet fotoğrafı, Kızılcahamam yemek.",
  stops: [
    createCayyoluStartStop(),
    routeStop("Ayaş", [40.0193, 32.3335], "İlk kısa mola.", "Kahve ve su tamamla."),
    routeStop("Güdül", [40.2104, 32.2453], "Kırsal etap merkezi.", "Yavaş tempo başlar."),
    routeStop("Uruş", [40.249, 32.128], "Kırsal bağlantı noktası.", "Dar yollara dikkat."),
    routeStop("Sorgun Göleti", [40.386, 32.131], "Gölet ve doğa molası.", "Fotoğraf için güçlü nokta.", { favorite: true }),
    routeStop("Çamlıdere", [40.4896, 32.4746], "Orman hattına geçiş.", "Yaklaşırken zemini oku."),
    routeStop("Kızılcahamam", [40.4697, 32.6506], "Yakıt ve yemek durağı.", "Dönüş öncesi mola.", { favorite: true }),
    routeStop("Kahramankazan", [40.2043, 32.6814], "Ankara öncesi son geçiş.", "Trafiğe göre dönüş seç."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

fillRouteByLink("https://maps.app.goo.gl/eRgPHj3Bpx7Hq6RP7", {
  name: "ROTA-6 - Çamlıdere - Benli - Eğriova Loop",
  description: "Çamlıdere ve Benli Yaylası üzerinden Eğriova doğasına ulaşıp Beypazarı-Ayaş hattından dönen yayla rotası.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 340,
  estimatedDuration: "5 sa 45 dk sürüş",
  rideMinutes: 345,
  breakMinutes: 135,
  totalMinutes: 480,
  difficulty: "zor",
  recommendedSeason: "Yaz ve erken sonbahar",
  roadCharacter: "Yayla bağlantısı, orman geçişi, virajlı asfalt ve kırsal dönüş.",
  fuelServiceNote: "Kızılcahamam ve Beypazarı güvenli yakıt noktalarıdır.",
  rideAdvice: "Benli ve Eğriova etaplarında hava ve yol zeminini sık kontrol et.",
  riskWarnings: "Yayla yollarında mıcır, düşük görüş ve hayvan geçişi olabilir.",
  coffeeFoodPhoto: "Çamlıdere kısa mola, Eğriova fotoğraf, Beypazarı yemek.",
  stops: [
    createCayyoluStartStop(),
    routeStop("Kahramankazan", [40.2043, 32.6814], "Kuzey çıkışı.", "Trafik sonrası toparlan."),
    routeStop("Kızılcahamam", [40.4697, 32.6506], "Yakıt ve ilk mola.", "Yayla öncesi hazırlık."),
    routeStop("Çamlıdere", [40.4896, 32.4746], "Yayla geçişinin kapısı.", "Market ve su molası."),
    routeStop("Benli Yaylası", [40.555, 32.32], "Açık manzaralı yayla.", "Rüzgar ve zemine dikkat.", { favorite: true }),
    routeStop("Eğriova Tabiat Parkı", [40.62, 32.064], "Orman ve göl karakterli durak.", "Fotoğraf molası.", { favorite: true }),
    routeStop("Beypazarı", [40.1675, 31.9211], "Uzun mola ve yemek.", "Dönüş öncesi dinlen."),
    routeStop("Ayaş", [40.0193, 32.3335], "Son ilçe geçişi.", "Akşam dönüşünü planla."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

fillRouteByLink("https://maps.app.goo.gl/R6hyS8Ucq9dtmymw9", {
  name: "ROTA-7 - Karagöl - Işık Dağı - Çubuk Loop",
  description: "Kızılcahamam, Karagöl ve Işık Dağı hattını Çubuk kırsalıyla bağlayan kuzey Ankara keşif rotası.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 310,
  estimatedDuration: "5 sa 20 dk sürüş",
  rideMinutes: 320,
  breakMinutes: 120,
  totalMinutes: 440,
  difficulty: "zor",
  recommendedSeason: "Yaz ve sonbahar",
  roadCharacter: "Dağ yolu, göl çevresi, orman geçişi ve kırsal asfalt.",
  fuelServiceNote: "Kızılcahamam ve Çubuk yakıt için ana güvenli noktalardır.",
  rideAdvice: "Karagöl çevresinde yaya/araç hareketine dikkat; dağ yolunda acele etme.",
  riskWarnings: "Dağ geçişlerinde sis, soğuk ve gevşek zemin olabilir.",
  coffeeFoodPhoto: "Karagöl fotoğraf, Işık Dağı manzara, Çubuk yemek molası.",
  stops: [
    createCayyoluStartStop(),
    routeStop("Kahramankazan", [40.2043, 32.6814], "Kuzey bağlantısı.", "Rota ritmini burada kur."),
    routeStop("Kızılcahamam", [40.4697, 32.6506], "Yakıt ve kahve.", "Dağ hattı öncesi mola."),
    routeStop("Karagöl", [40.569, 32.642], "Fotojenik göl durağı.", "Kalabalığa dikkat.", { favorite: true }),
    routeStop("Işık Dağı Geçişi", [40.63, 32.83], "Dağ ve orman geçişi.", "Serin hava ve sis olabilir.", { favorite: true }),
    routeStop("Çubuk", [40.2386, 33.0324], "Kırsal dönüş merkezi.", "Yakıt/servis için uygun."),
    routeStop("Akyurt", [40.135, 33.086], "Ankara dönüş bağlantısı.", "Trafik kontrolü yap."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

fillRouteByLink("https://maps.app.goo.gl/HLDD8sg5Wtj9BZMK6", {
  name: "ROTA-8 - Nallıhan - Davutoğlan - Beypazarı Loop",
  description: "Batı Ankara'nın uzun manzara rotası: Beypazarı, Nallıhan, Davutoğlan ve kırsal dönüş bağlantıları.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 390,
  estimatedDuration: "6 sa 30 dk sürüş",
  rideMinutes: 390,
  breakMinutes: 150,
  totalMinutes: 540,
  difficulty: "zor",
  recommendedSeason: "İlkbahar ve sonbahar",
  roadCharacter: "Uzun kırsal asfalt, vadi geçişleri ve baraj çevresi.",
  fuelServiceNote: "Beypazarı ve Nallıhan dışında yakıtı planlı kullan.",
  rideAdvice: "Bu rotayı gün ışığında tamamla; batı etaplarında mola süresini kontrollü tut.",
  riskWarnings: "Uzun etap yorgunluğu, rüzgar ve kırsal yollarda ağır araç olabilir.",
  coffeeFoodPhoto: "Beypazarı yemek, Nallıhan manzara, Davutoğlan fotoğraf.",
  stops: [
    createCayyoluStartStop(),
    routeStop("Ayaş", [40.0193, 32.3335], "Batı çıkışı.", "Kısa mola."),
    routeStop("Beypazarı", [40.1675, 31.9211], "Yemek ve yakıt.", "Uzun etap öncesi hazırlık.", { favorite: true }),
    routeStop("Nallıhan", [40.1853, 31.3519], "Batıdaki ana merkez.", "Yakıt ve su tamamla."),
    routeStop("Davutoğlan Kuş Alanı", [40.102, 31.635], "Manzara ve fotoğraf noktası.", "Yol kenarında dikkatli dur.", { favorite: true }),
    routeStop("Sarıyar Baraj Geçişi", [40.036, 31.423], "Baraj çevresi virajlı geçiş.", "Rüzgara dikkat."),
    routeStop("Güdül", [40.2104, 32.2453], "Kırsal dönüş bağlantısı.", "Son uzun mola."),
    routeStop("Ayaş Dönüş", [40.0193, 32.3335], "Ankara yaklaşımı.", "Trafik durumunu kontrol et."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

fillRouteByLink("https://maps.app.goo.gl/b3f4VUrnfoiPCqnf8", {
  name: "ROTA-9 - Ayaş - Uruş - Güdül Mini Loop",
  description: "Çayyolu'ndan hızlı çıkılıp Ayaş, Uruş ve Güdül kırsalıyla tamamlanan daha kısa ama keyifli batı loop'u.",
  endPoint: CAYYOLU_START_POINT,
  distanceKm: 210,
  estimatedDuration: "3 sa 45 dk sürüş",
  rideMinutes: 225,
  breakMinutes: 90,
  totalMinutes: 315,
  difficulty: "orta",
  recommendedSeason: "Dört mevsim, kuru havada daha keyifli",
  roadCharacter: "Kısa kırsal asfalt, ilçe bağlantıları ve rahat dönüş.",
  fuelServiceNote: "Ayaş ve Güdül yakıt/market için yeterli kabul edilebilir.",
  rideAdvice: "Kısa rota gibi görünse de kırsal bağlantılarda tempoyu abartma.",
  riskWarnings: "Köy yollarında traktör, gevşek zemin ve hayvan geçişi olabilir.",
  coffeeFoodPhoto: "Ayaş kahve, Uruş kırsal fotoğraf, Güdül kısa mola.",
  stops: [
    createCayyoluStartStop(),
    routeStop("Ayaş", [40.0193, 32.3335], "İlk mola ve kahve noktası.", "Kısa şehir dışı ritmi."),
    routeStop("Sinanlı", [40.077, 32.244], "Kırsal bağlantı.", "Dar yol ve köy trafiğine dikkat."),
    routeStop("Uruş", [40.249, 32.128], "Kırsal loop durağı.", "Fotoğraf için kısa mola.", { favorite: true }),
    routeStop("Güdül", [40.2104, 32.2453], "İlçe merkezi ve mola.", "Su ve atıştırmalık tamamla."),
    routeStop("Kirazdibi Göleti", [40.158, 32.257], "Gölet manzarası.", "Sakin fotoğraf molası.", { favorite: true }),
    routeStop("Ayaş Dönüş", [40.0193, 32.3335], "Batı dönüş kapısı.", "Trafiğe göre çıkış seç."),
    routeStop("Çayyolu / Bitiş", [39.8820606, 32.6893723], "Loop kapanış noktası.", "Rota burada tamamlanır.", { approximate: false })
  ]
});

window.FEHO_ROUTES.forEach((route) => {
  route.coordinates = route.stops
    .filter((stop) => Array.isArray(stop.coords))
    .map((stop) => stop.coords);
});
