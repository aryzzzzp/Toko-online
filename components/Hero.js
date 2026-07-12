"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { defaultHeroSlides, loadSiteSettings } from "@/lib/siteSettings";
import { buildWhatsAppLink } from "@/lib/utils";

export default function Hero() {
  const [slides, setSlides] = useState(defaultHeroSlides);
  const [index, setIndex] = useState(0);
  const [whatsappLink, setWhatsappLink] = useState(null);

  useEffect(() => {
    async function loadSlides() {
      const settings = await loadSiteSettings(getSupabaseBrowserClient());
      setSlides(settings.heroSlides?.length ? settings.heroSlides : defaultHeroSlides);
      setWhatsappLink(
        buildWhatsAppLink({
          phoneNumber: settings.whatsappNumber,
          message: "Halo, saya ingin bertanya tentang produk di Bali Stars Sofa.",
        })
      );
    }

    loadSlides();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index] || defaultHeroSlides[0];

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${slide.image_url || ""})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 via-charcoal/30 to-charcoal/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="uppercase tracking-widest2 text-brass-light text-xs md:text-sm mb-5">
              {slide.eyebrow}
            </p>
            <h1 className="font-display italic text-5xl md:text-7xl text-ivory leading-tight mb-6">
              {slide.title}
            </h1>
            <p className="text-ivory/85 text-base md:text-lg max-w-md mx-auto mb-10">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="uppercase tracking-widest2 text-sm border border-ivory text-ivory px-8 py-3 rounded-full hover:bg-ivory hover:text-forest transition-colors duration-300"
          >
            Jelajahi Katalog
          </a>
        ) : (
          <Link
            href="/catalog"
            className="uppercase tracking-widest2 text-sm border border-ivory text-ivory px-8 py-3 rounded-full hover:bg-ivory hover:text-forest transition-colors duration-300"
          >
            Jelajahi Katalog
          </Link>
        )}

        <div className="absolute bottom-10 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-brass" : "w-1.5 bg-ivory/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
