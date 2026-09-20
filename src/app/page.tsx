"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, User, Lock, Eye, EyeOff, Key,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight,
  Sparkles
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
    <div className="relative min-h-[calc(100vh-4.8rem)] flex items-center justify-center px-4 py-6 sm:py-10 overflow-hidden">

      {/* ═════════════════════════════════════════════════════════════════
          AMBIENT BACKGROUND CANVAS: Soft Pearl Light & Atmospheric Glow
          ═════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] pointer-events-none" />

      {/* ═════════════════════════════════════════════════════════════════
          ARTWORK LAYER: Perfectly Scaled & Softened Opacity (~38%)
          ═════════════════════════════════════════════════════════════════ */}
      <div 
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        aria-hidden
      >
        <div 
          className="w-full h-full max-w-[1360px] max-h-[800px] mx-auto bg-contain bg-center bg-no-repeat opacity-[0.38] transition-all duration-700"
          style={{ backgroundImage: "url('/ai-touch-login.png')" }}
        />
        {/* Soft radial feathered light mask to blend artwork edges smoothly */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,#f8fafc_92%)] pointer-events-none" />
      </div>

      {/* ── Soft Ambient Glow Orbs mirroring the cyan & lavender tones ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-cyan-200/20 rounded-full blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-purple-200/20 rounded-full blur-[140px] animate-pulse-glow-fast" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          CENTERED iOS 27 LIQUID GLASS COCKPIT (Refined & Compact)
          ═════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto animate-fade-up">

        {/* Ambient Top Synergy Pill */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-2xl border border-white/95 shadow-[0_4px_16px_rgba(14,165,233,0.1)] text-[11px] font-bold text-slate-800">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>MAZ 2.0 • Autonomous Intelligence</span>
          </div>
        </div>

        {/* Liquid Glass Card Container */}
        <div className="glass-liquid-card rounded-[30px] sm:rounded-[34px] p-6 sm:p-7 relative overflow-hidden transition-all duration-300">
          
          {/* Top Specular Meniscus Arc (Water Drop Lens Effect) */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-full blur-[2px] pointer-events-none" />
          
          {/* Subtle Top Shimmer Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 animate-shimmer opacity-85" />

          {/* Logo & Platform Tagline */}
          <div className="text-center mb-4 pt-1">
            <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
              <img
                src="/maz-logo.png"
                alt="MAZ by Maifelz Technologies LLP"
                className="h-9 sm:h-10 w-auto mx-auto object-contain filter drop-shadow-[0_6px_16px_rgba(115,22,91,0.18)]"
              />
            </Link>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-900 bg-white/80 border border-purple-200/70 px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600" /> Enterprise Autonomous Portal
              </span>
            </div>
          </div>

          {/* iOS 27 Water Droplet Segmented Role Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/[0.04] backdrop-blur-xl rounded-2xl border border-white/80 mb-4 text-xs font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            <div className="mb-3.5 p-2.5 bg-rose-50/95 backdrop-blur-md border border-rose-200/80 text-rose-700 rounded-xl text-xs flex items-start gap-2 shadow-sm animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mb-3.5 p-2.5 bg-emerald-50/95 backdrop-blur-md border border-emerald-200/80 text-emerald-700 rounded-xl text-xs flex items-start gap-2 shadow-sm animate-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* ──────────────── CUSTOMER LOGIN FORM ──────────────── */}
          {activeRole === "customer" ? (
            <form onSubmit={handleCustomerLogin} className="space-y-3.5 text-xs">
              <p className="text-[11px] text-slate-600 font-medium -mt-1 mb-1">
                Sign in with your enterprise credentials to access your live AI &amp; ERP Studio.
              </p>

              <div>
                <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-600" /> Customer Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-water-input rounded-xl outline-none text-slate-900 placeholder:text-slate-400 font-medium text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-600" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 glass-water-input rounded-xl outline-none text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-600 transition"
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
                className="w-full py-3 mt-1.5 text-white font-bold text-sm rounded-xl glass-water-button disabled:opacity-60 flex items-center justify-center gap-2 group cursor-pointer"
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
            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
              <div className="mb-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" /> Master Super-Admin
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Restricted to authorized Maifelz Technologies operators.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-700" /> Master Passkey
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter Master Passkey"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-water-input rounded-xl outline-none text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans text-sm"
                />
              </div>

              {/* Water Droplet Dark Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-1.5 text-white font-bold text-sm rounded-xl glass-water-button-dark disabled:opacity-60 flex items-center justify-center gap-2 group cursor-pointer"
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
          <div className="mt-5 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-600 font-medium">
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
        <div className="mt-3.5 text-center text-[11px] text-slate-600 font-medium tracking-wide">
          ISO-Grade Multi-Tenant Isolation • Sub-Second Knowledge Grounding
        </div>

      </div>

    </div>
  );
}
