// lib/utils.js
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const buildWhatsAppLink = ({ phoneNumber, message = "" }) => {
  const normalizedPhone = (phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "")
    .replace(/\D/g, "");

  if (!normalizedPhone) return null;

  const url = new URL(`https://wa.me/${normalizedPhone}`);
  if (message) url.searchParams.set("text", message);

  return url.toString();
};