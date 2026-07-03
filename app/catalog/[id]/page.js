import Image from "next/image";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { formatRupiah } from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  const supabase = getSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  return (
    <div className="pt-32 pb-24 container-ruma grid md:grid-cols-2 gap-14">
      <div className="relative aspect-[3/4] bg-sand rounded-md overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal/30 font-display italic text-2xl">
            RUMA
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        {product.categories?.name && (
          <p className="uppercase tracking-widest2 text-brass text-xs mb-4">{product.categories.name}</p>
        )}
        <h1 className="font-display text-4xl text-forest mb-4">{product.name}</h1>
        <p className="text-2xl text-brass-dark mb-6">{formatRupiah(product.price)}</p>
        <div className="gold-rule w-16 mb-6" />
        <p className="text-charcoal/70 leading-relaxed mb-8">
          {product.description || "Tidak ada deskripsi untuk produk ini."}
        </p>

        <p className="text-sm text-charcoal/60 mb-8">
          {product.stock > 0 ? `Stok tersedia: ${product.stock}` : "Stok sedang habis"}
        </p>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
