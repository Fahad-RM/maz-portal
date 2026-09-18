"use client";

import React, { useState } from "react";
import { 
  Bot, Palette, BookOpen, Flame, Code, UploadCloud, 
  Globe, Plus, Check, Copy, Sparkles, Send, ShieldAlert 
} from "lucide-react";

export default function CustomerBotStudio() {
  const [activeTab, setActiveTab] = useState<"appearance" | "knowledge" | "leads" | "embed">("appearance");

  // Bot Config State
  const [botTitle, setBotTitle] = useState("Billabong Solar Assistant");
  const [botSubtitle, setBotSubtitle] = useState("Answers trained on business knowledge 24/7");
  const [brandColor, setBrandColor] = useState("#2563eb");
  const [welcomeMsg, setWelcomeMsg] = useState("👋 Hello! Looking for clean solar energy for your home or business?");
  const [chips, setChips] = useState(["Residential Rebates", "Commercial Quote", "Battery Storage", "Book a Free Site Audit"]);
  const [newChip, setNewChip] = useState("");
  const [escalationMsg, setEscalationMsg] = useState("I would love to connect you with our certified solar engineer. Leave your email or phone below!");

  // Knowledge State
  const [crawlUrl, setCrawlUrl] = useState("");
  const [documents, setDocuments] = useState([
    { id: "doc_1", title: "Solar_Rebates_Guide_2026.pdf", type: "file", status: "indexed", chunks: 24, date: "2026-09-16" },
    { id: "doc_2", title: "Commercial_PPA_Pricing.docx", type: "file", status: "indexed", chunks: 18, date: "2026-09-17" },
    { id: "doc_3", title: "https://billabongsolar.com.au/services", type: "url", status: "indexed", chunks: 42, date: "2026-09-18" }
  ]);

  // Leads State
  const [leads, setLeads] = useState([
    {
      id: "ld_1",
      name: "Marcus Vance",
      email: "marcus@vancemanufacturing.com",
      phone: "+61 412 889 201",
      score: "HOT",
      score_reason: "Requested commercial warehouse quote (100kW system) and provided direct phone.",
      summary: "Customer needs 100kW rooftop installation before end of Q4 for federal tax rebate.",
      date: "10 mins ago",
      synced_odoo: true
    },
    {
      id: "ld_2",
      name: "Elena Rostova",
      email: "elena.r@gmail.com",
      phone: "",
      score: "WARM",
      score_reason: "Comparing residential battery storage vs grid export rates.",
      summary: "Inquired about Tesla Powerwall 3 warranty and payback period.",
      date: "1 hour ago",
      synced_odoo: true
    },
    {
      id: "ld_3",
      name: "Anonymous Visitor",
      email: "",
      phone: "",
      score: "COLD",
      score_reason: "General inquiry on whether solar panels work in rainy weather.",
      summary: "Brief informational query.",
      date: "Yesterday",
      synced_odoo: false
    }
  ]);

  // Selected Lead Modal
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Odoo Settings
  const [odooWebhookUrl, setOdooWebhookUrl] = useState("https://myodoo.com/maz/webhook/lead");
  const [odooApiKey, setOdooApiKey] = useState("maz_live_41c0e3a98db214");
  const [odooSaved, setOdooSaved] = useState(false);

  const addChip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChip.trim()) return;
    setChips([...chips, newChip.trim()]);
    setNewChip("");
  };

  const removeChip = (idx: number) => {
    setChips(chips.filter((_, i) => i !== idx));
  };

  const handleSimulateCrawl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrl) return;
    setDocuments([
      {
        id: "doc_" + Math.random().toString(36).substring(2, 6),
        title: crawlUrl,
        type: "url",
        status: "indexed",
        chunks: Math.floor(Math.random() * 30) + 10,
        date: "Just now"
      },
      ...documents
    ]);
    setCrawlUrl("");
  };

  const copyEmbedCode = () => {
    const code = `<script src="https://maz-widget.maifel.com/maz.js" data-bot-id="maz_41c0e3a98db2" async></script>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Bot Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Bot ID: maz_41c0e3a98db2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize widget appearance, ingest company documents & web pages, review qualified leads, and sync to Odoo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "appearance" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Appearance
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "knowledge" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Knowledge Base ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "leads" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" /> Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("embed")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "embed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Embed & Odoo
          </button>
        </div>
      </div>

      {/* TAB 1: APPEARANCE & LIVE PREVIEW */}
      {activeTab === "appearance" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" /> Branding & Theme Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Title</label>
                  <input
                    type="text"
                    value={botTitle}
                    onChange={(e) => setBotTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Status Note</label>
                <input
                  type="text"
                  value={botSubtitle}
                  onChange={(e) => setBotSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Welcome Greeting</label>
                <textarea
                  rows={2}
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Suggested Quick Question Chips</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {chips.map((chip, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium text-[11px] flex items-center gap-1.5"
                    >
                      {chip}
                      <button onClick={() => removeChip(i)} className="text-blue-400 hover:text-blue-700">×</button>
                    </span>
                  ))}
                </div>
                <form onSubmit={addChip} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add prompt chip..."
                    value={newChip}
                    onChange={(e) => setNewChip(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold">
                    Add
                  </button>
                </form>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Escalation & Lead Trigger Message</label>
                <textarea
                  rows={2}
                  value={escalationMsg}
                  onChange={(e) => setEscalationMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Live Interactive Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Real-Time Widget Live Preview
            </span>

            <div className="w-[340px] h-[520px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-3 text-white flex items-center justify-between" style={{ background: brandColor }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-xs">{botTitle}</div>
                    <div className="text-[10px] opacity-85 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      {botSubtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-3 bg-slate-50 space-y-2.5 overflow-y-auto text-xs">
                <div className="p-3 bg-white rounded-2xl rounded-bl-sm border border-slate-200 text-slate-800 shadow-sm max-w-[85%]">
                  {welcomeMsg}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {chips.map((c, i) => (
                    <button
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium border"
                      style={{ background: "#eef2ff", color: "#3730a3", borderColor: "#c7d2fe" }}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Simulated Lead Card */}
                <div className="p-2.5 bg-white border border-blue-200 rounded-xl mt-3 space-y-1.5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    📬 Request Official Follow-Up
                  </div>
                  <input
                    type="text"
                    disabled
                    placeholder="Your Name & Phone / Email"
                    className="w-full text-[10px] p-1.5 bg-slate-50 border border-slate-200 rounded"
                  />
                  <button
                    disabled
                    className="w-full py-1 text-white text-[10px] font-bold rounded"
                    style={{ background: brandColor }}
                  >
                    Submit Enquiry
                  </button>
                </div>
              </div>

              {/* Input Row */}
              <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  placeholder="Ask a question..."
                  className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-full bg-slate-50"
                />
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                  style={{ background: brandColor }}
                >
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="py-1 text-center text-[9px] text-slate-400 bg-white border-t border-slate-50">
                Powered by <strong>MAZ by Maifelz</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE BASE HUB */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Ingestion Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" /> Upload Documents (PDF, DOCX, TXT)
              </h3>
              <p className="text-slate-500 mb-4">
                MAZ parses text, extracts tables, and chunks your documentation with semantic embeddings.
              </p>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-700">Click or drag PDF files here</div>
                <div className="text-[10px] text-slate-400 mt-1">Up to 25MB per file • Instant indexing</div>
              </div>
            </div>

            {/* URL Crawler Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" /> Crawl Website URL
              </h3>
              <p className="text-slate-500 mb-4">
                Enter your website URL or documentation page. MAZ will automatically scrape and index its contents.
              </p>
              <form onSubmit={handleSimulateCrawl} className="space-y-3">
                <input
                  type="url"
                  required
                  placeholder="https://yourcompany.com/pricing"
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Start Website Crawl & Index
                </button>
              </form>
            </div>
          </div>

          {/* Indexed Documents Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
              Trained Knowledge Base Documents ({documents.length})
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Title / Source</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Indexed Chunks</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-800">{d.title}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500">{d.type}</td>
                    <td className="py-3 px-4 font-mono">{d.chunks} chunks</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CAPTURED LEADS & CRM PIPELINE */}
      {activeTab === "leads" && (
        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Qualified Lead Inquiries</h3>
              <p className="text-slate-500 text-xs">
                MAZ analyzes intent and dynamically scores leads (Hot, Warm, Cold) before dispatching to Odoo CRM.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold">1 Hot Lead 🔥</span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">1 Warm Lead 🌤️</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.map((ld) => (
              <div
                key={ld.id}
                onClick={() => setSelectedLead(ld)}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ld.score === "HOT" ? "bg-rose-100 text-rose-700" :
                      ld.score === "WARM" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {ld.score === "HOT" ? "🔥 HOT DEAL" : ld.score === "WARM" ? "🌤️ WARM" : "❄️ COLD"}
                    </span>
                    <span className="text-[10px] text-slate-400">{ld.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">{ld.name}</h4>
                  <div className="text-slate-500 text-[11px] mb-2">
                    {ld.email || "No email"} {ld.phone ? `• ${ld.phone}` : ""}
                  </div>

                  <p className="text-slate-700 text-xs line-clamp-2 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {ld.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Click to view transcript</span>
                  {ld.synced_odoo && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Synced to Odoo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Lead Details Modal */}
          {selectedLead && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedLead.name}</h3>
                    <span className="text-slate-500">{selectedLead.email} • {selectedLead.phone}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedLead.score === "HOT" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {selectedLead.score} QUALIFICATION
                  </span>
                </div>

                <div className="my-4 space-y-3">
                  <div>
                    <span className="font-bold text-slate-700">AI Scoring Rationale:</span>
                    <p className="p-2.5 bg-slate-50 rounded-lg text-slate-600 mt-1 border border-slate-100">
                      {selectedLead.score_reason}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Executive Summary:</span>
                    <p className="p-2.5 bg-blue-50/60 rounded-lg text-blue-900 mt-1 border border-blue-100">
                      {selectedLead.summary}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: EMBED & ODOO CONNECT */}
      {activeTab === "embed" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Embed Script Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" /> 1-Tag Universal Website Embed
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Paste this asynchronous code snippet right before the closing <code>&lt;/body&gt;</code> tag on any website (WordPress, Shopify, Squarespace, Webflow, Odoo, or custom HTML).
            </p>

            <div className="relative bg-slate-900 text-blue-200 font-mono p-4 rounded-xl text-[11px] overflow-x-auto">
              <code>
                {`<script \n  src="https://maz-widget.maifel.com/maz.js" \n  data-bot-id="maz_41c0e3a98db2" \n  async>\n</script>`}
              </code>
              <button
                onClick={copyEmbedCode}
                className="absolute right-3 top-3 px-2.5 py-1 rounded bg-blue-600 text-white font-sans text-xs flex items-center gap-1 hover:bg-blue-700 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-200 font-medium">
              ⚡ <strong>Zero Page Slowdown:</strong> Loads asynchronously after initial page load without hurting Core Web Vitals.
            </div>
          </div>

          {/* Odoo CRM Integration Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-600" /> Dedicated Odoo CRM Connector
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Install the <code>maz_odoo_connector</code> module in your Odoo instance to automatically capture leads and log AI conversation summaries into your CRM pipeline.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odoo Webhook URL</label>
                <input
                  type="url"
                  value={odooWebhookUrl}
                  onChange={(e) => setOdooWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">MAZ API Key</label>
                <input
                  type="text"
                  value={odooApiKey}
                  onChange={(e) => setOdooApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-xs"
                />
              </div>

              <button
                onClick={() => {
                  setOdooSaved(true);
                  setTimeout(() => setOdooSaved(false), 2500);
                }}
                className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                {odooSaved ? "✅ Odoo Connection Verified" : "Save & Verify Odoo Sync"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
