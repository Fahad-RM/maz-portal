"use client";

import React from "react";
import Link from "next/link";
import { 
  Check, Sparkles, ArrowRight, Bot, 
  HelpCircle, MessageSquare, Database, ShieldCheck, Flame
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 text-slate-900 py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Simple, Transparent Pricing
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            High-Performance AI for <br />
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-900 bg-clip-text text-transparent">
              Your Business Website.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Deploy an autonomous AI agent trained on your company knowledge. 
            Enjoy unlimited conversations with zero message limits and native Odoo ERP CRM integration.
          </p>
        </div>

        {/* 2-Card Simple Pricing Grid (3Beeez Inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          
          {/* MONTHLY CARD */}
          <div className="bg-white rounded-3xl p-8 border-2 border-purple-600 shadow-xl shadow-purple-900/5 relative flex flex-col justify-between hover:shadow-2xl transition duration-300">
            <div className="absolute -top-3.5 left-8 bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">Monthly Plan</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-black text-slate-900">$35</span>
                <span className="text-slate-500 font-semibold text-sm">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Full platform access with unlimited messages and real-time knowledge grounding.
              </p>

              <div className="space-y-3.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-900">Unlimited conversations &amp; messages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>1 AI Chatbot for your website</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Upload PDFs, Word docs, webpages &amp; text notes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-900">Admin portal with full conversation history</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>One-tag embed — works on any website or CMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-purple-700">Native Odoo ERP CRM sync included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Real-time BANT lead capture &amp; scoring</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/?plan=monthly"
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
              >
                Get Started with Monthly <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ANNUAL CARD */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-8 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              Save $70 (2 Months Free)
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Annual Plan</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-black text-slate-900">$350</span>
                <span className="text-slate-500 font-semibold text-sm">/ year</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Same complete access with a yearly discount — save $70 versus paying month-to-month.
              </p>

              <div className="space-y-3.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-900">Unlimited conversations &amp; messages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>1 AI Chatbot for your website</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Upload PDFs, Word docs, webpages &amp; text notes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-900">Admin portal with full conversation history</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>One-tag embed — works on any website or CMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-purple-700">Native Odoo ERP CRM sync included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Real-time BANT lead capture &amp; scoring</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/?plan=annual"
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 shadow-md"
              >
                Choose Annual Plan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">Everything Included in Your Subscription</h2>
            <p className="text-xs text-slate-500 mt-1">Enterprise-grade autonomous AI infrastructure built for real business conversion.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">RAG Knowledge Engine</h3>
              <p className="text-slate-500 leading-relaxed">
                Indexes your PDFs, brochures, URLs, and custom text notes with sub-second hybrid retrieval.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Odoo CRM Sync</h3>
              <p className="text-slate-500 leading-relaxed">
                Qualified visitor leads and conversation transcripts are automatically pushed to your Odoo pipeline.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Full Conversation Logs</h3>
              <p className="text-slate-500 leading-relaxed">
                Inspect every question your customers asked to continuously refine and train your AI knowledge base.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                Are there really no message limits?
              </h4>
              <p className="text-slate-600 leading-relaxed pl-6">
                Yes! Both our monthly and annual plans include unlimited conversations. Your website visitors can ask questions 24/7 without worrying about overage charges or sudden chatbot shutoffs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                How do I train the AI on my company details?
              </h4>
              <p className="text-slate-600 leading-relaxed pl-6">
                You can upload PDFs, Word documents, crawl your website URLs, or directly paste text notes and FAQ answers in your Customer Studio. The AI learns new info immediately.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                How does the Odoo ERP integration work?
              </h4>
              <p className="text-slate-600 leading-relaxed pl-6">
                Our connector module receives webhook events whenever a customer submits their contact info or qualifies as a lead, creating a CRM Opportunity in Odoo with the full chat transcript.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
