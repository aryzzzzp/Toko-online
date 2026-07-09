"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { loadSiteSettings } from "@/lib/siteSettings";

export default function WhatsAppOrderButton({ product, label = "Pesan via WhatsApp", className = "" }) {
  const [href, setHref] = useState(null);

  useEffect(() => {
    async function loadLink() {
      const settings = await loadSiteSettings(getSupabaseBrowserClient());
      const message = product
        ? `Halo, saya tertarik dengan produk ${product.name}.`
        : "Halo, saya tertarik dengan produk ini.";

      setHref(buildWhatsAppLink({ phoneNumber: settings.whatsappNumber, message }));
    }

    loadLink();
  }, [product]);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
