"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, User, Lock, Eye, EyeOff, Key,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight, Sparkles, Brain, Zap, Network
} from "lucide-react";

/* ─── Inline AI SVG Illustrations ─── */
function NeuralNetSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines */}
      <line x1="30" y1="60"  x2="100" y2="40"  stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.35"/>
      <line x1="30" y1="100" x2="100" y2="40"  stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.25"/>
      <line x1="30" y1="140" x2="100" y2="100" stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.35"/>
      <line x1="30" y1="100" x2="100" y2="100" stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.35"/>
      <line x1="30" y1="60"  x2="100" y2="100" stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.2"/>
      <line x1="30" y1="140" x2="100" y2="160" stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.35"/>
      <line x1="30" y1="100" x2="100" y2="160" stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.2"/>
      <line x1="100" y1="40"  x2="170" y2="70"  stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.35"/>
      <line x1="100" y1="100" x2="170" y2="70"  stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.3"/>
      <line x1="100" y1="100" x2="170" y2="130" stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.35"/>
      <line x1="100" y1="160" x2="170" y2="130" stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.3"/>
      <line x1="100" y1="40"  x2="170" y2="130" stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.15"/>
      {/* Input nodes */}
      <circle cx="30"  cy="60"  r="7" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5"/>
      <circle cx="30"  cy="100" r="7" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5"/>
      <circle cx="30"  cy="140" r="7" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5"/>
      {/* Hidden nodes */}
      <circle cx="100" cy="40"  r="9" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" className="animate-neural"/>
      <circle cx="100" cy="100" r="10" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="2"/>
      <circle cx="100" cy="160" r="9" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" className="animate-neural" style={{animationDelay:"0.7s"}}/>
      {/* Output nodes */}
      <circle cx="170" cy="70"  r="8" fill="#faf5ff" stroke="#9333ea" strokeWidth="1.5"/>
      <circle cx="170" cy="130" r="8" fill="#faf5ff" stroke="#9333ea" strokeWidth="1.5"/>
      {/* Center glow */}
      <circle cx="100" cy="100" r="18" fill="none" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 3"/>
    </svg>
  );
}

function OrbitRingSVG() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="60" rx="48" ry="20" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-25 60 60)"/>
      <ellipse cx="60" cy="60" rx="48" ry="20" fill="none" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.25" transform="rotate(55 60 60)"/>
      <circle cx="60" cy="60" r="12" fill="url(#coreGrad)"/>
      <circle cx="60" cy="60" r="18" fill="none" stroke="#c4b5fd" strokeWidth="0.8" strokeOpacity="0.4"/>
      {/* Orbiting dots */}
      <circle cx="108" cy="60" r="4" fill="#9333ea" transform="rotate(-25 60 60)"/>
      <circle cx="12"  cy="60" r="3" fill="#a855f7" transform="rotate(55 60 60)"/>
      <defs>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ddd6fe"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Feature Badge ─── */
function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-purple-100 shadow-sm text-[10px] font-semibold text-slate-700">
      <span className="text-purple-600">{icon}</span>
      {label}
    </div>
  );
}

