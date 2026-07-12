import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Package, ShoppingBag, Users } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = getSupabaseServerClient();

  const [{ count: productCount }, { count: orderCount }, { count: userCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Produk", value: productCount || 0, icon: Package },
    { label: "Total Pesanan", value: orderCount || 0, icon: ShoppingBag },
    { label: "Total Pengguna", value: userCount || 0, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display italic text-3xl text-forest mb-2">Dashboard</h1>
      <p className="text-charcoal/60 mb-10">Ringkasan performa toko Bali Star Sofa Anda.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="border border-charcoal/10 rounded-md p-6 bg-white">
            <s.icon size={20} className="text-brass mb-4" />
            <p className="text-2xl font-display text-forest">{s.value}</p>
            <p className="text-xs uppercase tracking-widest2 text-charcoal/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
