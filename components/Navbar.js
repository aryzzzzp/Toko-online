"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/catalog", label: "Katalog" },
  { href: "/about", label: "Tentang Kami" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? "bg-ivory/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container-Bali-Stars-Sofa flex items-center justify-between h-20">
        <Link
          href="/"
          className={`font-display text-2xl tracking-wide ${
            solid ? "text-forest" : "text-ivory"
          }`}
        >
          Bali Stars Sofa
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-body text-sm tracking-widest2 uppercase transition-colors ${
                solid ? "text-charcoal hover:text-brass" : "text-ivory/90 hover:text-ivory"
              } ${pathname === l.href ? "border-b border-brass" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`text-sm uppercase tracking-widest2 ${solid ? "text-forest" : "text-ivory"}`}
                >
                  Admin
                </Link>
              )}
              <Link href="/account" className={solid ? "text-charcoal" : "text-ivory"}>
                <User size={18} />
              </Link>
              <button onClick={signOut} className={solid ? "text-charcoal" : "text-ivory"} title="Keluar">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`text-sm uppercase tracking-widest2 px-5 py-2 border rounded-full transition-colors ${
                solid
                  ? "border-forest text-forest hover:bg-forest hover:text-ivory"
                  : "border-ivory text-ivory hover:bg-ivory hover:text-forest"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>

        <button
          className={`md:hidden ${solid ? "text-charcoal" : "text-ivory"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-ivory border-t border-sand px-6 py-6 space-y-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-charcoal uppercase tracking-widest2 text-sm"
            >
              {l.label}
            </Link>
          ))}
          {profile?.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block text-forest uppercase text-sm">
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={signOut} className="block text-charcoal uppercase text-sm">
              Keluar
            </button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="block text-forest uppercase text-sm">
              Masuk
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
