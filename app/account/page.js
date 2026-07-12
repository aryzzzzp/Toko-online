import { redirect } from "next/navigation";
import { getCurrentProfile, getSupabaseServerClient } from "@/lib/supabaseServer";

export const revalidate = 0;

const statusLabel = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default async function AccountPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?redirect=/account");

  const supabase = getSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="pt-32 pb-24 container-Bali-Star-Sofa max-w-3xl mx-auto">
      <div className="mb-12">
        <p className="uppercase tracking-widest2 text-brass text-xs mb-3">Akun Saya</p>
        <h1 className="font-display italic text-3xl text-forest">
          Halo, {profile?.full_name || user.email}
        </h1>
      </div>

      <h2 className="font-display text-xl text-forest mb-6">Riwayat Pesanan</h2>

      {orders?.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="border border-charcoal/10 rounded-md p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-charcoal/50">
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs uppercase tracking-widest2 text-brass-dark mt-1">
                    {statusLabel[order.status] || order.status}
                  </p>
                </div>
                <p className="font-display text-lg text-forest">{order.total}</p>
              </div>
              <ul className="text-sm text-charcoal/70 space-y-1">
                {order.order_items?.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.product_name} — {item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-charcoal/60">Anda belum memiliki pesanan.</p>
      )}
    </div>
  );
}
