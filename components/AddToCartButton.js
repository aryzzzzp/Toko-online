"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

export default function AddToCartButton({ product }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleOrder() {
    if (!user) {
      router.push(`/login?redirect=/catalog/${product.id}`);
      return;
    }

    setLoading(true);
    setMessage("");

    const total = product.price * qty;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total, status: "pending" })
      .select()
      .single();

    if (orderError) {
      setMessage("Gagal membuat pesanan: " + orderError.message);
      setLoading(false);
      return;
    }

    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: qty,
    });

    setLoading(false);

    if (itemError) {
      setMessage("Gagal menambahkan item: " + itemError.message);
      return;
    }

    setMessage("Pesanan berhasil dibuat! Cek halaman akun Anda.");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border border-charcoal/20 rounded-full">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-lg"
          >
            −
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading || product.stock === 0}
        className="uppercase tracking-widest2 text-sm bg-forest text-ivory px-10 py-3 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? "Stok Habis" : loading ? "Memproses..." : "Pesan Sekarang"}
      </button>

      {message && <p className="mt-4 text-sm text-forest">{message}</p>}
    </div>
  );
}
