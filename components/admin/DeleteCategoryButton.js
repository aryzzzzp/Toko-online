"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function DeleteCategoryButton({ categoryId, categoryName }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleDelete() {
    const confirmed = window.confirm(`Hapus kategori "${categoryName}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase.from("categories").delete().eq("id", categoryId);
    setLoading(false);

    if (error) {
      alert("Gagal menghapus kategori: " + error.message);
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
