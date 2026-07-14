import Image from "next/image";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import AddToCartButton from "@/components/AddToCartButton";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import { formatRupiah } from "@/lib/utils";
import { normalizeProductImages, getPrimaryProductImage } from "@/lib/productImages";

export const revalidate = 0;

export default async function ProductDetailPage({ params }) {
  const supabase = getSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const images = normalizeProductImages(product.image_url);
  const primaryImage = getPrimaryProductImage(images);

  return (
    <div className="pt-32 pb-24 container-Bali-Stars-Sofa grid md:grid-cols-2 gap-14">
      <div className="space-y-4">
        <div className="relative aspect-[3/4] bg-sand rounded-md overflow-hidden">
          {primaryImage ? (
            <Image src={primaryImage} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal/30 font-display italic text-2xl">
              Bali Stars Sofa
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative aspect-square rounded-md overflow-hidden bg-sand">
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        {product.categories?.name && (
          <p className="uppercase tracking-widest2 text-brass text-xs mb-4">{product.categories.name}</p>
        )}
        <h1 className="font-display text-4xl text-forest mb-4">{product.name}</h1>
        <div className="gold-rule w-16 mb-6" />
        <p className="text-charcoal/70 leading-relaxed mb-8">
          {product.description || "Tidak ada deskripsi untuk produk ini."}
        </p>

        <div className="mb-6">
          {product.original_price && Number(product.original_price) > Number(product.price) ? (
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-sm text-charcoal/50 line-through">{formatRupiah(Number(product.original_price))}</span>
              <span className="font-display text-2xl text-forest">{formatRupiah(Number(product.price))}</span>
            </div>
          ) : (
            <div className="mb-2">
              <span className="font-display text-2xl text-forest">{formatRupiah(Number(product.price))}</span>
            </div>
          )}
          <p className="text-sm text-charcoal/60">
            {product.stock > 0 ? `Stok tersedia: ${product.stock}` : "Stok sedang habis"}
          </p>
        </div>

        <WhatsAppOrderButton
          product={product}
          label="Hubungi via WhatsApp"
          className="mb-4 inline-flex w-fit items-center justify-center rounded-full border border-brass/40 bg-brass/10 px-6 py-3 text-sm font-medium uppercase tracking-widest2 text-brass-dark transition-colors hover:bg-brass hover:text-ivory"
        />

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
