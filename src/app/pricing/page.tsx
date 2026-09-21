"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, Sparkles, ArrowRight, Bot, 
  HelpCircle, MessageSquare, Database, ShieldCheck, Flame, BarChart3
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
            Simple, Transparent, Ultra-Affordable Pricing
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            Enterprise AI Power for <br />
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-900 bg-clip-text text-transparent">
              Every Growing Business.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Select standalone AI Customer Support, Conversational Odoo ERP Analytics, or combine both for full operational automation.
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
                Save ~17%
              </span>
            </button>
          </div>
        </div>

        {/* 3-Card Modular Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          
          {/* CARD 1: CHATBOT ONLY */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between relative">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">AI Chatbot Only</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Customer Service &amp; Leads</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900">{isAnnual ? "$100" : "$10"}</span>
                <span className="text-slate-500 font-semibold text-xs">/ {isAnnual ? "year" : "month"}</span>
              </div>
              {isAnnual && (
                <div className="text-[11px] font-semibold text-emerald-600 mb-4">
                  Equivalent to just $8.33 / month (2 months free!)
                </div>
              )}
              {!isAnnual && (
                <div className="text-[11px] text-slate-400 mb-4">Billed monthly. Cancel anytime.</div>
              )}

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Autonomous 24/7 customer support widget trained on your PDFs, website links, and company knowledge.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Unlimited conversations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>1-line embed script (<code className="text-[11px]">maz.js</code>)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sub-second streaming RAG</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Interactive Lead Capture Card</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Custom brand colors &amp; avatar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Full conversation transcript logs</span>
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

          {/* CARD 2: ODOO ERP ANALYTICS ONLY */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between relative">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Odoo Analytics Only</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Conversational ERP Gateway</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900">{isAnnual ? "$100" : "$10"}</span>
                <span className="text-slate-500 font-semibold text-xs">/ {isAnnual ? "year" : "month"}</span>
              </div>
              {isAnnual && (
                <div className="text-[11px] font-semibold text-emerald-600 mb-4">
                  Equivalent to just $8.33 / month (2 months free!)
                </div>
              )}
              {!isAnnual && (
                <div className="text-[11px] text-slate-400 mb-4">Billed monthly. Cancel anytime.</div>
              )}

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Direct natural language queries into your live Odoo ERP with instant charts, Excel/PDF downloads, and WhatsApp alerts.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Plain English ERP Queries</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Real-time Odoo ORM execution</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Automated Chart &amp; Metric Generation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>1-Click Excel &amp; PDF Export</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>WhatsApp Report Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Zero SQL schema leakage guardrails</span>
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

          {/* CARD 3: FULL SUITE (CHATBOT + ODOO ERP) - FEATURED */}
          <div className="bg-white rounded-3xl p-7 border-2 border-purple-600 shadow-xl shadow-purple-900/10 relative flex flex-col justify-between hover:shadow-2xl transition duration-300 ring-2 ring-purple-500/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
              💎 Best Value • Full Suite
            </div>

            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">Chatbot + Odoo ERP</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Enterprise Suite</h3>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-purple-900">{isAnnual ? "$150" : "$15"}</span>
                <span className="text-slate-500 font-semibold text-xs">/ {isAnnual ? "year" : "month"}</span>
              </div>
              {isAnnual && (
                <div className="text-[11px] font-semibold text-emerald-600 mb-4">
                  Equivalent to just $12.50 / month (Save $30/yr!)
                </div>
              )}
              {!isAnnual && (
                <div className="text-[11px] text-slate-400 mb-4">Billed monthly. Save 2 months with annual.</div>
              )}

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Both powerful engines unified: 24/7 Website AI Chatbot + Live Odoo ERP Analytics &amp; WhatsApp Reports.
              </p>

              <div className="space-y-3 pt-4 border-t border-purple-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0 font-bold" />
                  <span className="font-bold text-slate-900">EVERYTHING in AI Chatbot</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0 font-bold" />
                  <span className="font-bold text-slate-900">EVERYTHING in Odoo Analytics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="font-semibold text-purple-800">Bi-directional CRM Lead Sync</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Automated WhatsApp CRM Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Priority 24/7 SLA Support</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>Official Odoo Partner Implementation Help</span>
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
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">Can I start with only the Chatbot?</h4>
              <p>Yes! Our pricing is completely modular. You can start with only the AI Chatbot at $10/month, and upgrade to include Odoo ERP Analytics anytime with zero setup fees.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">How does the Odoo Analytics connect safely?</h4>
              <p>MAZ uses read-only ORM connections and never executes destructive SQL. All queries are strictly sanitized, and customer data never leaves your isolated environment.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">How do I embed the chatbot on my site?</h4>
              <p>Copy one simple line of code into your WordPress, Shopify, Next.js, or HTML site. It works immediately and is fully optimized for iOS Safari and mobile phones.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-1.5 text-sm">What payment methods are supported?</h4>
              <p>We support all major international credit/debit cards, Stripe, and corporate invoicing for annual subscriptions.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Have specific enterprise requirements?</h3>
          <p className="text-xs text-slate-500 mb-4">Our official Odoo Partner team can build custom OWL apps, integrations, and private LLM models.</p>
          <a
            href="mailto:contact@maifelz.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
          >
            Speak with an Enterprise Consultant
          </a>
        </div>

      </div>
    </div>
  );
}
