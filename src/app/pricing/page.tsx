"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, Sparkles, ArrowRight, Bot, 
  HelpCircle, MessageSquare, Database, ShieldCheck, Flame, BarChart3,
  MessageCircle, Globe
} from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 text-slate-900 py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Simple, Transparent, Ultra-Affordable Omnichannel AI
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            Enterprise AI Power for <br />
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-900 bg-clip-text text-transparent">
              Website, WhatsApp &amp; Odoo ERP.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Deploy autonomous AI across your Website and WhatsApp channels, unlock natural language Odoo ERP analytics, or bundle all 3 for complete operational automation.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Yearly Billing</span>
              <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Save ~33%
              </span>
            </button>
          </div>
        </div>

        {/* 3-Card Modular Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          
          {/* CARD 1: OMNICHANNEL CHATBOT (WEB + WHATSAPP) */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between relative">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Web + WhatsApp AI</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Omnichannel AI Chatbot</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900">{isAnnual ? "$120" : "$15"}</span>
                <span className="text-slate-500 font-semibold text-xs">/ {isAnnual ? "year" : "month"}</span>
              </div>
              {isAnnual && (
                <div className="text-[11px] font-semibold text-emerald-600 mb-4">
                  Equivalent to just $10 / month (Save $60/yr!)
                </div>
              )}
              {!isAnnual && (
                <div className="text-[11px] text-slate-400 mb-4">Billed monthly. Cancel anytime.</div>
              )}

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Autonomous 24/7 customer service across your website widget and official WhatsApp number, trained on company documents and links.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Website Embed Widget (<code className="text-[11px]">maz.js</code>)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Meta Cloud WhatsApp Bot</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Real-time WhatsApp typing simulation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sub-second streaming RAG &amp; document uploads</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Interactive Lead Capture &amp; Scorecard</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Custom brand avatar, colors &amp; chips</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/login?service=chatbot"
                className="w-full py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 shadow-md"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CARD 2: ODOO ERP AI COPILOT & ANALYTICS */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between relative">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Odoo ERP AI Copilot</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Conversational ERP Analytics</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900">{isAnnual ? "$120" : "$15"}</span>
                <span className="text-slate-500 font-semibold text-xs">/ {isAnnual ? "year" : "month"}</span>
              </div>
              {isAnnual && (
                <div className="text-[11px] font-semibold text-emerald-600 mb-4">
                  Equivalent to just $10 / month (Save $60/yr!)
                </div>
              )}
              {!isAnnual && (
                <div className="text-[11px] text-slate-400 mb-4">Billed monthly. Cancel anytime.</div>
              )}

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Direct natural language queries into your live Odoo ERP with instant charts, Excel/PDF downloads, and WhatsApp report dispatches.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Plain English ERP Queries</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Real-time Odoo ORM query execution</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Automated Chart &amp; KPI Visualization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>1-Click Excel &amp; PDF Report Export</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>WhatsApp Summary &amp; Alert Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Read-only ORM guardrails &amp; zero data leakage</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/login?service=odoo"
                className="w-full py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 shadow-md"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CARD 3: COMPLETE OMNICHANNEL ENTERPRISE SUITE (WEB + WHATSAPP + ODOO ERP) - FEATURED */}
          <div className="bg-white rounded-3xl p-7 border-2 border-purple-600 shadow-xl shadow-purple-900/10 relative flex flex-col justify-between hover:shadow-2xl transition duration-300 ring-2 ring-purple-500/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
              💎 Best Value • All 3 Channels
            </div>

            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">Web + WhatsApp + Odoo ERP</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ultimate Omnichannel Suite</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-purple-900">{isAnnual ? "$200" : "$25"}</span>
                <span className="text-slate-500 font-semibold text-xs">/ {isAnnual ? "year" : "month"}</span>
              </div>
              {isAnnual && (
                <div className="text-[11px] font-semibold text-emerald-600 mb-4">
                  Equivalent to just $16.60 / month (Save $100/yr!)
                </div>
              )}
              {!isAnnual && (
                <div className="text-[11px] text-slate-400 mb-4">Billed monthly. Save over 30% with annual.</div>
              )}

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                All 3 engines unified: 24/7 Website AI Chatbot + WhatsApp Meta Cloud Bot + Live Odoo ERP Analytics &amp; Reports.
              </p>

              <div className="space-y-3 pt-4 border-t border-purple-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0 font-bold" />
                  <span className="font-bold text-slate-900">EVERYTHING in Omnichannel Chatbot</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0 font-bold" />
                  <span className="font-bold text-slate-900">EVERYTHING in Odoo ERP Analytics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="font-semibold text-purple-800">Bi-directional CRM Lead Sync</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Automated WhatsApp CRM &amp; KPI Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Priority 24/7 Dedicated SLA Support</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Implementation Support by Maifelz Technologies LLP</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/login?service=full"
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
              >
                Get Full Suite <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Feature Comparison Table / Highlights */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm max-w-4xl mx-auto mb-16">
          <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">Can I start with only Web + WhatsApp?</h4>
              <p>Yes! Our plans are completely modular. You can start with Omnichannel AI Chatbot (Web + WhatsApp) at $15/month, and upgrade to include Odoo ERP Analytics anytime with zero setup fees.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">How does WhatsApp Meta Cloud integration work?</h4>
              <p>MAZ integrates directly with Meta Cloud API. Incoming customer messages are processed with intelligent RAG, simulating a typing indicator before delivering rapid, accurate responses.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">How does Odoo Analytics connect safely?</h4>
              <p>MAZ uses read-only ORM connections and never executes destructive SQL. All queries are strictly sanitized, and customer data never leaves your isolated environment.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">How do I embed the chatbot on my site?</h4>
              <p>Copy one simple line of code into your WordPress, Shopify, Next.js, or HTML site. It works immediately and is fully optimized for iOS Safari, Android, and desktop.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Have specific enterprise requirements?</h3>
          <p className="text-xs text-slate-500 mb-4">Our team at Maifelz Technologies LLP can build custom OWL apps, workflow automations, and private LLM models.</p>
          <a
            href="mailto:info@maifelz.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
          >
            Speak with an Enterprise Consultant
          </a>
        </div>

      </div>
    </div>
  );
}
