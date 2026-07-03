import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { formatRupiah } from "@/components/ProductCard";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = getSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display italic text-3xl text-forest mb-2">Kelola Pesanan</h1>
      <p className="text-charcoal/60 mb-10">Pantau dan perbarui status pesanan pelanggan.</p>

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white border border-charcoal/10 rounded-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-charcoal/40">ID Pesanan: {order.id.slice(0, 8)}</p>
                <p className="text-sm text-charcoal/60">
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-display text-lg text-forest">{formatRupiah(order.total)}</p>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
            <ul className="text-sm text-charcoal/70 space-y-1 border-t border-charcoal/5 pt-4">
              {order.order_items?.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.product_name} — {formatRupiah(item.price)}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!orders?.length && <p className="text-charcoal/50">Belum ada pesanan masuk.</p>}
      </div>
    </div>
  );
}
