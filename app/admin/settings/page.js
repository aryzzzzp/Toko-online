"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
  defaultHeroSlides,
  defaultHomeSettings,
  defaultAboutSettings,
  loadSiteSettings,
  saveSiteSettings,
} from "@/lib/siteSettings";

export default function SiteSettingsPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);
  const [home, setHome] = useState(defaultHomeSettings);
  const [about, setAbout] = useState(defaultAboutSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const settings = await loadSiteSettings(supabase);
      setWhatsappNumber(settings.whatsappNumber || "");
      setHeroSlides(settings.heroSlides?.length ? settings.heroSlides : defaultHeroSlides);
      setHome(settings.home || defaultHomeSettings);
      setAbout(settings.about || defaultAboutSettings);
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

  function updateHomeField(field, value) {
    setHome((prev) => ({ ...prev, [field]: value }));
  }

  function updateAboutField(field, value) {
    setAbout((prev) => ({ ...prev, [field]: value }));
  }

  function updateAboutValue(index, field, value) {
    setAbout((prev) => ({
      ...prev,
      values: prev.values.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }

  function addAboutValue() {
    setAbout((prev) => ({
      ...prev,
      values: [...prev.values, { title: "", desc: "" }],
    }));
  }

  function removeAboutValue(index) {
    setAbout((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const ok = await saveSiteSettings(supabase, { whatsappNumber, heroSlides, home, about });
    setLoading(false);
    setMessage(ok ? "Pengaturan tersimpan." : "Pengaturan disimpan secara lokal.");
    router.refresh();
  }

  return (
    <div className="max-w-5xl">
      <h1 className="font-display italic text-3xl text-forest mb-2">Pengaturan Halaman</h1>
      <p className="text-charcoal/60 mb-8">Atur teks, gambar, dan nomor WhatsApp untuk toko serta halaman Tentang Kami.</p>

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

        <div className="space-y-4 border border-charcoal/10 rounded-md p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-forest">Halaman Utama</h2>
              <p className="text-sm text-charcoal/50">Edit teks dan tombol CTA yang tampil di halaman utama.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <input
              value={home.introEyebrow}
              onChange={(e) => updateHomeField("introEyebrow", e.target.value)}
              placeholder="Teks kecil pengantar"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={home.introTitle}
              onChange={(e) => updateHomeField("introTitle", e.target.value)}
              placeholder="Judul pengantar"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <textarea
              rows={3}
              value={home.introSubtitle}
              onChange={(e) => updateHomeField("introSubtitle", e.target.value)}
              placeholder="Deskripsi pengantar"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={home.ctaLabel}
              onChange={(e) => updateHomeField("ctaLabel", e.target.value)}
              placeholder="Label tombol CTA"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
          </div>
        </div>

        <div className="space-y-4 border border-charcoal/10 rounded-md p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-forest">Slide Hero Halaman Utama</h2>
              <p className="text-sm text-charcoal/50">Edit setiap slide hero yang tampil di halaman utama.</p>
            </div>
            <button
              type="button"
              onClick={addSlide}
              className="text-sm text-brass-dark underline underline-offset-2"
            >
              + Tambah slide
            </button>
          </div>

          <div className="space-y-6">
            {heroSlides.map((slide, index) => (
              <div key={index} className="border border-charcoal/10 rounded-md p-4 bg-sand/80 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-widest2 text-charcoal/50">Slide {index + 1}</p>
                  {heroSlides.length > 1 && (
                    <button type="button" onClick={() => removeSlide(index)} className="text-sm text-red-600">
                      Hapus
                    </button>
                  )}
                </div>
                <input
                  value={slide.image_url}
                  onChange={(e) => updateSlide(index, "image_url", e.target.value)}
                  placeholder="URL gambar slide"
                  className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                />
                <input
                  value={slide.eyebrow}
                  onChange={(e) => updateSlide(index, "eyebrow", e.target.value)}
                  placeholder="Eyebrow slide"
                  className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                />
                <input
                  value={slide.title}
                  onChange={(e) => updateSlide(index, "title", e.target.value)}
                  placeholder="Judul slide"
                  className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                />
                <textarea
                  rows={3}
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                  placeholder="Subjudul slide"
                  className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 border border-charcoal/10 rounded-md p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-forest">Halaman Tentang Kami</h2>
              <p className="text-sm text-charcoal/50">Edit teks, gambar, dan nilai yang tampil di halaman Tentang Kami.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <input
              value={about.heroImageUrl}
              onChange={(e) => updateAboutField("heroImageUrl", e.target.value)}
              placeholder="URL gambar hero"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={about.heroEyebrow}
              onChange={(e) => updateAboutField("heroEyebrow", e.target.value)}
              placeholder="Teks kecil di hero"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={about.heroTitle}
              onChange={(e) => updateAboutField("heroTitle", e.target.value)}
              placeholder="Judul hero"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <textarea
              rows={3}
              value={about.heroSubtitle}
              onChange={(e) => updateAboutField("heroSubtitle", e.target.value)}
              placeholder="Subjudul hero"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={about.secondaryImageUrl}
              onChange={(e) => updateAboutField("secondaryImageUrl", e.target.value)}
              placeholder="URL gambar sekunder"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={about.sectionEyebrow}
              onChange={(e) => updateAboutField("sectionEyebrow", e.target.value)}
              placeholder="Teks kecil di narasi"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <input
              value={about.sectionHeading}
              onChange={(e) => updateAboutField("sectionHeading", e.target.value)}
              placeholder="Judul narasi"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <textarea
              rows={3}
              value={about.sectionBody1}
              onChange={(e) => updateAboutField("sectionBody1", e.target.value)}
              placeholder="Paragraf 1"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
            <textarea
              rows={3}
              value={about.sectionBody2}
              onChange={(e) => updateAboutField("sectionBody2", e.target.value)}
              placeholder="Paragraf 2"
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-forest">Nilai / fitur halaman About</h3>
              <button
                type="button"
                onClick={addAboutValue}
                className="text-sm text-brass-dark underline underline-offset-2"
              >
                + Tambah nilai
              </button>
            </div>
            {about.values.map((item, index) => (
              <div key={index} className="border border-charcoal/10 rounded-md p-4 bg-sand/80 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-widest2 text-charcoal/50">Fitur {index + 1}</p>
                  {about.values.length > 1 && (
                    <button type="button" onClick={() => removeAboutValue(index)} className="text-sm text-red-600">
                      Hapus
                    </button>
                  )}
                </div>
                <input
                  value={item.title}
                  onChange={(e) => updateAboutValue(index, "title", e.target.value)}
                  placeholder="Judul fitur"
                  className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                />
                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => updateAboutValue(index, "desc", e.target.value)}
                  placeholder="Deskripsi fitur"
                  className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
                />
              </div>
            ))}
          </div>
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
