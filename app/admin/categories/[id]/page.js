import CategoryForm from "@/components/admin/CategoryForm";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditCategoryPage({ params }) {
  const supabase = getSupabaseServerClient();
  const { data: category } = await supabase.from("categories").select("*").eq("id", params.id).single();

  if (!category) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display italic text-3xl text-forest mb-2">Ubah Kategori</h1>
        <p className="text-charcoal/60">Perbarui data kategori.</p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
