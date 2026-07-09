const STORAGE_KEY = "ruma-site-settings";

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
  };

  if (!supabaseClient) return fallback;

  try {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("key,value")
      .in("key", ["whatsapp_number", "hero_slides"]);

    if (!error && data?.length) {
      const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
      return {
        whatsappNumber: map.whatsapp_number || fallback.whatsappNumber,
        heroSlides: map.hero_slides ? JSON.parse(map.hero_slides) : fallback.heroSlides,
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
    };
  }

  return fallback;
}

export async function saveSiteSettings(supabaseClient, { whatsappNumber, heroSlides }) {
  const normalizedSlides = (heroSlides || []).filter(
    (slide) => slide?.title || slide?.subtitle || slide?.eyebrow || slide?.image_url
  );

  const payload = [
    { key: "whatsapp_number", value: whatsappNumber || "" },
    { key: "hero_slides", value: JSON.stringify(normalizedSlides) },
  ];

  try {
    if (supabaseClient) {
      const { error } = await supabaseClient.from("site_settings").upsert(payload, { onConflict: "key" });
      if (!error) {
        writeLocalSettings({ whatsappNumber: whatsappNumber || "", heroSlides: normalizedSlides });
        return true;
      }
    }
  } catch {
    // fall back to local storage
  }

  writeLocalSettings({ whatsappNumber: whatsappNumber || "", heroSlides: normalizedSlides });
  return false;
}
