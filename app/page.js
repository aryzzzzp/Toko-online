import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { defaultHomeSettings, loadSiteSettings } from "@/lib/siteSettings";
import { buildWhatsAppLink } from "@/lib/utils";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = getSupabaseServerClient();
  const settings = await loadSiteSettings(supabase);
  const home = settings.home || defaultHomeSettings;
  const whatsappLink = buildWhatsAppLink({
    phoneNumber: settings.whatsappNumber,
    message: "Halo, saya ingin bertanya tentang produk di Bali Stars Sofa.",
  });

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: categories } = await supabase.from("categories").select("*").limit(4);

  return (
    <>
      <Hero />

      {/* Pengantar */}
      <section className="container-bali-stars-sofa py-24 text-center">
        <p className="uppercase tracking-widest2 text-brass text-xs mb-4">{home.introEyebrow}</p>
        <h2 className="font-display italic text-3xl md:text-4xl text-forest max-w-2xl mx-auto leading-snug">
          {home.introTitle}
        </h2>
        <p className="text-charcoal/70 mt-6 max-w-3xl mx-auto">{home.introSubtitle}</p>
        {whatsappLink ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="uppercase tracking-widest2 text-sm border border-forest text-forest px-8 py-3 rounded-full bg-forest/10 transition-colors duration-300 hover:bg-forest hover:text-ivory"
            >
              {home.ctaLabel}
            </a>
          </div>
        ) : null}
        <div className="gold-rule w-24 mx-auto mt-8" />
      </section>

      {/* Kategori */}
      {categories?.length > 0 && (
        <section className="container-Bali-stars-sofa pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalog?category=${c.slug}`}
                className="relative h-52 rounded-md overflow-hidden bg-forest flex items-end p-5 group"
              >
                <div className="absolute inset-0 bg-forest/40 group-hover:bg-forest/20 transition-colors" />
                <span className="relative z-10 text-ivory font-display italic text-xl">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produk unggulan */}
      <section className="bg-sand/50 py-24">
        <div className="container-Bali Stars Sofa">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="uppercase tracking-widest2 text-brass text-xs mb-3">Produk Terbaru</p>
              <h2 className="font-display text-3xl text-forest">Baru Tiba di Bali Stars Sofa</h2>
            </div>
            <Link href="/catalog" className="text-sm uppercase tracking-widest2 text-forest border-b border-brass hidden md:block">
              Lihat Semua
            </Link>
          </div>

          {products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-charcoal/60 text-center py-12">
              Belum ada produk. Tambahkan produk pertama dari halaman Admin.
            </p>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/catalog" className="text-sm uppercase tracking-widest2 text-forest border-b border-brass">
              Lihat Semua
            </Link>
          </div>
        </div>
      </section>

      {/* Banner CTA gaya resort */}
      <section className="relative h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2000&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-forest-dark/60 flex items-center justify-center text-center px-6">
          <div>
            <h2 className="font-display italic text-3xl md:text-5xl text-ivory mb-6">
              Rasakan Pengalaman Belanja yang Tenang
            </h2>
              {whatsappLink ? (
              <div className="flex flex-col gap-4 items-center justify-center sm:flex-row">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="uppercase tracking-widest2 text-sm border border-ivory text-ivory px-8 py-3 rounded-full hover:bg-ivory hover:text-forest transition-colors duration-300 inline-block"
                >
                  {home.ctaLabel}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
