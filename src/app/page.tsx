import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, ArrowRight, Zap, Users, Sparkles, Database } from "lucide-react";

export default function HomePage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Next-Generation AI Business Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Beyond Simple Chatbots: <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Meet MAZ Autonomous Business Agents
          </span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Ground AI in your documents, websites, and business knowledge. Qualify leads dynamically with BANT scoring, book demos, and sync directly with Odoo CRM.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/admin"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-md flex items-center gap-2"
          >
            Maifelz Master Seat Manager <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-md flex items-center gap-2"
          >
            Customer Bot Studio <Zap className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Customer Seat Provisioning</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Give your clients their own dedicated dashboard, assign monthly message quotas, and manage subscription tiers seamlessly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Hybrid Multi-Source RAG</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ingest PDFs, Word documents, live website crawls, and FAQ notes. Strict guardrails prevent hallucinations and ground every reply.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Native Odoo CRM Sync</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every conversation is analyzed for Hot/Warm/Cold lead scoring and pushed directly into Odoo CRM with full chat transcripts.
          </p>
        </div>
      </div>
    </div>
  );
}
