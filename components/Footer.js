import Link from "next/link";
import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { loadSiteSettings } from "@/lib/siteSettings";

export default async function Footer() {
  const supabase = getSupabaseServerClient();
  const settings = await loadSiteSettings(supabase);
  const whatsappLink = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : null;

  return (
    <footer className="bg-forest text-ivory">
      <div className="container-bal-star-sofa py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-2xl mb-3"></p>Bali Star Sofa
          <p className="text-ivory/70 text-sm leading-relaxed">
            Perlengkapan hidup pilihan untuk rumah dan gaya Anda — dikurasi dengan cermat, dikirim dengan hati-hati.
          </p>
        </div>

        <div>
          <p className="uppercase text-xs tracking-widest2 text-brass-light mb-4">Jelajahi</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/catalog">Katalog</Link></li>
            <li><Link href="/about">Tentang Kami</Link></li>
          </ul>
        </div>

        <div>
          <p className="uppercase text-xs tracking-widest2 text-brass-light mb-4">Akun</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/login">Masuk</Link></li>
            <li><Link href="/register">Daftar</Link></li>
          </ul>
        </div>

        <div>
          <p className="uppercase text-xs tracking-widest2 text-brass-light mb-4">Ikuti Kami</p>
          <div className="flex gap-4">
            <Instagram size={18} />
            <Facebook size={18} />
            <Mail size={18} />
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-brass-light">
                <MessageCircle size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="gold-rule opacity-40" />
      <p className="text-center text-xs text-ivory/50 py-6">
        © {new Date().getFullYear()} Bali Star Sofa. Seluruh hak cipta dilindungi.
      </p>
    </footer>
  );
}