export default function UniqueLoginPage() {
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<"customer" | "admin">("customer");
  const [customerEmail, setCustomerEmail]     = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [adminKey, setAdminKey]               = useState("");
  const [isLoading, setIsLoading]             = useState(false);
  const [authError, setAuthError]             = useState<string | null>(null);
  const [authSuccess, setAuthSuccess]         = useState<string | null>(null);

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      if (!customerEmail.trim() || !customerPassword)
        throw new Error("Please enter your customer email and password.");
      const res  = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/auth/customer/login", {
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
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden flex items-center justify-center px-4 py-10">

      {/* ── Background ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-80px] left-[-80px] w-[480px] h-[480px] bg-purple-200/30 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[360px] h-[360px] bg-fuchsia-100/40 rounded-full blur-[100px] animate-pulse-glow-fast" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-50/60 rounded-full blur-[80px]" />
      </div>

      {/* ── Decorative grid dots ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      {/* ── Main two-column layout ── */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* LEFT — AI Illustration + Brand */}
        <div className="hidden lg:flex flex-col items-start gap-6 flex-1 animate-fade-up">
          {/* Neural illustration */}
          <div className="relative w-full max-w-[280px]">
            {/* Spinning orbit ring behind */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[220px] h-[220px] animate-spin-slower opacity-20">
                <OrbitRingSVG />
              </div>
            </div>
            {/* Neural net */}
            <div className="relative w-[240px] h-[240px] animate-float-slow mx-auto">
              <NeuralNetSVG />
            </div>
          </div>

          {/* Brand copy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 text-[11px] font-bold tracking-wider border border-purple-200/80">
                <Sparkles className="w-3 h-3" /> MAIFELZ TECHNOLOGIES
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
              Your Enterprise<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-fuchsia-600">
                AI Command Centre
              </span>
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Autonomous AI agents grounded in your business knowledge — integrated with Odoo ERP, Xero & WhatsApp.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            <FeaturePill icon={<Brain className="w-3 h-3"/>} label="RAG Knowledge Engine" />
            <FeaturePill icon={<Zap className="w-3 h-3"/>} label="Real-Time Streaming" />
            <FeaturePill icon={<Network className="w-3 h-3"/>} label="Odoo + Xero Sync" />
            <FeaturePill icon={<ShieldCheck className="w-3 h-3"/>} label="ISO-Grade Isolation" />
          </div>

          {/* Animated stat dots */}
          <div className="flex gap-4 mt-2">
            {[
              { val: "12+", label: "Yrs ERP Exp." },
              { val: "99.9%", label: "Uptime SLA" },
              { val: "24/7", label: "AI Support" },
            ].map((s) => (
              <div key={s.val} className="text-center">
                <div className="text-lg font-black text-purple-700">{s.val}</div>
                <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Login Card */}
        <div className="w-full max-w-[400px] flex-shrink-0 animate-fade-up-delay-1">

          {/* Mobile brand logo */}
          <div className="lg:hidden text-center mb-6 animate-float">
            <Link href="/" className="inline-block">
              <img
                src="/maz-logo.png"
                alt="MAZ Maifelz Technologies LLP"
                className="h-10 w-auto mx-auto object-contain drop-shadow-[0_6px_16px_rgba(115,22,91,0.2)]"
              />
            </Link>
            <div className="mt-2.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-700 bg-purple-50 border border-purple-200/80 px-3 py-0.5 rounded-full">
                Autonomous AI Business Platform
              </span>
            </div>
          </div>

          {/* Glass card */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/90 shadow-2xl shadow-purple-950/[0.08] relative overflow-hidden">

            {/* Shimmer top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 rounded-t-3xl animate-shimmer" />

            {/* Role Switcher Pill */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeRole === "customer"
                    ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 text-white shadow-md shadow-purple-900/20"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className="w-3.5 h-3.5" /> Customer Portal
              </button>
              <button
                type="button"
                onClick={() => { setActiveRole("admin"); setAuthError(null); setAuthSuccess(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeRole === "admin"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
              </button>
            </div>

            {/* Feedback banners */}
            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* CUSTOMER FORM */}
            {activeRole === "customer" ? (
              <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
                <p className="text-[11px] text-slate-500 font-medium -mt-1 mb-3">
                  Sign in with your Maifelz-issued client credentials.
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
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 text-slate-900 placeholder:text-slate-400 transition font-medium"
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
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-purple-600 transition"
                      aria-label="Toggle visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 disabled:opacity-60 text-white rounded-xl font-bold transition shadow-md shadow-purple-900/20 hover:shadow-lg hover:shadow-purple-900/30 hover:-translate-y-px flex items-center justify-center gap-2 mt-1 group"
                >
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : (
                    <>Sign In to Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></>
                  )}
                </button>
              </form>
            ) : (
              /* ADMIN FORM */
              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <div className="mb-1">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" /> Master Authorization
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Restricted to authorized Maifelz administrators only.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-700" /> Master Passkey
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Master Super-Admin Passkey"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl font-bold transition shadow-md shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-px flex items-center justify-center gap-2 mt-1 group"
                >
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Authorizing...</>
                  ) : (
                    <>Open Control Panel <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></>
                  )}
                </button>
              </form>
            )}

            {/* Bottom divider links */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Official Odoo Partner</span>
              <Link href="/pricing" className="inline-flex items-center gap-1 text-purple-700 font-bold hover:text-purple-900 transition">
                View Pricing <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Trust badges below card */}
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap animate-fade-up-delay-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> ISO-Grade Isolation
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span> Multi-Tenant SaaS
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span> 99.9% Uptime
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
