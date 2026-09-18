"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, ShieldCheck, Zap, Database, Cpu, CheckCircle2, 
  ArrowRight, Key, User, Lock, Eye, EyeOff, Sparkles, 
  Globe, Flame, RefreshCw, BarChart3, AlertCircle, 
  ExternalLink, Layers, Check, MessageSquare
} from "lucide-react";

export default function SuperbPortalLogin() {
  const router = useRouter();

  // Active Tab: 'customer' | 'admin'
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
          throw new Error(data.detail || "Invalid login credentials. Please check your email and password.");
        }

        // Save token and metadata
        localStorage.setItem("maz_portal_api_key", data.token);
        if (data.tenant) {
          localStorage.setItem("maz_tenant_info", JSON.stringify(data.tenant));
        }
        
        setAuthSuccess("Authentication successful! Loading your Customer Studio...");
        setTimeout(() => {
          router.push(`/dashboard?key=${encodeURIComponent(data.token)}`);
        }, 600);
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
        }, 600);
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
      setAuthSuccess("Super-Admin verified! Redirecting to Control Panel...");
      setTimeout(() => {
        router.push("/admin");
      }, 600);
    } catch (err: any) {
      setAuthError(err.message || "Admin authorization failed.");
      setIsLoading(false);
    }
  };

  // Quick Demo Login Helper
  const loadDemoAccount = () => {
    setCustomerMethod("apiKey");
    setCustomerApiKey("maz_live_maifelz_prod_2026");
    localStorage.setItem("maz_portal_api_key", "maz_live_maifelz_prod_2026");
    setIsLoading(true);
    setAuthSuccess("Loading Maifelz Technologies Live Showcase...");
    setTimeout(() => {
      router.push("/dashboard?key=maz_live_maifelz_prod_2026");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Features, Branding & SEO Narrative */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-blue-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                MAZ Enterprise AI Platform
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Authorized Odoo ERP Partner
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Gemini 3.5 Flash-Lite Engine
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Autonomous AI Agents <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Grounded in Company Truth.
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Empower your business with AI agents that talk directly from your official knowledge base, qualify leads via BANT criteria, and synchronize real-time CRM & accounting records with Odoo ERP & Xero.
              </p>
            </div>

            {/* Core Feature Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                  <Database className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-200 text-sm mb-1">Hybrid Multi-Source RAG</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ingest PDFs, Word docs, web pages, and FAQs. Zero hallucination with strict temperature grounding.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-200 text-sm mb-1">Odoo ERP & Xero Sync</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated webhooks push qualified leads, chat transcripts, and invoice settlements directly to your CRM.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-200 text-sm mb-1">AI BANT Lead Scoring</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time intent classification (Hot, Warm, Cold) with AI decision rationale sent to sales reps.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-200 text-sm mb-1">Multi-Tenant Seat Security</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Isolated row-level multi-tenancy. Every client seat has dedicated quotas and private bot training data.
                </p>
              </div>
            </div>

            {/* Performance Stats Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-black text-white tracking-tight">&lt; 0.3s</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Streaming Latency</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-black text-emerald-400 tracking-tight">$0.25 / 1M</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Ultra-Low Cost RAG</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-black text-indigo-400 tracking-tight">&lt; 35 KB</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Zero-Latency Widget</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Glassmorphism Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl shadow-blue-950/50 relative">
              
              {/* Role Switcher Tab (Customer vs Admin) */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setActiveRole("customer"); setAuthError(null); }}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                    activeRole === "customer"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
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
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Super-Admin
                </button>
              </div>

              {/* Notification / Error Alerts */}
              {authError && (
                <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* TAB 1: CUSTOMER LOGIN */}
              {activeRole === "customer" ? (
                <div>
                  <div className="mb-5">
                    <h3 className="text-xl font-black text-white tracking-tight">Customer Portal Login</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Sign in to manage your AI assistant, knowledge base, leads, and monthly message quota.
                    </p>
                  </div>

                  {/* Customer Auth Method Sub-tabs */}
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setCustomerMethod("credentials")}
                      className={`pb-1 transition border-b-2 ${
                        customerMethod === "credentials"
                          ? "border-blue-500 text-blue-400 font-bold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Email & Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerMethod("apiKey")}
                      className={`pb-1 transition border-b-2 ${
                        customerMethod === "apiKey"
                          ? "border-blue-500 text-blue-400 font-bold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Client API Key
                    </button>
                  </div>

                  <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
                    {customerMethod === "credentials" ? (
                      <>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-400" /> Customer Email / Username
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. client@company.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-white/15 rounded-xl outline-none focus:border-blue-500 text-slate-100 placeholder:text-slate-600 transition"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
                            </label>
                            <span className="text-[11px] text-slate-500">Provided by Admin</span>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="Enter your customer password"
                              value={customerPassword}
                              onChange={(e) => setCustomerPassword(e.target.value)}
                              className="w-full px-3.5 py-2.5 pr-10 bg-slate-950/70 border border-white/15 rounded-xl outline-none focus:border-blue-500 text-slate-100 font-mono placeholder:text-slate-600 transition"
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
                          <Key className="w-3.5 h-3.5 text-blue-400" /> Client API Key
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="maz_live_..."
                          value={customerApiKey}
                          onChange={(e) => setCustomerApiKey(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-white/15 rounded-xl outline-none focus:border-blue-500 text-slate-100 font-mono placeholder:text-slate-600 transition"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                        </>
                      ) : (
                        <>
                          Sign In to Customer Studio <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Demo account quick login */}
                  <div className="mt-5 pt-4 border-t border-white/10 text-center">
                    <button
                      type="button"
                      onClick={loadDemoAccount}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 underline transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Explore with Maifelz Live Demo Studio
                    </button>
                  </div>
                </div>
              ) : (
                /* TAB 2: MASTER ADMIN LOGIN */
                <div>
                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white tracking-tight">Super-Admin Access</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Restricted
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage client seats, provision new customer accounts, set monthly quotas, and review global metrics.
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-400" /> Super Admin Master Passkey
                        </label>
                        <button
                          type="button"
                          onClick={() => setAdminKey("maifelz_super_admin_secret_key")}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline"
                        >
                          Use Default Key
                        </button>
                      </div>
                      <input
                        type="password"
                        placeholder="Enter master key (or click 'Use Default Key')"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-white/15 rounded-xl outline-none focus:border-amber-500 text-slate-100 font-mono placeholder:text-slate-600 transition"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Direct authorization with your secure backend environment key.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Passkey...
                        </>
                      ) : (
                        <>
                          Open Super-Admin Control Panel <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
                    Need new customer seats provisioned? Access the Master Panel to generate temporary passwords.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Branding & SEO links */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Maifelz Technologies LLP</span>
            <span>•</span>
            <span>Official Odoo ERP Partner & Autonomous AI Solutions</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://www.maifelz.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              Official Website
            </a>
            <span>•</span>
            <a href="https://maz-backend-t1hy.onrender.com/docs" target="_blank" rel="noreferrer" className="hover:text-white transition">
              API Documentation
            </a>
            <span>•</span>
            <span>Privacy & Multi-Tenant Isolation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
