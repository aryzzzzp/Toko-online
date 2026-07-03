import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import ProductForm from "@/components/admin/ProductForm";

export const revalidate = 0;

export default async function EditProductPage({ params }) {
  const supabase = getSupabaseServerClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display italic text-3xl text-forest mb-2">Ubah Produk</h1>
      <p className="text-charcoal/60 mb-10">Perbarui detail "{product.name}".</p>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
