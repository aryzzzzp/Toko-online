"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const statuses = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
const labels = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function OrderStatusSelect({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

    setLoading(false);
    if (error) {
      alert("Gagal memperbarui status: " + error.message);
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="text-xs uppercase tracking-widest2 border border-charcoal/20 rounded-full px-4 py-2 bg-white"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {labels[s]}
        </option>
      ))}
    </select>
  );
}
