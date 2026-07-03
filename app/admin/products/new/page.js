import { getSupabaseServerClient } from "@/lib/supabaseServer";
import ProductForm from "@/components/admin/ProductForm";

export const revalidate = 0;

export default async function NewProductPage() {
  const supabase = getSupabaseServerClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <h1 className="font-display italic text-3xl text-forest mb-2">Tambah Produk</h1>
      <p className="text-charcoal/60 mb-10">Lengkapi detail produk baru untuk katalog.</p>
      <ProductForm categories={categories} />
    </div>
  );
}
