"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Check, Sparkles, ArrowRight, Bot, 
  HelpCircle, MessageSquare, Database, ShieldCheck, Flame, BarChart3,
  MessageCircle, Globe, X, Mail, Phone, Building2, MapPin, Send, CheckCircle2,
  Calendar, Lock
} from "lucide-react";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  notes: string;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Ultimate Omnichannel Suite");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    notes: ""
  });

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openModal = (planName: string) => {
    setSelectedPlan(planName);
    setSubmitSuccess(false);
    setCreatedLeadId(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage("Please enter either your email or WhatsApp number so we can reach you.");
      return;
    }

    setIsSubmitting(true);

    try {
      const planBillingTag = `${selectedPlan} (${isAnnual ? "Yearly - Save ~33%" : "Monthly"})`;
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          location: formData.location,
          service_interested: planBillingTag,
          billing_cycle: isAnnual ? "Yearly" : "Monthly",
          notes: formData.notes
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(true);
        if (data.odoo_lead_id) {
          setCreatedLeadId(data.odoo_lead_id);
        }
      } else {
        setErrorMessage(data.error || "Failed to submit consultation request. Please try again or WhatsApp us directly.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage("Network error connecting to CRM. Please email us at info@maifelz.com or chat on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanPriceDisplay = (plan: string) => {
    if (plan.includes("Chatbot")) {
      return isAnnual ? "$120 / year ($10/mo)" : "$15 / month";
    }
    if (plan.includes("ERP") || plan.includes("Analytics")) {
      return isAnnual ? "$120 / year ($10/mo)" : "$15 / month";
    }
    if (plan.includes("Suite") || plan.includes("Ultimate")) {
      return isAnnual ? "$200 / year ($16.60/mo)" : "$25 / month";
    }
    return "Custom Enterprise Quote";
  };

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
              <button
                type="button"
                onClick={() => openModal("Omnichannel AI Chatbot (Web + WhatsApp)")}
                className="w-full py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
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
              <button
                type="button"
                onClick={() => openModal("Conversational ERP Analytics (Odoo AI Copilot)")}
                className="w-full py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
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
              <button
                type="button"
                onClick={() => openModal("Ultimate Omnichannel Suite (Web + WhatsApp + Odoo ERP)")}
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 hover:scale-[1.01]"
              >
                Get Full Suite <ArrowRight className="w-4 h-4" />
              </button>
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
          <button
            type="button"
            onClick={() => openModal("Custom Enterprise AI & ERP Implementation")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition shadow-sm"
          >
            Speak with an Enterprise Consultant
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE CONTACT CARD / GET STARTED CONSULTATION MODAL */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-900 via-slate-900 to-purple-950 text-white relative flex-shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Maifelz Technologies LLP • Consultation Card
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {submitSuccess ? "Inquiry Confirmed!" : "Get Started with MAZ AI"}
              </h2>
              <p className="text-xs text-purple-200/80 mt-1">
                {submitSuccess 
                  ? "Your request has been routed directly into our Odoo CRM pipeline."
                  : "We'll configure your free sandbox, AI knowledge base & omnichannel connectors."
                }
              </p>

              {/* Selected Plan Tag */}
              {!submitSuccess && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{selectedPlan}</span>
                  <span className="text-purple-200 text-[11px]">({getPlanPriceDisplay(selectedPlan)})</span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {submitSuccess ? (
                /* Success View */
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 animate-bounce">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thank you, {formData.name || "Valued Visitor"}! 🎉
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                      Your consultation inquiry has been registered in our official Odoo CRM
                      {createdLeadId ? ` (Opportunity #${createdLeadId})` : ""}. An enterprise engineer from{" "}
                      <strong>Maifelz Technologies LLP</strong> will contact you via WhatsApp or Email shortly.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-left text-xs space-y-2 max-w-sm mx-auto">
                    <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      Inquiry Details Logged:
                    </div>
                    <div className="text-slate-700">
                      <strong>Plan:</strong> {selectedPlan} ({isAnnual ? "Yearly" : "Monthly"})
                    </div>
                    {formData.email && (
                      <div className="text-slate-700">
                        <strong>Email:</strong> {formData.email}
                      </div>
                    )}
                    {formData.phone && (
                      <div className="text-slate-700">
                        <strong>WhatsApp / Phone:</strong> {formData.phone}
                      </div>
                    )}
                    {formData.company && (
                      <div className="text-slate-700">
                        <strong>Company:</strong> {formData.company}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/919447054133?text=${encodeURIComponent(
                        `Hi Maifelz team! I just submitted an inquiry for ${selectedPlan}. My name is ${formData.name || ""}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp Now
                    </a>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* Contact Form View */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp / Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+91 94470 54133"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Name <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          name="company"
                          placeholder="e.g. Acme Solar Corp"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City / Country <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          name="location"
                          placeholder="e.g. Dubai, UAE / Kochi, India"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plan Selector Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Service / Plan of Interest
                    </label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                    >
                      <option value="Ultimate Omnichannel Suite (Web + WhatsApp + Odoo ERP)">
                        Ultimate Omnichannel Suite ($200/yr or $25/mo)
                      </option>
                      <option value="Omnichannel AI Chatbot (Web + WhatsApp)">
                        Omnichannel AI Chatbot ($120/yr or $15/mo)
                      </option>
                      <option value="Conversational ERP Analytics (Odoo AI Copilot)">
                        Conversational ERP Analytics ($120/yr or $15/mo)
                      </option>
                      <option value="Custom Enterprise AI & ERP Implementation">
                        Custom Enterprise AI &amp; ERP Implementation
                      </option>
                    </select>
                  </div>

                  {/* Notes / Special Requirements */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Requirements / Existing Systems <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Currently on Odoo 17, need WhatsApp chatbot and real-time Xero sync..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white font-bold text-xs shadow-lg shadow-purple-900/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Routing to Odoo CRM...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Consultation &amp; Get Started</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Official Contact Card Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2 mt-4">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Maifelz Technologies LLP</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                    Authorized Odoo Partner
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span>Official Email:</span>
                    <a href="mailto:info@maifelz.com" className="font-bold text-purple-700 hover:underline">
                      info@maifelz.com
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct WhatsApp:</span>
                    <a 
                      href="https://wa.me/919447054133?text=Hi%20Maifelz%20team%2C%20I%20would%20like%20to%20learn%20more%20about%20MAZ%20AI" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      +91 94470 54133
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
