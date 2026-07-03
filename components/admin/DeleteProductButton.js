"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function DeleteProductButton({ productId, productName }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleDelete() {
    const confirmed = window.confirm(`Hapus produk "${productName}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase.from("products").delete().eq("id", productId);
    setLoading(false);

    if (error) {
      alert("Gagal menghapus produk: " + error.message);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 text-xs uppercase tracking-widest2 inline-flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 size={14} /> {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
