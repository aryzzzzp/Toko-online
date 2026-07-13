import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = getSupabaseServerClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display italic text-3xl text-forest mb-2">Kelola Kategori</h1>
          <p className="text-charcoal/60">Tambah, ubah, atau hapus kategori yang tampil di katalog.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-forest text-ivory px-5 py-3 rounded-full text-sm uppercase tracking-widest2 hover:bg-forest-dark transition-colors"
        >
          <Plus size={16} /> Tambah Kategori
        </Link>
      </div>

      <div className="bg-white border border-charcoal/10 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand/50 text-left">
            <tr>
              <th className="px-5 py-4 font-medium text-charcoal/60">Nama</th>
              <th className="px-5 py-4 font-medium text-charcoal/60">Slug</th>
              <th className="px-5 py-4 font-medium text-charcoal/60 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((c) => (
              <tr key={c.id} className="border-t border-charcoal/5">
                <td className="px-5 py-4 font-medium text-charcoal">{c.name}</td>
                <td className="px-5 py-4 text-charcoal/60">{c.slug}</td>
                <td className="px-5 py-4 text-right space-x-4 whitespace-nowrap">
                  <Link href={`/admin/categories/${c.id}`} className="text-forest text-xs uppercase tracking-widest2">
                    Ubah
                  </Link>
                  <DeleteCategoryButton categoryId={c.id} categoryName={c.name} />
                </td>
              </tr>
            ))}
            {!categories?.length && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-charcoal/50">
                  Belum ada kategori. Klik "Tambah Kategori" untuk memulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
