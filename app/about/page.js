import Image from "next/image";

export const metadata = { title: "Tentang Kami — RUMA" };

const values = [
  {
    title: "Dikurasi, Bukan Ditumpuk",
    desc: "Setiap produk melewati proses seleksi ketat sebelum layak disebut bagian dari koleksi RUMA.",
  },
  {
    title: "Kualitas di Setiap Detail",
    desc: "Kami bekerja sama dengan pengrajin dan mitra terpercaya yang mengutamakan mutu di atas kuantitas.",
  },
  {
    title: "Layanan yang Personal",
    desc: "Dari pemesanan hingga barang sampai di tangan Anda, kami hadir untuk memastikan pengalaman yang tenang.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero halaman */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=2000&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-forest-dark/60 flex flex-col items-center justify-center text-center px-6">
          <p className="uppercase tracking-widest2 text-brass-light text-xs mb-4">Cerita Kami</p>
          <h1 className="font-display italic text-4xl md:text-6xl text-ivory">Tentang RUMA</h1>
        </div>
      </section>

      {/* Narasi */}
      <section className="container-ruma py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/5] rounded-md overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop"
            alt="Ruang kerja kurasi produk RUMA"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="uppercase tracking-widest2 text-brass text-xs mb-4">Sejak Awal</p>
          <h2 className="font-display text-3xl text-forest mb-6 leading-snug">
            Berawal dari keinginan sederhana: rumah yang terasa seperti diri sendiri.
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            RUMA hadir sebagai tempat belanja retail online yang menghadirkan produk-produk pilihan untuk
            kebutuhan fashion, rumah tangga, kecantikan, dan gaya hidup sehari-hari.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            Kami percaya belanja seharusnya terasa tenang, bukan terburu-buru — seperti berjalan di lorong
            toko favorit yang sudah mengenal selera Anda.
          </p>
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
            {values.map((v, i) => (
              <div key={v.title} className="text-center px-4">
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
