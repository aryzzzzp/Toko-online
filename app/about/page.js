import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { loadSiteSettings } from "@/lib/siteSettings";

export const metadata = { title: "Tentang Kami — Bali Star Sofa" };

export default async function AboutPage() {
  const supabase = getSupabaseServerClient();
  const settings = await loadSiteSettings(supabase);
  const whatsappLink = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : null;
  const about = settings.about;

  return (
    <div>
      {/* Hero halaman */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${about.heroImageUrl})`,
          }}
        />
        <div className="absolute inset-0 bg-forest-dark/60 flex flex-col items-center justify-center text-center px-6">
          <p className="uppercase tracking-widest2 text-brass-light text-xs mb-4">{about.heroEyebrow}</p>
          <h1 className="font-display italic text-4xl md:text-6xl text-ivory">{about.heroTitle}</h1>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-ivory/70 bg-ivory/10 px-6 py-3 text-sm font-medium uppercase tracking-widest2 text-ivory transition-colors hover:bg-ivory hover:text-forest"
            >
              Hubungi via WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Narasi */}
      <section className="container-bali-star-sofa py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/5] rounded-md overflow-hidden">
          <Image
            src={about.secondaryImageUrl}
            alt="Ruang kerja kurasi produk Bali Star Sofa"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="uppercase tracking-widest2 text-brass text-xs mb-4">{about.sectionEyebrow}</p>
          <h2 className="font-display text-3xl text-forest mb-6 leading-snug">{about.sectionHeading}</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">{about.sectionBody1}</p>
          <p className="text-charcoal/70 leading-relaxed">{about.sectionBody2}</p>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-medium uppercase tracking-widest2 text-ivory transition-colors hover:bg-brass-dark"
            >
              Hubungi via WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Nilai-nilai */}
      <section className="bg-forest text-ivory py-24">
        <div className="container-ruma">
          <div className="text-center mb-16">
            <p className="uppercase tracking-widest2 text-brass-light text-xs mb-4">Yang Kami Percaya</p>
            <h2 className="font-display italic text-3xl">Prinsip di Balik Setiap Produk</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {about.values.map((v, i) => (
              <div key={`${v.title}-${i}`} className="text-center px-4">
                <div className="w-12 h-12 rounded-full border border-brass-light flex items-center justify-center mx-auto mb-6 font-display italic text-brass-light">
                  {i + 1}
                </div>
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="text-ivory/70 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
