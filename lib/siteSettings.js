const STORAGE_KEY = "bali-stars-sofa-site-settings";

export const defaultHeroSlides = [
  {
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Koleksi Musim Ini",
    title: "Living, Curated.",
    subtitle: "Perlengkapan rumah dan gaya hidup pilihan, dikurasi untuk keseharian yang lebih indah.",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Edisi Terbatas",
    title: "Detail Yang Berarti.",
    subtitle: "Setiap produk dipilih karena kualitas, karakter, dan ceritanya.",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Kirim Ke Seluruh Indonesia",
    title: "Belanja Dengan Tenang.",
    subtitle: "Pengiriman aman, pembayaran terpercaya, layanan yang mengerti Anda.",
  },
];

export const defaultHomeSettings = {
  introEyebrow: "Selamat Datang di Bali Stars Sofa",
  introTitle: "Kami percaya rumah yang indah dimulai dari barang-barang yang dipilih dengan sengaja.",
  introSubtitle:
    "Temukan koleksi pilihan yang menghadirkan kenyamanan, gaya, dan kualitas di setiap sudut rumah Anda.",
};

export const defaultAboutSettings = {
  heroImageUrl:
    "https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=2000&auto=format&fit=crop",
  heroEyebrow: "Cerita Kami",
  heroTitle: "Tentang Bali Stars Sofa",
  heroSubtitle:
    "Kami menghadirkan pengalaman belanja online yang tenang, kurasi produk bermutu, dan layanan personal untuk setiap rumah.",
  sectionEyebrow: "Sejak Awal",
  sectionHeading: "Berawal dari keinginan sederhana: rumah yang terasa seperti diri sendiri.",
  sectionBody1:
    "Bali Stars Sofa hadir sebagai tempat belanja retail online yang menghadirkan produk-produk pilihan untuk kebutuhan fashion, rumah tangga, kecantikan, dan gaya hidup sehari-hari.",
  sectionBody2:
    "Kami percaya belanja seharusnya terasa tenang, bukan terburu-buru — seperti berjalan di lorong toko favorit yang sudah mengenal selera Anda.",
  secondaryImageUrl:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop",
  locationTitle: "Kunjungi Bali Stars Sofa",
  locationAddress: "Jl. Pura Banyu Kuning No.8, Padangsambian, Kec. Denpasar Bar., Kota Denpasar, Bali 80119",
  locationCity: "Denpasar, Bali",
  locationPhone: "081234567890",
  locationHours: "Senin–Sabtu 09.00–18.00",
  values: [
    {
      title: "Dikurasi, Bukan Ditumpuk",
      desc: "Setiap produk melewati proses seleksi ketat sebelum layak disebut bagian dari koleksi Bali Stars Sofa.",
    },
    {
      title: "Kualitas di Setiap Detail",
      desc: "Kami bekerja sama dengan pengrajin dan mitra terpercaya yang mengutamakan mutu di atas kuantitas.",
    },
    {
      title: "Layanan yang Personal",
      desc: "Dari pemesanan hingga barang sampai di tangan Anda, kami hadir untuk memastikan pengalaman yang tenang.",
    },
  ],
};

