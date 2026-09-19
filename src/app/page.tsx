"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, User, Lock, Eye, EyeOff, Key,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight, Sparkles
} from "lucide-react";

export default function CenteredLoginPage() {
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
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden flex flex-col items-center justify-center px-4 py-8">

      {/* ── Ambient Soft Glow (Light & Airy) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-200/25 rounded-full blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[380px] h-[380px] bg-fuchsia-100/30 rounded-full blur-[100px]" />
      </div>

      {/* ── Centered Main Container ── */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center animate-fade-up">

        {/* Brand Logo & Tagline Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
            <img
              src="/maz-logo.png"
              alt="MAZ Maifelz Technologies LLP"
              className="h-10 sm:h-11 w-auto mx-auto object-contain filter drop-shadow-[0_6px_16px_rgba(115,22,91,0.18)]"
            />
          </Link>
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <span className="text-[10.5px] font-bold tracking-wider uppercase text-purple-700 bg-purple-50 border border-purple-200/70 px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" /> Autonomous AI Business Platform
            </span>
          </div>
        </div>

        {/* Ultra-Glossy 3D Glass Bubble Card */}
        <div className="w-full bg-white/75 backdrop-blur-3xl rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-[0_20px_50px_rgba(115,22,91,0.12),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(115,22,91,0.05)] relative overflow-hidden transition-all duration-300">
          
          {/* Specular Bubble Top Highlight Arc */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[2px] pointer-events-none" />
          
          {/* Subtle Top Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 animate-shimmer opacity-80" />

          {/* Role Switcher Pill */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/70 backdrop-blur-md rounded-2xl border border-slate-200/60 mb-5 text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === "customer"
                  ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 text-white shadow-[0_4px_14px_rgba(115,22,91,0.35)]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Customer Portal
            </button>
            <button
              type="button"
              onClick={() => { setActiveRole("admin"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === "admin"
                  ? "bg-slate-900 text-white shadow-[0_4px_14px_rgba(15,23,42,0.3)]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
            </button>
          </div>

          {/* Feedback Banners */}
          {authError && (
            <div className="mb-4 p-3 bg-rose-50/90 backdrop-blur-sm border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-start gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 rounded-2xl text-xs flex items-start gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* CUSTOMER LOGIN FORM */}
          {activeRole === "customer" ? (
            <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
              <p className="text-[11px] text-slate-500 font-medium -mt-1 mb-2">
                Sign in with your Maifelz-issued client credentials to access your Studio.
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
                  className="w-full px-3.5 py-2.5 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-slate-900 placeholder:text-slate-400 transition font-medium shadow-inner"
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
                    className="w-full px-3.5 py-2.5 pr-10 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans transition shadow-inner"
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
                className="w-full py-3 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 disabled:opacity-60 text-white rounded-xl font-bold transition shadow-md shadow-purple-900/20 hover:shadow-lg hover:shadow-purple-900/30 hover:-translate-y-px flex items-center justify-center gap-2 mt-2 group"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</>
                ) : (
                  <>Sign In to Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></>
                )}
              </button>
            </form>
          ) : (
            /* SUPER-ADMIN LOGIN FORM */
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
                  className="w-full px-3.5 py-2.5 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl font-bold transition shadow-md shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-px flex items-center justify-center gap-2 mt-2 group"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Authorizing...</>
                ) : (
                  <>Open Control Panel <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></>
                )}
              </button>
            </form>
          )}

          {/* Bottom Link to Pricing */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Official Odoo Partner</span>
            <Link href="/pricing" className="inline-flex items-center gap-1 text-purple-700 font-bold hover:text-purple-900 transition">
              View Pricing <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Lightweight Footer Attribution */}
        <div className="mt-4 text-center text-[11px] text-slate-400 font-medium">
          ISO-Grade Multi-Tenant Isolation • Sub-Second Knowledge Grounding
        </div>

      </div>
    </div>
  );
}
