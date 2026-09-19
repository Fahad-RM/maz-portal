"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Bot, Flame, MessageSquare, Plus, CheckCircle2, 
  XCircle, Copy, Key, ArrowUpRight, Search, ShieldCheck, 
  Pencil, RefreshCw, Eye, EyeOff, Check, Send, AlertTriangle, Lock
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
  default_bot_id?: string;
  max_messages_per_month: number;
  messages_used_this_month: number;
  is_active: boolean;
  created_at: string;
}

interface WelcomePacket {
  company_name: string;
  username: string;
  password: string;
  plan_tier: string;
  max_messages_per_month: number;
  api_key: string;
  login_url: string;
}

const BACKEND_URL = "https://maz-backend-t1hy.onrender.com";

export default function AdminControlPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInputKey, setAuthInputKey] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [tenants, setTenants] = useState<TenantData[]>([]);
  const [metrics, setMetrics] = useState<{
    total_tenants: number;
    active_tenants: number;
    total_bots: number;
    total_leads: number;
    total_messages: number;
  }>({
    total_tenants: 0,
    active_tenants: 0,
    total_bots: 0,
    total_leads: 0,
    total_messages: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Provision Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPlan, setNewPlan] = useState("pro");
  const [newQuota, setNewQuota] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Welcome Packet Modal State
  const [welcomePacket, setWelcomePacket] = useState<WelcomePacket | null>(null);
  const [copiedWelcome, setCopiedWelcome] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantData | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [resetUsageCounter, setResetUsageCounter] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate random strong password
  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pwd = "Mz@";
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const openProvisionModal = () => {
    setNewCompany("");
    setNewContact("");
    setNewEmail("");
    setNewPassword(generateRandomPassword());
    setNewPlan("pro");
    setNewQuota(5000);
    setShowModal(true);
  };

  // Verify key against backend
  const verifyAndSetKey = async (keyCandidate: string) => {
    if (!keyCandidate.trim()) {
      setAuthError("Please enter your Super-Admin Master Password.");
      return;
    }
    setIsVerifying(true);
    setAuthError(null);
    try {
      const [tenantsRes, metricsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/admin/tenants`, {
          headers: { "X-SUPER-ADMIN-KEY": keyCandidate.trim() }
        }),
        fetch(`${BACKEND_URL}/api/v1/admin/metrics`, {
          headers: { "X-SUPER-ADMIN-KEY": keyCandidate.trim() }
        })
      ]);

      if (!tenantsRes.ok) {
        throw new Error("Invalid Super-Admin Master Password. Access denied.");
      }

      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData.tenants || []);

      if (metricsRes.ok) {
        const m = await metricsRes.json();
        setMetrics(m);
      }

      setAdminKey(keyCandidate.trim());
      setIsAuthenticated(true);
      localStorage.setItem("maz_admin_master_key", keyCandidate.trim());
    } catch (err: any) {
      setAuthError(err.message || "Authorization failed.");
      setIsAuthenticated(false);
      localStorage.removeItem("maz_admin_master_key");
    } finally {
      setIsVerifying(false);
      setIsLoading(false);
    }
  };

  // Check saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem("maz_admin_master_key");
    if (saved) {
      verifyAndSetKey(saved);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAndSetKey(authInputKey);
  };

  const handleLockControlPanel = () => {
    localStorage.removeItem("maz_admin_master_key");
    setAdminKey("");
    setIsAuthenticated(false);
    setAuthInputKey("");
  };

  // Fetch real tenants & metrics from backend
  const fetchData = async () => {
    if (!adminKey) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [tenantsRes, metricsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/admin/tenants`, {
          headers: { "X-SUPER-ADMIN-KEY": adminKey }
        }),
        fetch(`${BACKEND_URL}/api/v1/admin/metrics`, {
          headers: { "X-SUPER-ADMIN-KEY": adminKey }
        })
      ]);

      if (!tenantsRes.ok) {
        throw new Error(`Session expired or invalid key (HTTP ${tenantsRes.status})`);
      }

      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData.tenants || []);

      if (metricsRes.ok) {
        const m = await metricsRes.json();
        setMetrics(m);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SUPER-ADMIN-KEY": adminKey
        },
        body: JSON.stringify({
          company_name: newCompany,
          contact_name: newContact || undefined,
          email: newEmail,
          password: newPassword,
          plan_tier: newPlan,
          max_bots: newPlan === "enterprise" ? 10 : newPlan === "pro" ? 3 : 1,
          max_messages_per_month: Number(newQuota)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to create customer seat");
      }

      setShowModal(false);
      // Show Welcome Packet
      setWelcomePacket({
        company_name: data.company_name,
        username: data.username,
        password: data.temporary_password,
        plan_tier: data.plan_tier,
        max_messages_per_month: data.max_messages_per_month,
        api_key: data.api_key,
        login_url: data.login_url || "https://ai.maifelz.com/dashboard"
      });

      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (t: TenantData) => {
    setEditingTenant({ ...t });
    setEditPassword("");
    setResetUsageCounter(false);
    setShowEditModal(true);
  };

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    setIsUpdating(true);
    try {
      const payload: any = {
        company_name: editingTenant.company_name,
        contact_name: editingTenant.contact_name,
        email: editingTenant.email,
        plan_tier: editingTenant.plan_tier,
        max_bots: Number(editingTenant.max_bots),
        max_messages_per_month: Number(editingTenant.max_messages_per_month)
      };

      if (editPassword && editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      if (resetUsageCounter) {
        payload.messages_used_this_month = 0;
      }

      const res = await fetch(`${BACKEND_URL}/api/v1/admin/tenants/${editingTenant.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-SUPER-ADMIN-KEY": adminKey
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update customer seat");
      }

      setShowEditModal(false);
      setEditingTenant(null);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/tenants/${id}/toggle`, {
        method: "POST",
        headers: { "X-SUPER-ADMIN-KEY": adminKey }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyWelcomePacketText = () => {
    if (!welcomePacket) return;
    const text = `🚀 Welcome to your MAZ AI Platform by Maifelz Technologies!

Here are your credentials to access your Customer Portal:
🔗 Customer Portal: ${welcomePacket.login_url}
👤 Username: ${welcomePacket.username}
🔑 Password: ${welcomePacket.password}
📦 Plan: ${welcomePacket.plan_tier.toUpperCase()}
📊 Monthly Messages: ${welcomePacket.max_messages_per_month.toLocaleString()}

Log in to customize your AI assistant, manage company knowledge, view customer leads, and copy your website widget!`;

    navigator.clipboard.writeText(text);
    setCopiedWelcome(true);
    setTimeout(() => setCopiedWelcome(false), 2500);
  };

  const filtered = tenants.filter(t => 
    (t.company_name || "").toLowerCase().includes(search.toLowerCase()) || 
    (t.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // If not authenticated, require password entry
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="max-w-md w-full animate-fade-up">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 border border-purple-200/80 shadow-md shadow-purple-900/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Super-Admin Authorization</h2>
            <p className="text-xs text-slate-500 mt-1">
              Master credentials required to access the Maifelz Control Panel.
            </p>
          </div>

          {/* Ultra-Glossy 3D Glass Bubble Card */}
          <div className="bg-white/75 backdrop-blur-3xl rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-[0_20px_50px_rgba(115,22,91,0.12),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(115,22,91,0.05)] relative overflow-hidden transition-all duration-300">
            {/* Specular Bubble Top Highlight Arc */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[2px] pointer-events-none" />
            {/* Subtle Top Shimmer Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 animate-shimmer opacity-80" />

            {authError && (
              <div className="mb-4 p-3.5 bg-rose-50/90 backdrop-blur-sm border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-700" /> Master Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter Super-Admin Master Key"
                  value={authInputKey}
                  onChange={(e) => setAuthInputKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white rounded-xl font-bold transition shadow-md shadow-purple-900/20 hover:shadow-lg hover:shadow-purple-900/30 hover:-translate-y-px flex items-center justify-center gap-2 mt-2 group"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Unlock Control Panel <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maifelz Super-Admin Control Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Master Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Provision customer seats, configure monthly subscription quotas, generate credentials, and monitor platform activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-purple-600" : ""}`} />
          </button>

          <button
            onClick={openProvisionModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 text-white font-semibold text-xs hover:bg-purple-800 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Provision Customer Seat
          </button>

          <button
            onClick={handleLockControlPanel}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition text-xs font-semibold"
            title="Lock Control Panel & Sign Out"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Panel
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-700">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={fetchData} className="font-bold underline ml-4">Retry</button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Active Customer Seats</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {metrics.active_tenants} / {metrics.total_tenants}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Isolated multi-tenant database</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Live AI Chatbots</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.total_bots} Active</div>
          <span className="text-[11px] text-slate-500 font-medium">Auto-trained with RAG embeddings</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Captured Leads</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.total_leads} Leads</div>
          <span className="text-[11px] text-purple-700 font-semibold">Live traffic synced</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Monthly Message Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {tenants.reduce((acc, t) => acc + (t.messages_used_this_month || 0), 0).toLocaleString()} msgs
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Across all client seats</span>
        </div>
      </div>

      {/* Customer Seats Table Card */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Provisioned Client Accounts</h2>
            <p className="text-[11px] text-slate-500">Manage customer credentials, plan quotas, and view bot telemetry.</p>
          </div>
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
                const maxQuota = t.max_messages_per_month || 5000;
                const used = t.messages_used_this_month || 0;
                const percent = Math.round((used / maxQuota) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.company_name}</div>
                      <div className="text-[11px] text-slate-400">{t.contact_name || "Admin"} • {t.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.plan_tier === "enterprise" ? "bg-purple-100 text-purple-700" :
                        t.plan_tier === "pro" ? "bg-blue-100 text-blue-700" :
                        t.plan_tier === "growth" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {t.plan_tier || "starter"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {t.bot_count || 1} / {t.max_bots || 3}
                    </td>
                    <td className="py-3 px-4 min-w-[150px]">
                      <div className="flex justify-between text-[10px] mb-1 font-medium">
                        <span>{used.toLocaleString()}</span>
                        <span className="text-slate-400">{maxQuota.toLocaleString()} msgs</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percent > 85 ? 'bg-rose-500' : percent > 60 ? 'bg-amber-500' : 'bg-blue-600'}`}
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
                        <span>{t.api_key ? `${t.api_key.substring(0, 14)}...` : "—"}</span>
                        {copiedKey === t.api_key ? (
                          <span className="text-emerald-600 font-bold text-[10px]">Copied!</span>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/dashboard?key=${encodeURIComponent(t.api_key)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                          title="Open Customer Bot Studio"
                        >
                          Studio <ArrowUpRight className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => openEditModal(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                          title="Edit Client details & Subscription Quota"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(t.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                            t.is_active 
                              ? "border-slate-300 hover:bg-slate-100 text-slate-600" 
                              : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {t.is_active ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No customer accounts found. Click "Provision Customer Seat" above to add your first client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Customer Seat Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Provision Customer Seat</h3>
                <p className="text-xs text-slate-500">
                  Allocate an enterprise MAZ account with instant login credentials.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs mt-5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Solutions"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Login Username / Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@apex.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Initial Password *</label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">This will be shared with the client for Customer Portal access.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subscription Tier</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none bg-white font-medium text-xs"
                  >
                    <option value="starter">Starter (1,000 msgs/mo)</option>
                    <option value="growth">Growth (3,000 msgs/mo)</option>
                    <option value="pro">Pro (5,000 msgs/mo)</option>
                    <option value="enterprise">Enterprise (20,000+ msgs/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Message Quota</label>
                  <input
                    type="number"
                    step="500"
                    min="500"
                    value={newQuota}
                    onChange={(e) => setNewQuota(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    "Create Seat & Generate Credentials"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Welcome Packet Modal */}
      {welcomePacket && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-black text-slate-900 text-center">Customer Seat Provisioned!</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Account created for <span className="font-bold text-slate-800">{welcomePacket.company_name}</span>. Provide these login credentials to your customer:
            </p>

            {/* Credential summary box */}
            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Customer Portal:</span>
                <a href={welcomePacket.login_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline font-sans">
                  {welcomePacket.login_url}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Username / Email:</span>
                <span className="font-bold text-slate-900">{welcomePacket.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Temporary Password:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {welcomePacket.password}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Subscription Tier:</span>
                <span className="uppercase font-bold text-purple-700 font-sans">{welcomePacket.plan_tier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans">Monthly Quota:</span>
                <span className="font-bold text-slate-900 font-sans">{welcomePacket.max_messages_per_month.toLocaleString()} msgs</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={copyWelcomePacketText}
                className="w-full sm:flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs"
              >
                {copiedWelcome ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied Welcome Message!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Message for WhatsApp / Email
                  </>
                )}
              </button>

              <button
                onClick={() => setWelcomePacket(null)}
                className="w-full sm:w-auto px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Seat & Subscription Modal */}
      {showEditModal && editingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Client Seat & Subscription</h3>
            <p className="text-xs text-slate-500 mb-5">
              Manage subscription quotas, reset monthly balances, or change login password.
            </p>

            <form onSubmit={handleUpdateTenant} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editingTenant.company_name}
                  onChange={(e) => setEditingTenant({ ...editingTenant, company_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingTenant.contact_name || ""}
                    onChange={(e) => setEditingTenant({ ...editingTenant, contact_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email / Username</label>
                  <input
                    type="email"
                    required
                    value={editingTenant.email}
                    onChange={(e) => setEditingTenant({ ...editingTenant, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Reset Password */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Reset Customer Password
                </label>
                <input
                  type="text"
                  placeholder="Leave blank to keep existing password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none font-mono text-xs focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Entering a new password here will immediately update their customer portal login.
                </span>
              </div>

              {/* Subscription & Quota Section */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Tier</label>
                  <select
                    value={editingTenant.plan_tier}
                    onChange={(e) => setEditingTenant({ ...editingTenant, plan_tier: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none bg-white font-medium"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Message Limit</label>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={editingTenant.max_messages_per_month}
                    onChange={(e) => setEditingTenant({ ...editingTenant, max_messages_per_month: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Quota Reset Option */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-900">Current Usage This Month</div>
                  <div className="text-[11px] text-blue-700">
                    {editingTenant.messages_used_this_month || 0} / {editingTenant.max_messages_per_month} msgs used
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-900 text-xs">
                  <input
                    type="checkbox"
                    checked={resetUsageCounter}
                    onChange={(e) => setResetUsageCounter(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Reset to 0 (Recharge)</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTenant(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
