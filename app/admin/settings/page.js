"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { defaultHeroSlides, loadSiteSettings, saveSiteSettings } from "@/lib/siteSettings";

export default function SiteSettingsPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const settings = await loadSiteSettings(supabase);
      setWhatsappNumber(settings.whatsappNumber || "");
      setHeroSlides(settings.heroSlides?.length ? settings.heroSlides : defaultHeroSlides);
    }

    init();
  }, [supabase]);

  function updateSlide(index, field, value) {
    setHeroSlides((prev) => prev.map((slide, i) => (i === index ? { ...slide, [field]: value } : slide)));
  }

  function addSlide() {
    setHeroSlides((prev) => [...prev, { image_url: "", eyebrow: "", title: "", subtitle: "" }]);
  }

  function removeSlide(index) {
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const ok = await saveSiteSettings(supabase, { whatsappNumber, heroSlides });
    setLoading(false);
    setMessage(ok ? "Pengaturan tersimpan." : "Pengaturan disimpan secara lokal.");
    router.refresh();
  }

  return (
    <div className="max-w-5xl">
      <h1 className="font-display italic text-3xl text-forest mb-2">Pengaturan Halaman Depan</h1>
      <p className="text-charcoal/60 mb-8">Atur teks, gambar, dan nomor WhatsApp untuk toko Anda.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border border-charcoal/10 rounded-md p-6 bg-white">
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Nomor WhatsApp</label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="6281234567890"
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          />
          <p className="text-sm text-charcoal/50 mt-2">Nomor ini dipakai untuk semua tombol pemesanan WhatsApp.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-forest">Slide Hero</h2>
            <button
              type="button"
              onClick={addSlide}
              className="text-sm text-brass-dark underline underline-offset-2"
            >
              + Tambah slide
            </button>
          </div>

          {heroSlides.map((slide, index) => (
            <div key={index} className="border border-charcoal/10 rounded-md p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-widest2 text-charcoal/50">Slide {index + 1}</p>
                {heroSlides.length > 1 && (
                  <button type="button" onClick={() => removeSlide(index)} className="text-sm text-red-600">
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-[180px_1fr] gap-4">
                <div className="relative aspect-[4/3] bg-sand rounded-md overflow-hidden">
                  {slide.image_url ? (
                    <Image src={slide.image_url} alt={`Preview slide ${index + 1}`} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal/30 text-sm">Gambar slide</div>
                  )}
                </div>
                <div className="space-y-4">
                  <input
                    value={slide.image_url || ""}
                    onChange={(e) => updateSlide(index, "image_url", e.target.value)}
                    placeholder="URL gambar"
                    className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                  />
                  <input
                    value={slide.eyebrow || ""}
                    onChange={(e) => updateSlide(index, "eyebrow", e.target.value)}
                    placeholder="Eyebrow"
                    className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                  />
                  <input
                    value={slide.title || ""}
                    onChange={(e) => updateSlide(index, "title", e.target.value)}
                    placeholder="Judul"
                    className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                  />
                  <textarea
                    rows={3}
                    value={slide.subtitle || ""}
                    onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                    placeholder="Subjudul"
                    className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {message ? <p className="text-sm text-forest">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 rounded-full bg-forest text-ivory uppercase tracking-widest2 text-sm hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}
