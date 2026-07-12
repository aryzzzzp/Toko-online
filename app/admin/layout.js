import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { href: "/admin/settings", label: "Halaman Depan", icon: LayoutDashboard },
];

export default function AdminLayout({ children }) {
  return (
    <div className="pt-20 min-h-screen flex bg-ivory">
      <aside className="w-64 border-r border-charcoal/10 hidden md:flex flex-col py-10 px-6 sticky top-20 h-[calc(100vh-5rem)]">
        <p className="font-display italic text-xl text-forest mb-1">Bali Stars Sofa</p>
        <p className="text-xs uppercase tracking-widest2 text-charcoal/40 mb-10">Panel Admin</p>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-charcoal/80 hover:bg-sand transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex items-center gap-2 text-sm text-charcoal/50 mt-10">
          <ArrowLeft size={16} /> Kembali ke Toko
        </Link>
      </aside>

      <div className="flex-1 px-6 md:px-12 py-10">{children}</div>
    </div>
  );
}
