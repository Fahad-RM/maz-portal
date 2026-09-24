"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck, User, Lock, Eye, EyeOff, Key,
  ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight,
  Sparkles, HelpCircle, Phone, MessageCircle, Mail, Globe,
  FileText, Database, X, CheckCircle
} from "lucide-react";
import { safeStorage } from "../lib/safeStorage";

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
  const [showGuideModal, setShowGuideModal]     = useState(false);

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
      safeStorage.setItem("maz_portal_api_key", data.token);
      if (data.tenant) safeStorage.setItem("maz_tenant_info", JSON.stringify(data.tenant));
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
      safeStorage.setItem("maz_admin_master_key", keyToUse);
      setAuthSuccess("Super-Admin verified! Opening Control Panel...");
      setTimeout(() => router.push("/admin"), 500);
    } catch (err: any) {
      setAuthError(err.message || "Admin authorization failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.8rem)] flex flex-col justify-between px-4 py-6 sm:py-10 overflow-x-hidden">

      {/* ═════════════════════════════════════════════════════════════════
          1. FULL-BLEED CANVAS (ZERO WHITE SPACE ON SIDES)
          ═════════════════════════════════════════════════════════════════ */}
      {/* Ambient Silk Pearl Daylight Canvas */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] pointer-events-none" />

      {/* Edge-to-Edge Background Artwork (Full 100vw, No Side Cutoffs, Soft 25% Opacity) */}
      <div 
        className="fixed inset-0 z-0 w-full h-full bg-cover bg-center pointer-events-none opacity-[0.25] transition-opacity duration-700 select-none"
        style={{ backgroundImage: "url('/ai-touch-login.jpg')" }}
        aria-hidden
      />

      {/* Diffuse Daylight Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        <div className="absolute -top-10 left-1/4 w-[500px] h-[500px] bg-cyan-200/25 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-200/25 rounded-full blur-[150px] animate-pulse-glow-fast" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          2. MAIN CONTENT STAGE (Header Taglines + Login Card)
          ═════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">

        {/* ── Match Taglines from Maifelz AI Site ── */}
        <div className="text-center mb-5 max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-2xl border border-white/95 shadow-[0_4px_16px_rgba(14,165,233,0.12)] text-[11px] font-bold text-slate-800 mb-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>MAZ 2.0 • Autonomous AI &amp; Odoo ERP Platform</span>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center gap-1 text-purple-700 hover:text-cyan-700 transition font-bold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>How to Use?</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Autonomous Intelligence for <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">Modern Enterprises</span>
          </h1>

          <p className="text-xs sm:text-[13px] text-slate-600 font-medium mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
            <Globe className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>Serving Global Enterprises Across UAE, Saudi Arabia, Kuwait, Qatar, Oman &amp; India</span>
          </p>
        </div>

        {/* ── Centered iOS 27 Liquid Glass Login Cockpit ── */}
        <div className="w-full max-w-[420px] mx-auto animate-fade-up-delay-1">
          <div className="glass-liquid-card rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 relative overflow-hidden transition-all duration-300">
            
            {/* Top Specular Meniscus Arc (Water Drop Lens) */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-full blur-[2px] pointer-events-none" />
            
            {/* Animated Cyan to Purple Top Shimmer Beam */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 animate-shimmer opacity-90" />

            {/* Logo & Platform Badge */}
            <div className="text-center mb-4 pt-1">
              <Link href="/" className="inline-block transition-transform hover:scale-105 duration-200">
                <img
                  src="/maz-logo.png"
                  alt="MAZ by Maifelz Technologies LLP"
                  className="h-9 sm:h-10 w-auto mx-auto object-contain filter drop-shadow-[0_6px_16px_rgba(115,22,91,0.18)]"
                />
              </Link>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-purple-900 bg-white/85 border border-purple-200/70 px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-600" /> Enterprise Autonomous Portal
                </span>
              </div>
            </div>

            {/* iOS 27 Water Droplet Segmented Role Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-900/[0.04] backdrop-blur-xl rounded-2xl border border-white/85 mb-4 text-xs font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
              <button
                type="button"
                onClick={() => { setActiveRole("customer"); setAuthError(null); setAuthSuccess(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRole === "customer"
                    ? "glass-water-button text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-colors"
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
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-colors"
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

                {/* FULLY BUBBLE GLASSY BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 text-white font-bold text-sm rounded-2xl glass-water-button disabled:opacity-60 flex items-center justify-center gap-2 group cursor-pointer shadow-lg"
                >
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...</>
                  ) : (
                    <>
                      <span className="drop-shadow-sm">Sign In to Studio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
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

                {/* Dark Bubble Glass Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 text-white font-bold text-sm rounded-2xl glass-water-button-dark disabled:opacity-60 flex items-center justify-center gap-2 group cursor-pointer shadow-lg"
                >
                  {isLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Authorizing Master Access...</>
                  ) : (
                    <>
                      <span>Open Control Panel</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Partner Link */}
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
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          3. DIRECT CONTACT CARDS (SAME LIKE IN MAIFELZ.COM)
          ═════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-6 animate-fade-up-delay-2">
        <div className="p-4 sm:p-5 rounded-[26px] bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_12px_32px_rgba(15,23,42,0.06)] text-center">
          
          <div className="mb-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Need Immediate Odoo ERP Consultation or Onboarding Setup?
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Our Senior Odoo Architects and AI Specialists are available 24/7.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* WhatsApp Direct */}
            <a
              href="https://wa.me/919072920222?text=Hello%20Maifelz%20Team%2C%20I%20would%20like%20to%20discuss%20an%20Odoo%20ERP%20or%20AI%20Chatbot%20onboarding."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white rounded-xl glass-bubble-emerald transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>

            {/* Direct Phone */}
            <a
              href="tel:+919072920222"
              className="px-4 py-2 text-xs font-bold text-slate-800 rounded-xl glass-bubble-frosted transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-purple-700" />
              <span>+91 90729 20222</span>
            </a>

            {/* Email Desk */}
            <a
              href="mailto:info@maifelz.com"
              className="px-4 py-2 text-xs font-bold text-slate-800 rounded-xl glass-bubble-frosted transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-600" />
              <span>info@maifelz.com</span>
            </a>
          </div>

        </div>

        {/* Global Multi-Tenant Disclaimer */}
        <div className="mt-3 text-center text-[10.5px] text-slate-500 font-medium">
          © 2026 Maifelz Technologies LLP • Enterprise-Grade Multi-Tenant Isolation • Sub-Second Streaming RAG
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          4. "HOW TO USE" INTERACTIVE LIQUID GLASS MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-up">
          <div className="w-full max-w-lg glass-liquid-card rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-white/80 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  How to Use MAZ Autonomous Studio
                </h3>
                <p className="text-xs text-slate-500">
                  Quick 4-step onboarding guide for business owners &amp; teams
                </p>
              </div>
            </div>

            {/* 4 Steps */}
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Sign in with Your Client Seat</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Enter the client email and password provided in your Maifelz Welcome Packet to access your dedicated Studio.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Ground Knowledge (AI Chatbot)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload your service catalog, FAQs, pricing PDFs, or company URLs. The AI indexes and trains itself in under 3 seconds.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Live Odoo ERP Analytics</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Connect your Odoo credentials in the Odoo tab. Ask plain questions like <em>"Show sales for August"</em> or <em>"Find customer count"</em> to get instant table reports.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Export &amp; WhatsApp Dispatch</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Download audit-ready Excel and PDF reports with 1 click, or dispatch them directly to any WhatsApp number via Meta Cloud API.
                  </p>
                </div>
              </div>
            </div>

            {/* Close CTA */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 mt-4 text-white font-bold text-xs rounded-xl glass-water-button flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Understood, Continue to Login</span>
              <CheckCircle className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
