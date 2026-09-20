"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, User, Lock, Eye, EyeOff, Key,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight,
  Sparkles, Cpu, Database, Zap, Bot, Check
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
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* ── Ambient Fluid Lights (Cyan, Lavender, Magenta matching the artwork) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-200/35 via-sky-200/20 to-transparent rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-gradient-to-bl from-purple-200/30 via-fuchsia-100/25 to-transparent rounded-full blur-[150px] animate-pulse-glow-fast" />
        <div className="absolute -bottom-20 left-1/3 w-[650px] h-[450px] bg-gradient-to-t from-blue-100/40 via-indigo-100/20 to-transparent rounded-full blur-[130px]" />
      </div>

      {/* ── Main Executive Canvas Container ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN: Liquid Glass Artwork Showcase (iOS 27 Vision)
              ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col animate-fade-up">

            {/* Micro Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_4px_16px_rgba(115,22,91,0.06)] text-[11px] font-bold text-purple-900 w-fit mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Autonomous AI Intelligence • Odoo Official Partner</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-3">
              Where <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">Enterprise AI</span> Meets Human Intuition.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mb-6 leading-relaxed">
              Ground autonomous AI agents in your business knowledge base, automate customer engagement, and query live Odoo ERP records in seconds.
            </p>

            {/* ── Futuristic Liquid Glass Art Capsule ── */}
            <div className="relative group rounded-[32px] sm:rounded-[38px] p-2 bg-gradient-to-b from-white/80 via-white/40 to-white/70 backdrop-blur-3xl border border-white/95 shadow-[0_25px_60px_-15px_rgba(14,165,233,0.15),0_15px_35px_-10px_rgba(115,22,91,0.12),inset_0_2px_4px_rgba(255,255,255,0.95)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_-12px_rgba(14,165,233,0.22),0_18px_40px_-8px_rgba(115,22,91,0.18)]">
              
              {/* Inner Image Stage */}
              <div className="relative rounded-[26px] sm:rounded-[32px] overflow-hidden aspect-[16/9] sm:aspect-[16/9.2] bg-slate-900/5">
                <img
                  src="/ai-touch-login.png"
                  alt="AI and Human Synergy — MAZ Autonomous Business Intelligence"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />

                {/* Soft specular sheen overlay across image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-white/20 pointer-events-none" />

                {/* Floating Telemetry Glass Badges inside the frame */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/25 text-[11px] font-semibold text-white shadow-lg">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>MAZ 2.0 Autonomous Agent Engine</span>
                </div>

                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 text-[11px] font-bold text-slate-800 shadow-xl">
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>Live Odoo 18 ERP Gateway</span>
                </div>
              </div>

              {/* Liquid Feature Ticker below Artwork */}
              <div className="px-3 pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 shadow-xs">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span>Sub-Second Streaming RAG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shadow-xs">
                    <Bot className="w-3 h-3" />
                  </div>
                  <span>Self-Learning Knowledge Base</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>ISO Multi-Tenant Security</span>
                </div>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN: iOS 27 Liquid Glass Login Capsule
              ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col items-center animate-fade-up-delay-1">

            {/* The iOS 27 Liquid Glass Card */}
            <div className="w-full glass-liquid-card rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
              
              {/* Specular Liquid Top Arc Highlight */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-gradient-to-b from-white/95 to-transparent rounded-full blur-[2px] pointer-events-none" />
              
              {/* Animated Top Shimmer */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 animate-shimmer opacity-90" />

              {/* Brand Header */}
              <div className="text-center mb-6 pt-1">
                <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
                  <img
                    src="/maz-logo.png"
                    alt="MAZ Maifelz Technologies LLP"
                    className="h-10 sm:h-11 w-auto mx-auto object-contain filter drop-shadow-[0_8px_20px_rgba(115,22,91,0.18)]"
                  />
                </Link>
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  <span className="text-[10.5px] font-bold tracking-wider uppercase text-purple-700 bg-white/80 border border-purple-200/80 px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" /> Autonomous Business Portal
                  </span>
                </div>
              </div>

              {/* iOS 27 Water Droplet Segmented Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-200/60 backdrop-blur-xl rounded-2xl border border-white/80 mb-5 text-xs font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeRole === "customer"
                      ? "glass-water-button text-white font-bold"
                      : "text-slate-600 hover:text-slate-900 transition-colors"
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Customer Studio
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveRole("admin"); setAuthError(null); setAuthSuccess(null); }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeRole === "admin"
                      ? "glass-water-button-dark text-white font-bold"
                      : "text-slate-600 hover:text-slate-900 transition-colors"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
                </button>
              </div>

              {/* Feedback Alerts */}
              {authError && (
                <div className="mb-4 p-3 bg-rose-50/90 backdrop-blur-md border border-rose-200/80 text-rose-700 rounded-2xl text-xs flex items-start gap-2 shadow-sm animate-fade-up">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="mb-4 p-3 bg-emerald-50/90 backdrop-blur-md border border-emerald-200/80 text-emerald-700 rounded-2xl text-xs flex items-start gap-2 shadow-sm animate-fade-up">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* ──────────────── CUSTOMER LOGIN FORM ──────────────── */}
              {activeRole === "customer" ? (
                <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
                  <p className="text-[11.5px] text-slate-500 font-medium -mt-1 mb-2">
                    Sign in with your enterprise credentials to access your live AI &amp; ERP Studio.
                  </p>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600" /> Customer Email
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
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-600" /> Password
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
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-purple-600 transition"
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
                    <p className="text-[11.5px] text-slate-500 mt-1">
                      Restricted to authorized Maifelz Technologies operators.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
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
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Official Odoo ERP Partner
                </span>
                <Link href="/pricing" className="inline-flex items-center gap-1 text-purple-700 font-bold hover:text-purple-900 transition">
                  Plans &amp; Pricing <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

            </div>

            {/* Lightweight Attribution */}
            <div className="mt-4 text-center text-[11px] text-slate-500 font-medium tracking-wide">
              Protected by Multi-Tenant Encryption • Sub-Second Knowledge Grounding
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
