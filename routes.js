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

window.FEHO_ROUTES.forEach((route) => {
  route.coordinates = route.stops
    .filter((stop) => Array.isArray(stop.coords))
    .map((stop) => stop.coords);
});
