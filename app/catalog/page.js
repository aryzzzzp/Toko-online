import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const revalidate = 0;

export default async function CatalogPage({ searchParams }) {
  const supabase = getSupabaseServerClient();
  const activeCategory = searchParams?.category;
  const search = searchParams?.q;

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  let query = supabase.from("products").select("*, categories(name, slug)").eq("is_active", true);

  if (activeCategory) {
    const cat = categories?.find((c) => c.slug === activeCategory);
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: products } = await query.order("created_at", { ascending: false });

  return (
    <div className="pt-32 pb-24 container-Bali-Star-Sofa">
      <div className="text-center mb-16">
        <p className="uppercase tracking-widest2 text-brass text-xs mb-4">Katalog</p>
        <h1 className="font-display italic text-4xl text-forest">Semua Produk</h1>
      </div>

      <form className="max-w-md mx-auto mb-10">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Cari produk..."
          className="w-full border-b border-charcoal/20 bg-transparent py-2 text-center focus:outline-none focus:border-brass"
        />
      </form>

      <div className="flex flex-wrap justify-center gap-3 mb-14">
        <Link
          href="/catalog"
          className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest2 border ${
            !activeCategory ? "bg-forest text-ivory border-forest" : "border-charcoal/20 text-charcoal"
          }`}
        >
          Semua
        </Link>
        {categories?.map((c) => (
          <Link
            key={c.id}
            href={`/catalog?category=${c.slug}`}
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest2 border ${
              activeCategory === c.slug ? "bg-forest text-ivory border-forest" : "border-charcoal/20 text-charcoal"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/60 py-16">Tidak ada produk yang ditemukan.</p>
      )}
    </div>
  );
}
