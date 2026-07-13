"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import { formatRupiah } from "@/lib/utils";

export default function ProductCard({ product, index = 0 }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      className="group"
    >
      <Link href={`/catalog/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand rounded-md">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/30 font-display italic">
              Bali Stars Sofa
            </div>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-charcoal/80 text-ivory text-[10px] uppercase tracking-widest2 px-3 py-1 rounded-full">
              Stok Habis
            </span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-display text-lg text-charcoal">{product.name}</h3>
          {typeof product.price !== "undefined" && (
            <div className="mt-1">
              {product.original_price && Number(product.original_price) > Number(product.price) ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-sm text-charcoal/50 line-through">{formatRupiah(Number(product.original_price))}</span>
                  <span className="font-display text-base text-forest">{formatRupiah(Number(product.price))}</span>
                </div>
              ) : (
                <div>
                  <span className="font-display text-base text-forest">{formatRupiah(Number(product.price))}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      <WhatsAppOrderButton
        product={product}
        label="Pesan via WhatsApp"
        className="mt-3 inline-flex items-center justify-center rounded-full border border-forest/20 px-4 py-2 text-xs font-medium uppercase tracking-widest2 text-forest transition-colors hover:bg-forest hover:text-ivory"
      />
    </motion.div>
  );
}
