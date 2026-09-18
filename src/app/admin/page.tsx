"use client";

import React, { useState } from "react";
import { 
  Users, Bot, Flame, MessageSquare, Plus, CheckCircle2, 
  XCircle, Copy, Key, ArrowUpRight, Search, ShieldCheck 
} from "lucide-react";

interface TenantData {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  api_key: string;
  plan_tier: string;
  max_bots: number;
  bot_count: number;
  max_messages_per_month: number;
  messages_used_this_month: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminControlPanel() {
  const [tenants, setTenants] = useState<TenantData[]>([
    {
      id: "tenant_maifelz",
      company_name: "Maifel Technologies LLP",
      contact_name: "Fahad Rayamarakkar",
      email: "contact@maifelz.com",
      api_key: "maz_live_maifelz_prod_2026",
      plan_tier: "enterprise",
      max_bots: 10,
      bot_count: 1,
      max_messages_per_month: 50000,
      messages_used_this_month: 0,
      is_active: true,
      created_at: "2026-09-18"
    }
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("pro");
  const [newQuota, setNewQuota] = useState(5000);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newEmail) return;

    const newTenant: TenantData = {
      id: "t_" + Math.random().toString(36).substring(2, 6),
      company_name: newCompany,
      contact_name: newContact || "Administrator",
      email: newEmail,
      api_key: "maz_live_" + Math.random().toString(36).substring(2, 14),
      plan_tier: newPlan,
      max_bots: newPlan === "enterprise" ? 10 : newPlan === "pro" ? 3 : 1,
      bot_count: 1,
      max_messages_per_month: Number(newQuota),
      messages_used_this_month: 0,
      is_active: true,
      created_at: new Date().toISOString().split("T")[0]
    };

    setTenants([newTenant, ...tenants]);
    setShowModal(false);
    setNewCompany("");
    setNewContact("");
    setNewEmail("");
  };

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t));
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filtered = tenants.filter(t => 
    t.company_name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maifel Super-Admin Control Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Master Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Provision customer seats, configure monthly quotas, manage API credentials, and monitor platform activity.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Provision Customer Seat
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Customer Seats</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{tenants.filter(t => t.is_active).length} / {tenants.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">100% capacity available</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live AI Chatbots</span>
            <Bot className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{tenants.reduce((acc, t) => acc + t.bot_count, 0)} Active</div>
          <span className="text-[11px] text-slate-400 font-medium">Across all client websites</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Captured Leads</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">148 Leads</div>
          <span className="text-[11px] text-rose-600 font-medium">🔥 42 Hot Deals ready for Odoo</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Message Volume</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{tenants.reduce((acc, t) => acc + t.messages_used_this_month, 0)} msgs</div>
          <span className="text-[11px] text-slate-400 font-medium">Platform running smooth</span>
        </div>
      </div>

      {/* Customer Seats Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Provisioned Client Accounts</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Company & Client</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Chatbots</th>
                <th className="py-3 px-4">Monthly Usage</th>
                <th className="py-3 px-4">API Key</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const percent = Math.round((t.messages_used_this_month / t.max_messages_per_month) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.company_name}</div>
                      <div className="text-[11px] text-slate-400">{t.contact_name} • {t.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.plan_tier === "enterprise" ? "bg-purple-100 text-purple-700" :
                        t.plan_tier === "pro" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {t.plan_tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {t.bot_count} / {t.max_bots}
                    </td>
                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="flex justify-between text-[10px] mb-1 font-medium">
                        <span>{t.messages_used_this_month}</span>
                        <span className="text-slate-400">{t.max_messages_per_month}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percent > 85 ? 'bg-rose-500' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <button
                        onClick={() => copyApiKey(t.api_key)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                        title="Click to copy API Key"
                      >
                        <Key className="w-3 h-3 text-slate-500" />
                        <span>{t.api_key.substring(0, 14)}...</span>
                        {copiedKey === t.api_key ? (
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {t.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleStatus(t.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                          t.is_active 
                            ? "border-slate-300 hover:bg-slate-100 text-slate-600" 
                            : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {t.is_active ? "Suspend" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Customer Seat Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Provision New Customer Seat</h3>
            <p className="text-xs text-slate-500 mb-5">
              Allocate an enterprise MAZ account for your client with custom limits.
            </p>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@acme.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Tier</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white"
                  >
                    <option value="starter">Starter ($49/mo)</option>
                    <option value="pro">Pro ($99/mo)</option>
                    <option value="enterprise">Enterprise ($249/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Message Limit</label>
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Create Customer Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