function readLocalSettings() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalSettings(settings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

export async function loadSiteSettings(supabaseClient) {
  const fallback = {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    heroSlides: defaultHeroSlides,
    home: defaultHomeSettings,
    about: defaultAboutSettings,
  };

  if (!supabaseClient) return fallback;

  try {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("key,value")
      .in("key", [
        "whatsapp_number",
        "hero_slides",
        "home_intro_eyebrow",
        "home_intro_title",
        "home_intro_subtitle",
        "about_hero_image_url",
        "about_hero_eyebrow",
        "about_hero_title",
        "about_hero_subtitle",
        "about_section_eyebrow",
        "about_section_heading",
        "about_section_body_1",
        "about_section_body_2",
        "about_secondary_image_url",
        "about_location_title",
        "about_location_address",
        "about_location_city",
        "about_location_phone",
        "about_location_hours",
        "about_values",
      ]);

    if (!error && data?.length) {
      const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
      return {
        whatsappNumber: map.whatsapp_number || fallback.whatsappNumber,
        heroSlides: map.hero_slides ? JSON.parse(map.hero_slides) : fallback.heroSlides,
        home: {
          introEyebrow: map.home_intro_eyebrow || fallback.home.introEyebrow,
          introTitle: map.home_intro_title || fallback.home.introTitle,
          introSubtitle: map.home_intro_subtitle || fallback.home.introSubtitle,
        },
        about: {
          heroImageUrl: map.about_hero_image_url || fallback.about.heroImageUrl,
          heroEyebrow: map.about_hero_eyebrow || fallback.about.heroEyebrow,
          heroTitle: map.about_hero_title || fallback.about.heroTitle,
          heroSubtitle: map.about_hero_subtitle || fallback.about.heroSubtitle,
          sectionEyebrow: map.about_section_eyebrow || fallback.about.sectionEyebrow,
          sectionHeading: map.about_section_heading || fallback.about.sectionHeading,
          sectionBody1: map.about_section_body_1 || fallback.about.sectionBody1,
          sectionBody2: map.about_section_body_2 || fallback.about.sectionBody2,
          secondaryImageUrl: map.about_secondary_image_url || fallback.about.secondaryImageUrl,
          locationTitle: map.about_location_title || fallback.about.locationTitle,
          locationAddress: map.about_location_address || fallback.about.locationAddress,
          locationCity: map.about_location_city || fallback.about.locationCity,
          locationPhone: map.about_location_phone || fallback.about.locationPhone,
          locationHours: map.about_location_hours || fallback.about.locationHours,
          values: map.about_values ? JSON.parse(map.about_values) : fallback.about.values,
        },
      };
    }
  } catch {
    // fall back to local storage
  }

  const local = readLocalSettings();
  if (local) {
    return {
      whatsappNumber: local.whatsappNumber || fallback.whatsappNumber,
      heroSlides: local.heroSlides?.length ? local.heroSlides : fallback.heroSlides,
      home: local.home || fallback.home,
      about: local.about || fallback.about,
    };
  }

  return fallback;
}

export async function saveSiteSettings(supabaseClient, { whatsappNumber, heroSlides, home, about }) {
  const normalizedSlides = (heroSlides || []).filter(
    (slide) => slide?.title || slide?.subtitle || slide?.eyebrow || slide?.image_url
  );

  const payload = [
    { key: "whatsapp_number", value: whatsappNumber || "" },
    { key: "hero_slides", value: JSON.stringify(normalizedSlides) },
    { key: "home_intro_eyebrow", value: home?.introEyebrow || "" },
    { key: "home_intro_title", value: home?.introTitle || "" },
    { key: "home_intro_subtitle", value: home?.introSubtitle || "" },
    { key: "about_hero_image_url", value: about?.heroImageUrl || "" },
    { key: "about_hero_eyebrow", value: about?.heroEyebrow || "" },
    { key: "about_hero_title", value: about?.heroTitle || "" },
    { key: "about_hero_subtitle", value: about?.heroSubtitle || "" },
    { key: "about_section_eyebrow", value: about?.sectionEyebrow || "" },
    { key: "about_section_heading", value: about?.sectionHeading || "" },
    { key: "about_section_body_1", value: about?.sectionBody1 || "" },
    { key: "about_section_body_2", value: about?.sectionBody2 || "" },
    { key: "about_secondary_image_url", value: about?.secondaryImageUrl || "" },
    { key: "about_location_title", value: about?.locationTitle || "" },
    { key: "about_location_address", value: about?.locationAddress || "" },
    { key: "about_location_city", value: about?.locationCity || "" },
    { key: "about_location_phone", value: about?.locationPhone || "" },
    { key: "about_location_hours", value: about?.locationHours || "" },
    { key: "about_values", value: JSON.stringify(about?.values || []) },
  ];

  try {
    if (supabaseClient) {
      const { error } = await supabaseClient.from("site_settings").upsert(payload, { onConflict: "key" });
      if (!error) {
        writeLocalSettings({
          whatsappNumber: whatsappNumber || "",
          heroSlides: normalizedSlides,
          home: home || defaultHomeSettings,
          about: about || defaultAboutSettings,
        });
        return true;
      }
    }
  } catch {
    // fall back to local storage
  }

  writeLocalSettings({
    whatsappNumber: whatsappNumber || "",
    heroSlides: normalizedSlides,
    home: home || defaultHomeSettings,
    about: about || defaultAboutSettings,
  });
  return false;
}
