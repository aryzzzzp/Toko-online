import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { loadSiteSettings } from "@/lib/siteSettings";

export const metadata = { title: "Tentang Kami — Bali Stars Sofa" };

export default async function AboutPage() {
  const supabase = getSupabaseServerClient();
  const settings = await loadSiteSettings(supabase);
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
          
        </div>
      </section>

      {/* Narasi */}
      <section className="container-bali-stars-sofa py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/5] rounded-md overflow-hidden">
          <Image
            src={about.secondaryImageUrl}
            alt="Ruang kerja kurasi produk Bali Stars Sofa"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="uppercase tracking-widest2 text-brass text-xs mb-4">{about.sectionEyebrow}</p>
          <h2 className="font-display text-3xl text-forest mb-6 leading-snug">{about.sectionHeading}</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">{about.sectionBody1}</p>
          <p className="text-charcoal/70 leading-relaxed">{about.sectionBody2}</p>

          
        </div>
      </section>

      {/* Lokasi */}
      <section className="container-bali-stars-sofa py-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <p className="uppercase tracking-widest2 text-brass text-xs mb-4">{about.locationTitle}</p>
            <h2 className="font-display text-3xl text-forest mb-6">Temukan Lokasi Kami</h2>
            <div className="rounded-3xl overflow-hidden border border-charcoal/10 shadow-sm">
              <div className="aspect-[16/9] bg-sand">
                <iframe
                  title="Peta Lokasi Bali Stars Sofa"
                  src="https://maps.google.com/maps?q=Bali+Stars+Sofa,+Jl.+Pura+Banyu+Kuning+No.8,+Padangsambian,+Denpasar+Bar.,+Kota+Denpasar,+Bali+80119&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-charcoal/10 bg-forest-dark/5 p-8">
            <h3 className="font-display text-2xl text-forest mb-4">Detail Lokasi</h3>
            <div className="space-y-4 text-charcoal/90">
              <div>
                <p className="text-sm uppercase tracking-widest2 text-brass-light mb-2">Alamat</p>
                <p>{about.locationAddress}</p>
                <p>{about.locationCity}</p>
                <div className="mt-3 flex flex-col gap-3">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Bali+Stars+Sofa"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-forest px-4 py-2 text-sm font-medium text-forest hover:bg-forest hover:text-ivory transition-colors"
                  >
                    Lihat di Google Maps
                  </a>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Bali+Stars+Sofa,+Jl.+Pura+Banyu+Kuning+No.8,+Padangsambian,+Denpasar+Bar.,+Kota+Denpasar,+Bali+80119"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-forest text-ivory px-4 py-2 text-sm font-medium hover:bg-forest-dark transition-colors"
                  >
                    Dapatkan Arah
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest2 text-brass-light mb-2">Telepon</p>
                <p>{about.locationPhone}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest2 text-brass-light mb-2">Jam Buka</p>
                <p>{about.locationHours}</p>
              </div>
            </div>
          </div>
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
