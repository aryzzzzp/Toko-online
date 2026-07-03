"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
      <Link href={`/catalog/${product.id}`}>
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
              RUMA
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
          <p className="text-brass-dark text-sm mt-1">{formatRupiah(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
