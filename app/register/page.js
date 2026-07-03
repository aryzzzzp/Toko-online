"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="pt-40 pb-24 container-ruma max-w-md mx-auto text-center">
        <h1 className="font-display italic text-3xl text-forest mb-4">Cek Email Anda</h1>
        <p className="text-charcoal/70 mb-8">
          Kami telah mengirim tautan konfirmasi ke email Anda. Silakan konfirmasi lalu masuk.
        </p>
        <Link href="/login" className="text-forest border-b border-brass uppercase text-sm tracking-widest2">
          Ke Halaman Masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 container-ruma max-w-md mx-auto">
      <div className="text-center mb-10">
        <p className="uppercase tracking-widest2 text-brass text-xs mb-4">Bergabung Dengan Kami</p>
        <h1 className="font-display italic text-3xl text-forest">Buat Akun Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Nama Lengkap</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest2 text-charcoal/60 mb-2">Kata Sandi</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-charcoal/20 rounded-md px-4 py-3 focus:outline-none focus:border-brass"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full uppercase tracking-widest2 text-sm bg-forest text-ivory py-3 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-center text-sm text-charcoal/60 mt-8">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-forest border-b border-brass">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
