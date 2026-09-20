"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, User, Lock, Eye, EyeOff, Key,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight,
  Sparkles, Bot, Shield
} from "lucide-react";

export default function SuperbPortalLogin() {
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<"customer" | "admin">("customer");
  const [customerEmail, setCustomerEmail]       = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [showPassword, setShowPassword]         = useState(false);
  const [adminKey, setAdminKey]                 = useState("");
  const [isLoading, setIsLoading]               = useState(false);
  const [authError, setAuthError]               = useState<string | null>(null);
  const [authSuccess, setAuthSuccess]           = useState<string | null>(null);

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      if (!customerEmail.trim() || !customerPassword)
        throw new Error("Please enter your customer email and password.");
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customerEmail.trim(), password: customerPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid email or password.");
      localStorage.setItem("maz_portal_api_key", data.token);
      if (data.tenant) localStorage.setItem("maz_tenant_info", JSON.stringify(data.tenant));
      setAuthSuccess("Credentials verified! Loading your Customer Studio...");
      setTimeout(() => router.push(`/dashboard?key=${encodeURIComponent(data.token)}`), 500);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    const keyToUse = adminKey.trim();
    if (!keyToUse) {
      setAuthError("Please enter your Super-Admin Master Password.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/admin/tenants", {
        headers: { "X-SUPER-ADMIN-KEY": keyToUse },
      });
      if (!res.ok) throw new Error("Invalid Super Admin Master Passkey. Access denied.");
      localStorage.setItem("maz_admin_master_key", keyToUse);
      setAuthSuccess("Super-Admin verified! Opening Control Panel...");
      setTimeout(() => router.push("/admin"), 500);
    } catch (err: any) {
      setAuthError(err.message || "Admin authorization failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">

      {/* ═════════════════════════════════════════════════════════════════
          FULL PAGE BACKGROUND: The Cybernetic Robot & Human Synergy Art
          ═════════════════════════════════════════════════════════════════ */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center sm:bg-[center_35%] bg-no-repeat pointer-events-none transition-all duration-700"
        style={{ backgroundImage: "url('/ai-touch-login.png')" }}
        aria-hidden
      >
        {/* Soft daylight ambient wash so text on the glass card has 100% crystal clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-slate-950/20 pointer-events-none" />
      </div>

      {/* ── Soft Ambient Glow Orbs mirroring the cyan & lavender tones ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-cyan-200/25 rounded-full blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[480px] h-[480px] bg-purple-200/25 rounded-full blur-[140px] animate-pulse-glow-fast" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          CENTERED iOS 27 LIQUID GLASS COCKPIT
          ═════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto animate-fade-up">

        {/* Ambient Top Synergy Pill */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-2xl border border-white/95 shadow-[0_6px_20px_rgba(14,165,233,0.12)] text-[11px] font-bold text-slate-800">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>MAZ 2.0 • Autonomous Intelligence</span>
          </div>
        </div>

        {/* Liquid Glass Card Container */}
        <div className="glass-liquid-card rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
          
          {/* Top Specular Meniscus Arc (Water Drop Edge) */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-b from-white/95 via-white/50 to-transparent rounded-full blur-[2px] pointer-events-none" />
          
          {/* Animated Cyan to Purple Top Shimmer Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 animate-shimmer opacity-90" />

          {/* Logo & Platform Tagline */}
          <div className="text-center mb-5 pt-1">
            <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
              <img
                src="/maz-logo.png"
                alt="MAZ by Maifelz Technologies LLP"
                className="h-10 sm:h-11 w-auto mx-auto object-contain filter drop-shadow-[0_8px_20px_rgba(115,22,91,0.2)]"
              />
            </Link>
            <div className="mt-2.5 flex items-center justify-center gap-1.5">
              <span className="text-[10.5px] font-bold tracking-wider uppercase text-purple-900 bg-white/80 border border-purple-200/80 px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600" /> Enterprise Autonomous Portal
              </span>
            </div>
          </div>

          {/* iOS 27 Water Droplet Segmented Role Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-200/65 backdrop-blur-2xl rounded-2xl border border-white/85 mb-5 text-xs font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === "customer"
                  ? "glass-water-button text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40 transition-colors"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Customer Studio
            </button>
            <button
              type="button"
              onClick={() => { setActiveRole("admin"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === "admin"
                  ? "glass-water-button-dark text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40 transition-colors"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
            </button>
          </div>

          {/* Feedback Alerts */}
          {authError && (
            <div className="mb-4 p-3 bg-rose-50/95 backdrop-blur-md border border-rose-200/80 text-rose-700 rounded-2xl text-xs flex items-start gap-2 shadow-sm animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 bg-emerald-50/95 backdrop-blur-md border border-emerald-200/80 text-emerald-700 rounded-2xl text-xs flex items-start gap-2 shadow-sm animate-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* ──────────────── CUSTOMER LOGIN FORM ──────────────── */}
          {activeRole === "customer" ? (
            <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
              <p className="text-[11.5px] text-slate-600 font-medium -mt-1 mb-2">
                Sign in with your enterprise credentials to access your live AI &amp; ERP Studio.
              </p>

              <div>
                <label className="block font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-600" /> Customer Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 glass-water-input rounded-xl outline-none text-slate-900 placeholder:text-slate-400 font-medium text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-600" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 glass-water-input rounded-xl outline-none text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-cyan-600 transition"
                    aria-label="Toggle visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* iOS 27 Water Droplet Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 text-white font-bold text-sm rounded-xl glass-water-button disabled:opacity-60 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...</>
                ) : (
                  <>
                    <span>Sign In to Studio</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ──────────────── SUPER-ADMIN LOGIN FORM ──────────────── */
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div className="mb-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" /> Master Super-Admin
                </h3>
                <p className="text-[11.5px] text-slate-600 mt-1">
                  Restricted to authorized Maifelz Technologies operators.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-700" /> Master Passkey
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter Master Passkey"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-4 py-3 glass-water-input rounded-xl outline-none text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans text-sm"
                />
              </div>

              {/* Water Droplet Dark Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 text-white font-bold text-sm rounded-xl glass-water-button-dark disabled:opacity-60 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Authorizing Master Access...</>
                ) : (
                  <>
                    <span>Open Control Panel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Partner Card */}
          <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Official Odoo ERP Partner
            </span>
            <Link href="/pricing" className="inline-flex items-center gap-1 text-purple-700 font-bold hover:text-cyan-700 transition">
              Plans &amp; Pricing <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

        {/* Floating Bottom Trust Attribution */}
        <div className="mt-4 text-center text-[11px] text-slate-700 font-medium tracking-wide drop-shadow-sm">
          ISO-Grade Multi-Tenant Isolation • Sub-Second Knowledge Grounding
        </div>

      </div>

    </div>
  );
}
