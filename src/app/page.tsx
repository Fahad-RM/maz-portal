"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, User, Lock, Eye, EyeOff, Key, 
  ArrowRight, Sparkles, RefreshCw, AlertCircle, 
  CheckCircle2, Zap, ArrowUpRight
} from "lucide-react";

export default function CenteredSuperbLogin() {
  const router = useRouter();

  // Role Tab: 'customer' | 'admin'
  const [activeRole, setActiveRole] = useState<"customer" | "admin">("customer");

  // Customer Login State
  const [customerMethod, setCustomerMethod] = useState<"credentials" | "apiKey">("credentials");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [customerApiKey, setCustomerApiKey] = useState("");

  // Admin Login State
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
      if (customerMethod === "credentials") {
        if (!customerEmail || !customerPassword) {
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
      } else {
        if (!customerApiKey) {
          throw new Error("Please enter your Client API Key.");
        }

        const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/bots", {
          headers: { "X-MAZ-API-KEY": customerApiKey.trim() }
        });

        if (!res.ok) {
          throw new Error("Invalid API key or inactive customer seat.");
        }

        localStorage.setItem("maz_portal_api_key", customerApiKey.trim());
        setAuthSuccess("API Key verified! Loading your Customer Studio...");
        setTimeout(() => {
          router.push(`/dashboard?key=${encodeURIComponent(customerApiKey.trim())}`);
        }, 500);
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
      setIsLoading(false);
    }
  };

  // Handle Super Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const keyToUse = adminKey.trim() || "maifelz_super_admin_secret_key";

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

  // Demo Account Quick Login
  const loadDemoAccount = () => {
    setCustomerMethod("apiKey");
    setCustomerApiKey("maz_live_maifelz_prod_2026");
    localStorage.setItem("maz_portal_api_key", "maz_live_maifelz_prod_2026");
    setIsLoading(true);
    setAuthSuccess("Loading Maifelz Live Demo Studio...");
    setTimeout(() => {
      router.push("/dashboard?key=maz_live_maifelz_prod_2026");
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Theme Ambient Pulsing Glows (Logo-inspired Berry Purple & Slate) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-900/25 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-fuchsia-950/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-slate-800/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Centered Luxury Glassmorphism Card */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Animated Brand Header */}
        <div className="text-center mb-6 animate-float">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
            <img 
              src="/maz-logo.png" 
              alt="MAZ Maifelz Technologies LLP" 
              className="h-11 sm:h-12 w-auto mx-auto object-contain filter drop-shadow-[0_10px_20px_rgba(115,22,91,0.35)] brightness-105"
            />
          </Link>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              Autonomous AI Business Platform
            </span>
          </div>
        </div>

        {/* The Card */}
        <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl shadow-purple-950/40 relative">
          
          {/* Role Switcher Pill */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveRole("customer"); setAuthError(null); }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                activeRole === "customer"
                  ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 text-white shadow-lg shadow-purple-900/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Customer Portal
            </button>

            <button
              type="button"
              onClick={() => { setActiveRole("admin"); setAuthError(null); }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                activeRole === "admin"
                  ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
            </button>
          </div>

          {/* Feedback Banners */}
          {authError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* ROLE 1: CUSTOMER LOGIN */}
          {activeRole === "customer" ? (
            <div>
              {/* Method Switcher */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5 text-xs font-semibold">
                <span className="text-slate-400">Sign in to your client seat:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerMethod("credentials")}
                    className={`px-2 py-0.5 rounded-md transition ${
                      customerMethod === "credentials" 
                        ? "bg-purple-900/40 text-purple-300 font-bold" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Password
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => setCustomerMethod("apiKey")}
                    className={`px-2 py-0.5 rounded-md transition ${
                      customerMethod === "apiKey" 
                        ? "bg-purple-900/40 text-purple-300 font-bold" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    API Key
                  </button>
                </div>
              </div>

              <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
                {customerMethod === "credentials" ? (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" /> Customer Email / Username
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@company.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/15 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 placeholder:text-slate-600 transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-purple-400" /> Password
                        </label>
                        <span className="text-[11px] text-slate-500">Issued by Maifelz</span>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Enter your customer password"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-950/80 border border-white/15 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 font-mono placeholder:text-slate-600 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-purple-400" /> Client API Key
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="maz_live_..."
                      value={customerApiKey}
                      onChange={(e) => setCustomerApiKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/15 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 font-mono placeholder:text-slate-600 transition"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2 group"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      Sign In to Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo button */}
              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={loadDemoAccount}
                  className="text-xs text-purple-300 hover:text-purple-200 font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Explore with Live Demo Studio
                </button>
              </div>
            </div>
          ) : (
            /* ROLE 2: SUPER-ADMIN LOGIN */
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Super-Admin Master Authorization
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Provision client seats, assign monthly message quotas, and reset customer credentials.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" /> Master Secret Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setAdminKey("maifelz_super_admin_secret_key")}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold"
                    >
                      Use Default
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter Master Super-Admin Key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-white/15 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-100 font-mono placeholder:text-slate-600 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-bold transition shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                    </>
                  ) : (
                    <>
                      Open Control Panel <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/10 text-center text-[11px] text-slate-500">
                Restricted to authorized Maifelz Technologies personnel.
              </div>
            </div>
          )}

        </div>

        {/* Clean Below-Card Links (Pricing & Info) */}
        <div className="mt-6 text-center space-y-2">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-300 transition"
          >
            <span>Looking for subscription plans &amp; quota limits?</span>
            <span className="text-purple-400 font-bold underline flex items-center">
              View Pricing <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </Link>

          <div className="text-[11px] text-slate-600">
            Official Odoo Partner • ISO-Grade Multi-Tenant Isolation
          </div>
        </div>

      </div>
    </div>
  );
}
