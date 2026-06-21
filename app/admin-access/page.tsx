"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, Loader2 } from "lucide-react";

function AdminAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (session) {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      router.push(callbackUrl);
    }
  }, [session, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        const callbackUrl = searchParams.get("callbackUrl") || "/";
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-travel-dark flex items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-md bg-travel-dark/40 border border-travel-muted/20 backdrop-blur-md p-8 md:p-10 space-y-8 shadow-premium relative">
        {/* Subtle orange accent glow top-left */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-travel-accent/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-3 relative z-10 text-left">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-travel-muted hover:text-travel-offwhite transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>BACK TO JOURNAL</span>
          </Link>
          <h1 className="font-display text-2xl md:text-3.5xl font-black text-travel-offwhite tracking-tight uppercase mt-2">
            AESTHETE LOGIN
          </h1>
          <p className="text-xs text-travel-muted leading-relaxed font-light">
            Enter your credentials below to access your account settings and dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs py-3 px-4 rounded-none">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email-input" className="text-[9px] font-bold text-travel-muted uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-travel-muted">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@travel.com"
                className="w-full bg-travel-dark/30 border border-travel-muted/20 pl-10 pr-4 py-3 text-xs focus:border-travel-accent focus:outline-none rounded-none text-travel-offwhite transition-colors placeholder:text-travel-muted/50"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="pass-input" className="text-[9px] font-bold text-travel-muted uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-travel-muted">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                id="pass-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-travel-dark/30 border border-travel-muted/20 pl-10 pr-4 py-3 text-xs focus:border-travel-accent focus:outline-none rounded-none text-travel-offwhite transition-colors placeholder:text-travel-muted/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-travel-accent text-travel-offwhite px-5 py-3.5 hover:bg-travel-accent/90 transition-colors duration-300 font-display text-[10px] font-bold tracking-widest uppercase shadow-premium disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </div>
        </form>

        <div className="border-t border-travel-muted/10 pt-6 text-center">
          <p className="text-[10px] text-travel-muted">
            Demo Admin Credentials: <code className="text-travel-offwhite bg-travel-dark px-1.5 py-0.5 rounded">admin@travel.com</code> / <code className="text-travel-offwhite bg-travel-dark px-1.5 py-0.5 rounded">adminpassword</code>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AdminAccessPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-travel-dark flex items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-travel-accent" />
      </div>
    }>
      <AdminAccessForm />
    </React.Suspense>
  );
}
