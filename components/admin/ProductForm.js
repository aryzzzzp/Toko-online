"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

export default function ProductForm({ categories, product }) {
  const isEdit = Boolean(product);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(product?.image_url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}-${slugify(name)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        finalImageUrl = data.publicUrl;
      }

      const payload = {
        name,
        slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 7),
        description,
        price: Number(price),
        stock: Number(stock),
        category_id: categoryId || null,
        is_active: isActive,
        image_url: finalImageUrl || null,
      };

      if (isEdit) {
        delete payload.slug; // jangan ubah slug saat edit
        const { error: updateError } = await supabase.from("products").update(payload).eq("id", product.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("products").insert(payload);
        if (insertError) throw insertError;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10 max-w-4xl">
      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Nama Produk</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Deskripsi</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Harga (Rp)</label>
            <input
              required
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Stok</label>
            <input
              required
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          >
            <option value="">Tanpa kategori</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-3">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span className="text-sm text-charcoal/70">Tampilkan di katalog (aktif)</span>
        </label>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Gambar Produk</label>
        <div className="relative aspect-square bg-sand rounded-md overflow-hidden mb-4">
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/30 font-display italic">
              Belum ada gambar
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full uppercase tracking-widest2 text-sm bg-forest text-ivory py-3 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
      </div>
    </form>
  );
}
