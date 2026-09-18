"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, User, Lock, Eye, EyeOff, Key, 
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight
} from "lucide-react";

export default function CenteredLightLogin() {
  const router = useRouter();

  // Role Tab: 'customer' | 'admin'
  const [activeRole, setActiveRole] = useState<"customer" | "admin">("customer");

  // Customer Login State (Strictly username/email and password - no API key)
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Admin Login State (Always strictly requires password - no default key)
  const [adminKey, setAdminKey] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Handle Customer Login
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (!customerEmail.trim() || !customerPassword) {
        throw new Error("Please enter your customer email and password.");
      }

      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customerEmail.trim(), password: customerPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password. Please verify your credentials.");
      }

      localStorage.setItem("maz_portal_api_key", data.token);
      if (data.tenant) {
        localStorage.setItem("maz_tenant_info", JSON.stringify(data.tenant));
      }
      
      setAuthSuccess("Credentials verified! Loading your Customer Studio...");
      setTimeout(() => {
        router.push(`/dashboard?key=${encodeURIComponent(data.token)}`);
      }, 500);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
      setIsLoading(false);
    }
  };

  // Handle Super Admin Login - ALWAYS REQUIRES PASSWORD
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
        headers: { "X-SUPER-ADMIN-KEY": keyToUse }
      });

      if (!res.ok) {
        throw new Error("Invalid Super Admin Master Passkey. Access denied.");
      }

      localStorage.setItem("maz_admin_master_key", keyToUse);
      setAuthSuccess("Super-Admin verified! Opening Control Panel...");
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } catch (err: any) {
      setAuthError(err.message || "Admin authorization failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-purple-50/30 text-slate-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient Pulsing Glows (Light Berry Purple & Lavender) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-fuchsia-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-slate-200/50 rounded-full blur-[90px] pointer-events-none" />

      {/* Centered Luxury Glassmorphism Card */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Animated Brand Header */}
        <div className="text-center mb-6 animate-float">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
            <img 
              src="/maz-logo.png" 
              alt="MAZ Maifelz Technologies LLP" 
              className="h-11 sm:h-12 w-auto mx-auto object-contain filter drop-shadow-[0_8px_18px_rgba(115,22,91,0.22)]"
            />
          </Link>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-purple-700 bg-purple-50 border border-purple-200/80 px-3 py-0.5 rounded-full shadow-sm">
              Autonomous AI Business Platform
            </span>
          </div>
        </div>

        {/* The Light Glass Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl shadow-purple-950/5 relative">
          
          {/* Role Switcher Pill */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                activeRole === "customer"
                  ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 text-white shadow-md shadow-purple-900/25"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Customer Portal
            </button>

            <button
              type="button"
              onClick={() => { setActiveRole("admin"); setAuthError(null); setAuthSuccess(null); }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                activeRole === "admin"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
            </button>
          </div>

          {/* Feedback Banners */}
          {authError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* ROLE 1: CUSTOMER LOGIN (Email/Username & Password Only) */}
          {activeRole === "customer" ? (
            <div>
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-medium">
                  Sign in with your Maifelz-issued client credentials to access your AI Assistant Studio.
                </p>
              </div>

              <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" /> Customer Email / Username
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-900 placeholder:text-slate-400 transition font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-600" /> Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your customer password"
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-900 font-mono placeholder:text-slate-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white rounded-xl font-bold transition shadow-md shadow-purple-900/25 flex items-center justify-center gap-2 mt-4 group"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                    </>
                  ) : (
                    <>
                      Sign In to Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ROLE 2: SUPER-ADMIN LOGIN - ALWAYS REQUIRES PASSWORD */
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" /> Super-Admin Master Authorization
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Master credentials are required to access the tenant management control panel.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-700" /> Master Passkey / Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Master Super-Admin Passkey"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-900 font-mono placeholder:text-slate-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 group mt-4"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Authorizing...
                    </>
                  ) : (
                    <>
                      Open Control Panel <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400 font-medium">
                Restricted to authorized Maifelz Technologies administrators.
              </div>
            </div>
          )}

        </div>

        {/* Clean Below-Card Links (Pricing & Info) */}
        <div className="mt-6 text-center space-y-2">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 transition"
          >
            <span>Looking for subscription plans &amp; quota limits?</span>
            <span className="text-purple-700 font-bold underline flex items-center">
              View Pricing <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </Link>

          <div className="text-[11px] text-slate-400">
            Official Odoo Partner • ISO-Grade Multi-Tenant Isolation
          </div>
        </div>

      </div>
    </div>
  );
}
