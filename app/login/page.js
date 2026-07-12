"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Email atau kata sandi salah.");
      return;
    }

    router.push(searchParams.get("redirect") || "/");
    router.refresh();
  }

  return (
    <div className="pt-32 pb-24 container-Bali-Star-Sofa max-w-md mx-auto">
      <div className="text-center mb-10">
        <p className="uppercase tracking-widest2 text-brass text-xs mb-4">Selamat Datang Kembali</p>
        <h1 className="font-display italic text-3xl text-forest">Masuk ke Akun Anda</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="text-center text-sm text-charcoal/60 mt-8">
        Belum punya akun?{" "}
        <Link href="/register" className="text-forest border-b border-brass">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
