"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Koleksi Musim Ini",
    title: "Living, Curated.",
    subtitle: "Perlengkapan rumah dan gaya hidup pilihan, dikurasi untuk keseharian yang lebih indah.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Edisi Terbatas",
    title: "Detail Yang Berarti.",
    subtitle: "Setiap produk dipilih karena kualitas, karakter, dan ceritanya.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Kirim Ke Seluruh Indonesia",
    title: "Belanja Dengan Tenang.",
    subtitle: "Pengiriman aman, pembayaran terpercaya, layanan yang mengerti Anda.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index];

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
            style={{ backgroundImage: `url(${slide.image})` }}
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

        <Link
          href="/catalog"
          className="uppercase tracking-widest2 text-sm border border-ivory text-ivory px-8 py-3 rounded-full hover:bg-ivory hover:text-forest transition-colors duration-300"
        >
          Jelajahi Katalog
        </Link>

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
