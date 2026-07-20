"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryForm({ category }) {
  const isEdit = Boolean(category);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name,
        slug: slug || slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
        image_url: imageUrl || null,
      };

      if (isEdit) {
        const { error } = await supabase.from("categories").update(payload).eq("id", category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      console.error("Category save error:", err);
      setError(err?.message || "Terjadi kesalahan saat menyimpan kategori.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Nama Kategori</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (!slug) setSlug(slugify(name));
          }}
          className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Gambar Kategori (URL)</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="uppercase tracking-widest2 text-sm bg-forest text-ivory px-5 py-3 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-50"
      >
        {loading ? (isEdit ? "Menyimpan..." : "Menyimpan...") : isEdit ? "Simpan" : "Tambah Kategori"}
      </button>
    </form>
  );
}
