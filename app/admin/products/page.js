import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = getSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display italic text-3xl text-forest mb-2">Kelola Produk</h1>
          <p className="text-charcoal/60">Tambah, ubah, atau hapus produk dari katalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-forest text-ivory px-5 py-3 rounded-full text-sm uppercase tracking-widest2 hover:bg-forest-dark transition-colors"
        >
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      <div className="bg-white border border-charcoal/10 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand/50 text-left">
            <tr>
              <th className="px-5 py-4 font-medium text-charcoal/60">Produk</th>
              <th className="px-5 py-4 font-medium text-charcoal/60">Kategori</th>
              <th className="px-5 py-4 font-medium text-charcoal/60">Harga</th>
              <th className="px-5 py-4 font-medium text-charcoal/60">Stok</th>
              <th className="px-5 py-4 font-medium text-charcoal/60">Status</th>
              <th className="px-5 py-4 font-medium text-charcoal/60 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-charcoal/5">
                <td className="px-5 py-4 font-medium text-charcoal">{p.name}</td>
                <td className="px-5 py-4 text-charcoal/60">{p.categories?.name || "—"}</td>
                <td className="px-5 py-4 text-charcoal/60">{p.price}</td>
                <td className="px-5 py-4 text-charcoal/60">{p.stock}</td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      p.is_active ? "bg-forest/10 text-forest" : "bg-charcoal/10 text-charcoal/50"
                    }`}
                  >
                    {p.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-4 whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}`} className="text-forest text-xs uppercase tracking-widest2">
                    Ubah
                  </Link>
                  <DeleteProductButton productId={p.id} productName={p.name} />
                </td>
              </tr>
            ))}
            {!products?.length && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-charcoal/50">
                  Belum ada produk. Klik "Tambah Produk" untuk memulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
