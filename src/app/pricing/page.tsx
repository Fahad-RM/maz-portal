"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, Zap, Sparkles, ShieldCheck, ArrowRight, Bot, 
  HelpCircle, MessageSquare, Database, Cpu, Flame, Building2
} from "lucide-react";

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const tiers = [
    {
      name: "Starter",
      description: "Ideal for boutique businesses seeking 24/7 customer FAQ automation.",
      monthlyPrice: 49,
      annualPrice: 39,
      quota: "1,000 messages / mo",
      bots: "1 AI Assistant Bot",
      popular: false,
      features: [
        "1,000 Monthly Messages",
        "1 Live AI Assistant Widget",
        "Web Page Knowledge Crawler",
        "Basic Contact Lead Capture",
        "Brand Color & Text Customization",
        "Standard SLA Email Support"
      ],
      buttonText: "Start with Starter",
      href: "/?plan=starter"
    },
    {
      name: "Growth",
      description: "For growing teams needing full multi-format document RAG & lead alerts.",
      monthlyPrice: 99,
      annualPrice: 79,
      quota: "3,000 messages / mo",
      bots: "2 AI Assistant Bots",
      popular: false,
      features: [
        "3,000 Monthly Messages",
        "2 Live AI Assistant Bots",
        "PDF, DOCX & Web Ingestion",
        "AI Lead Scoring (Hot / Warm / Cold)",
        "Instant Email Lead Notifications",
        "Embed Widget on Unlimited Domains",
        "Priority Support (12h response)"
      ],
      buttonText: "Choose Growth",
      href: "/?plan=growth"
    },
    {
      name: "Pro",
      description: "Our flagship plan with native Odoo ERP CRM synchronization and sub-second Gemini streaming.",
      monthlyPrice: 199,
      annualPrice: 159,
      quota: "5,000 messages / mo",
      bots: "3 AI Assistant Bots",
      popular: true,
      badge: "Most Popular",
      features: [
        "5,000 Monthly Messages",
        "3 Live AI Assistant Bots",
        "Google Gemini 3.5 Flash-Lite Engine",
        "Sub-Second Real-Time SSE Streaming",
        "Native Odoo CRM Lead & Transcript Sync",
        "Automated BANT Lead Classification",
        "Dedicated RAG Document Knowledge Base",
        "Dedicated Account Specialist (4h SLA)"
      ],
      buttonText: "Get Started with Pro",
      href: "/?plan=pro"
    },
    {
      name: "Enterprise",
      description: "Complete corporate automation with bi-directional Xero accounting & custom integrations.",
      monthlyPrice: 399,
      annualPrice: 319,
      quota: "20,000+ messages / mo",
      bots: "Up to 10 AI Assistant Bots",
      popular: false,
      badge: "Full Suite",
      features: [
        "20,000+ Monthly Messages (Custom Limits)",
        "Up to 10 Live AI Assistant Bots",
        "Bi-Directional Xero API v2 Webhook Sync",
        "Odoo ERP Custom Module & OWL Widgets",
        "Row-Level Multi-Tenant Database Isolation",
        "Custom Voice / Multi-Lingual Prompting",
        "White-Label Embedded Widget (<35KB)",
        "24/7 SLA Dedicated Technical Consultant"
      ],
      buttonText: "Contact Enterprise Sales",
      href: "mailto:contact@maifelz.com?subject=Enterprise%20Plan%20Inquiry%20-%20MAZ%20Platform"
    }
  ];

  const faqs = [
    {
      q: "How does the monthly message quota work?",
      a: "Each time your website visitor asks a question and receives a response from your AI assistant, 1 message credit is deducted from your balance. Your quota automatically refreshes every month."
    },
    {
      q: "What happens if we reach our monthly quota before the cycle ends?",
      a: "You can recharge your message quota at any time directly through your Maifelz account manager or through the Super-Admin portal. Your bot will notify visitors gracefully without crashing."
    },
    {
      q: "How does the Odoo ERP integration function?",
      a: "Our dedicated connector module (`maz_odoo_connector`) receives webhook dispatches whenever a visitor qualifies as a lead. It creates a CRM Lead/Opportunity and posts the full conversation transcript right into the chatter."
    },
    {
      q: "How does the Xero accounting integration work?",
      a: "Available on the Enterprise plan, we connect via the official Xero API v2 with webhooks to synchronize invoices, payment settlements, and customer tax mappings automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Transparent, Scalable Enterprise Pricing
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            Predictable Plans for <br />
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-900 bg-clip-text text-transparent">
              High-Conversion Business AI.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Deploy autonomous business agents grounded in your official company knowledge. 
            Includes real-time streaming, lead scoring, and native Odoo ERP &amp; Xero connectivity.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold shadow-sm">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 rounded-xl transition ${
                !annualBilling ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 text-white shadow-md shadow-purple-900/20" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                annualBilling ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 text-white shadow-md shadow-purple-900/20" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {tiers.map((t, idx) => {
            const price = annualBilling ? t.annualPrice : t.monthlyPrice;
            return (
              <div
                key={idx}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  t.popular
                    ? "bg-white border-2 border-purple-600 shadow-2xl shadow-purple-950/10 scale-105 z-20"
                    : "bg-white border border-slate-200/90 hover:border-purple-300 shadow-md hover:shadow-xl"
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white shadow-md">
                    {t.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{t.name}</h3>
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  
                  <p className="text-xs text-slate-500 min-h-[36px] mb-5 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black text-slate-900">${price}</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  {annualBilling && (
                    <span className="text-[11px] text-emerald-700 font-semibold block mb-4">
                      Billed annually (${price * 12}/yr)
                    </span>
                  )}
                  {!annualBilling && <div className="h-4 mb-4" />}

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl mb-6 space-y-1 text-xs">
                    <div className="text-slate-700 font-semibold flex items-center justify-between">
                      <span>Message Quota:</span>
                      <span className="text-purple-700 font-bold">{t.quota}</span>
                    </div>
                    <div className="text-slate-500 flex items-center justify-between text-[11px]">
                      <span>Allowed Bots:</span>
                      <span className="text-slate-800 font-medium">{t.bots}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-8 text-xs text-slate-600">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                      What's Included:
                    </div>
                    {t.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={t.href}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    t.popular
                      ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white shadow-md shadow-purple-900/25"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                  }`}
                >
                  {t.buttonText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Enterprise Architecture Feature Grid */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Why Enterprise Teams Choose MAZ</h2>
            <p className="text-xs text-slate-500">
              Unlike generic chatbot widgets, MAZ is built for deep enterprise workflow automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Grounding in Real Knowledge</h3>
              <p className="text-slate-600 leading-relaxed">
                Strict temperature 0.2 fact-checking ensures your AI assistant only quotes your actual products, pricing, and services without hallucinations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Odoo ERP &amp; Xero Webhooks</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect customer leads, inquiries, and transcripts directly to your CRM pipeline and financial accounting records with zero manual data entry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Row-Level Multi-Tenant Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Every client account is cryptographically isolated via `tenant_id`. Your business data is never shared or trained across other customer portals.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{f.q}</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-fuchsia-50 to-slate-50 border border-purple-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Need a custom enterprise volume or on-premise deployment?</h3>
            <p className="text-xs text-slate-500 mb-4">Our engineering team at Maifelz Technologies will build a dedicated deployment plan for you.</p>
            <a
              href="mailto:contact@maifelz.com?subject=Custom%20Enterprise%20Plan%20Inquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white font-bold text-xs transition shadow-md shadow-purple-900/25"
            >
              Speak to an AI Architect <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
