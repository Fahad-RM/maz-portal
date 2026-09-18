"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, Palette, BookOpen, Flame, Code, UploadCloud, 
  Globe, Plus, Check, Copy, Sparkles, Send, Save, 
  Trash2, LogOut, Key, ArrowUpRight, Loader2, FileText,
  User, Lock, Eye, EyeOff, Shield, Zap, AlertCircle, BarChart3, RefreshCw
} from "lucide-react";

interface TenantProfile {
  id: string;
  company_name: string;
  contact_name?: string;
  email: string;
  plan_tier: string;
  max_messages_per_month: number;
  messages_used_this_month: number;
  remaining_messages: number;
  usage_percentage: number;
  is_active: boolean;
}

interface DocItem {
  id: string;
  bot_id: string;
  title: string;
  source_type: string;
  source_url?: string | null;
  status: string;
  chunk_count: number;
  created_at: string;
}

interface LeadItem {
  id: string;
  bot_id: string;
  name: string;
  email?: string;
  phone?: string;
  score: "HOT" | "WARM" | "COLD";
  score_reason?: string;
  summary?: string;
  synced_to_odoo?: boolean;
  created_at: string;
}

export default function CustomerBotStudio() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);
  
  // Login Form State
  const [loginMethod, setLoginMethod] = useState<"credentials" | "apiKey">("credentials");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);

  // Active Bot
  const [currentBot, setCurrentBot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"appearance" | "knowledge" | "leads" | "embed">("appearance");

  // Bot Config Form State
  const [botTitle, setBotTitle] = useState("");
  const [botSubtitle, setBotSubtitle] = useState("");
  const [brandColor, setBrandColor] = useState("#831843");
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [newChip, setNewChip] = useState("");
  const [escalationMsg, setEscalationMsg] = useState("");

  // Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Knowledge State
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [crawlUrl, setCrawlUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [faqTitle, setFaqTitle] = useState("");
  const [faqContent, setFaqContent] = useState("");
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Interactive Live Preview State
  const [previewInput, setPreviewInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState<{ role: string; content: string }[]>([]);
  const [isPreviewStreaming, setIsPreviewStreaming] = useState(false);

  // 1. Initial Auth Check on Mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get("key");
    const storedKey = localStorage.getItem("maz_portal_api_key");
    const activeKey = keyParam || storedKey;

    if (activeKey) {
      verifyAndLoadSession(activeKey);
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  const verifyAndLoadSession = async (keyToVerify: string) => {
    setIsLoadingAuth(true);
    setAuthError("");
    try {
      // 1. Fetch bots
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/bots", {
        headers: { "X-MAZ-API-KEY": keyToVerify.trim() }
      });

      if (!res.ok) {
        throw new Error("Invalid credentials or customer seat suspended.");
      }

      const data = await res.json();
      const userBots = data.bots || [];
      if (userBots.length === 0) {
        throw new Error("No active AI Chatbot found for this seat. Please contact Maifelz support.");
      }

      const bot = userBots.find((b: any) => b.bot_id === "maz_maifelz_live") || userBots[0];
      
      setApiKey(keyToVerify.trim());
      localStorage.setItem("maz_portal_api_key", keyToVerify.trim());
      setIsAuthenticated(true);
      loadBotData(bot, keyToVerify.trim());

      // 2. Fetch fresh tenant subscription quota
      try {
        const pRes = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/auth/customer/me", {
          headers: { "X-MAZ-API-KEY": keyToVerify.trim() }
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          setTenantProfile(pData.tenant);
          localStorage.setItem("maz_tenant_info", JSON.stringify(pData.tenant));
        }
      } catch (err) {
        console.error("Could not fetch profile:", err);
      }
    } catch (err: any) {
      setAuthError(err.message || "Could not authenticate customer seat.");
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid login credentials. Please check your email and password.");
      }

      setApiKey(data.token);
      localStorage.setItem("maz_portal_api_key", data.token);
      setTenantProfile(data.tenant);
      localStorage.setItem("maz_tenant_info", JSON.stringify(data.tenant));
      setIsAuthenticated(true);

      if (data.bots && data.bots.length > 0) {
        loadBotData(data.bots[0], data.token);
      } else {
        verifyAndLoadSession(data.token);
      }
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadBotData = (bot: any, key: string) => {
    setCurrentBot(bot);
    setBotTitle(bot.brand_title || `${bot.name}`);
    setBotSubtitle(bot.brand_subtitle || "Answers trained on company knowledge 24/7");
    setBrandColor(bot.brand_color || "#831843");
    setWelcomeMsg(bot.welcome_message || "👋 Hi there! How can I assist you today?");
    setChips(bot.suggested_chips || ["Services", "Pricing", "Book a Consultation"]);
    setEscalationMsg(bot.escalation_message || "I would love to connect you with our specialist. Leave your contact details below!");
    setPreviewMessages([{ role: "assistant", content: bot.welcome_message || "👋 Welcome! Ask me anything." }]);

    fetchDocuments(bot.bot_id, key);
    fetchLeads(bot.bot_id, key);
  };

  const fetchDocuments = async (botId: string, key: string) => {
    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${botId}/documents`, {
        headers: { "X-MAZ-API-KEY": key }
      });
      if (res.ok) {
        const d = await res.json();
        setDocuments(d.documents || []);
      }
    } catch (e) {
      console.error("Error fetching documents:", e);
    }
  };

  const fetchLeads = async (botId: string, key: string) => {
    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${botId}/leads`, {
        headers: { "X-MAZ-API-KEY": key }
      });
      if (res.ok) {
        const d = await res.json();
        setLeads(d.leads || []);
      }
    } catch (e) {
      console.error("Error fetching leads:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("maz_portal_api_key");
    localStorage.removeItem("maz_tenant_info");
    setApiKey("");
    setTenantProfile(null);
    setIsAuthenticated(false);
    setCurrentBot(null);
  };

  const handleSaveChanges = async () => {
    if (!currentBot) return;
    setIsSaving(true);
    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${currentBot.bot_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-MAZ-API-KEY": apiKey
        },
        body: JSON.stringify({
          brand_title: botTitle,
          brand_subtitle: botSubtitle,
          brand_color: brandColor,
          welcome_message: welcomeMsg,
          suggested_chips: chips,
          escalation_message: escalationMsg
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        const err = await res.json();
        alert("Notice: " + (err.detail || "Could not save"));
      }
    } catch (e: any) {
      alert("Save failed: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCrawlUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrl || !currentBot) return;
    setIsCrawling(true);
    setActionNotice(null);
    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${currentBot.bot_id}/documents/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MAZ-API-KEY": apiKey
        },
        body: JSON.stringify({ url: crawlUrl })
      });

      if (res.ok) {
        setActionNotice(`✅ Successfully crawled and indexed: ${crawlUrl}`);
        setCrawlUrl("");
        fetchDocuments(currentBot.bot_id, apiKey);
      } else {
        const err = await res.json();
        setActionNotice(`❌ Crawl error: ${err.detail || "Could not scrape URL"}`);
      }
    } catch (e: any) {
      setActionNotice(`❌ Error: ${e.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentBot) return;

    setIsUploading(true);
    setActionNotice(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${currentBot.bot_id}/documents/upload`, {
        method: "POST",
        headers: { "X-MAZ-API-KEY": apiKey },
        body: formData
      });

      if (res.ok) {
        setActionNotice(`✅ Successfully indexed file: ${file.name}`);
        fetchDocuments(currentBot.bot_id, apiKey);
      } else {
        const err = await res.json();
        setActionNotice(`❌ Upload error: ${err.detail || "Failed to process file"}`);
      }
    } catch (e: any) {
      setActionNotice(`❌ Upload error: ${e.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqTitle || !faqContent || !currentBot) return;

    setIsAddingFaq(true);
    setActionNotice(null);
    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${currentBot.bot_id}/documents/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MAZ-API-KEY": apiKey
        },
        body: JSON.stringify({
          title: faqTitle,
          content: faqContent
        })
      });

      if (res.ok) {
        setActionNotice(`✅ Added knowledge note: "${faqTitle}"`);
        setFaqTitle("");
        setFaqContent("");
        fetchDocuments(currentBot.bot_id, apiKey);
      } else {
        const err = await res.json();
        setActionNotice(`❌ Error: ${err.detail || "Could not add note"}`);
      }
    } catch (e: any) {
      setActionNotice(`❌ Error: ${e.message}`);
    } finally {
      setIsAddingFaq(false);
    }
  };

  const handleDeleteDoc = async (docId: string, docTitle: string) => {
    if (!confirm(`Remove "${docTitle}" from your chatbot's knowledge base?`)) return;
    if (!currentBot) return;

    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${currentBot.bot_id}/documents/${docId}`, {
        method: "DELETE",
        headers: { "X-MAZ-API-KEY": apiKey }
      });
      if (res.ok) {
        fetchDocuments(currentBot.bot_id, apiKey);
      }
    } catch (e) {
      alert("Could not remove document.");
    }
  };

  const handleSendPreviewMessage = async () => {
    const text = previewInput.trim();
    if (!text || isPreviewStreaming || !currentBot) return;

    setPreviewInput("");
    const newHistory = [...previewMessages, { role: "user", content: text }];
    setPreviewMessages(newHistory);
    setIsPreviewStreaming(true);

    try {
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_id: currentBot.bot_id,
          session_token: "preview_session_" + currentBot.bot_id,
          message: text,
          history: previewMessages
        })
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botResponse = "";

      setPreviewMessages([...newHistory, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.content) {
                botResponse += parsed.content;
                setPreviewMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: botResponse };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      setPreviewMessages(prev => [
        ...prev,
        { role: "assistant", content: "Notice: Unable to reach AI server. Please verify backend connectivity." }
      ]);
    } finally {
      setIsPreviewStreaming(false);
    }
  };

  const copyEmbedCode = () => {
    if (!currentBot) return;
    const code = `<script \n  src="https://maz-portal.vercel.app/maz.js" \n  data-bot-id="${currentBot.bot_id}" \n  defer>\n</script>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isAuthenticated && !isLoadingAuth) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-xs space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Customer Portal Login</h1>
            <p className="text-slate-500 text-xs mt-1">
              Sign in with your Maifelz customer credentials to manage your AI assistant, knowledge base, and live leads.
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setLoginMethod("credentials"); setAuthError(""); }}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                loginMethod === "credentials" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod("apiKey"); setAuthError(""); }}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                loginMethod === "apiKey" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Key className="w-3.5 h-3.5" /> Client API Key
            </button>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form 1: Email & Password */}
          {loginMethod === "credentials" ? (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Customer Email / Username
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your customer password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  "Sign In to Customer Studio"
                )}
              </button>
            </form>
          ) : (
            /* Form 2: Direct API Key */
            <form onSubmit={(e) => { e.preventDefault(); verifyAndLoadSession(inputKey); }} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-blue-600" /> Client API Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="maz_live_..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm"
              >
                Sign In with API Key
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
            <span className="text-slate-400 text-[11px]">Explore with demo account?</span>
            <button
              onClick={() => {
                setInputKey("maz_live_maifelz_prod_2026");
                verifyAndLoadSession("maz_live_maifelz_prod_2026");
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] underline"
            >
              Load Maifelz Technologies Live Studio (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Connecting to enterprise studio...</span>
      </div>
    );
  }

  const maxQuota = tenantProfile?.max_messages_per_month || 5000;
  const used = tenantProfile?.messages_used_this_month || 0;
  const remaining = tenantProfile?.remaining_messages ?? Math.max(0, maxQuota - used);
  const usagePct = tenantProfile?.usage_percentage ?? Math.min(100, Math.round((used / maxQuota) * 100));
  const planTier = tenantProfile?.plan_tier || "pro";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Bot Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1 font-mono">
              <Bot className="w-3 h-3" /> {currentBot?.bot_id}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 font-semibold transition ml-2"
              title="Sign out or switch customer account"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
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

      {/* Subscription Tier & Quota Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Organization
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">
              {tenantProfile?.company_name || currentBot?.brand_title || "Maifelz Technologies"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black tracking-tight text-white capitalize">
              {planTier} Plan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm">
              Active Tier
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Provisioned by Maifelz Admin • Logged in as: <span className="text-slate-200 font-semibold">{tenantProfile?.email || "Customer"}</span>
          </p>
        </div>

        {/* Quota Balance Meter */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-w-[280px] sm:min-w-[340px]">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-indigo-200 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-300" /> Monthly Message Balance
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              usagePct > 85 ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
              usagePct > 65 ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
              "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {remaining.toLocaleString()} left
            </span>
          </div>

          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                usagePct > 85 ? "bg-rose-500" : usagePct > 65 ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${Math.min(usagePct, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>{used.toLocaleString()} / {maxQuota.toLocaleString()} msgs ({usagePct}%)</span>
            <button
              onClick={() => setShowRechargeModal(true)}
              className="text-indigo-300 hover:text-white font-semibold underline flex items-center gap-1"
            >
              Upgrade / Recharge
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade / Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">Subscription Tier & Quota Upgrade</h3>
            <p className="text-slate-500 text-center mt-1 mb-5">
              Need additional monthly AI message credits or extra chatbot seats? Contact your Maifelz account manager for instant allocation.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Plan:</span>
                <span className="font-bold text-slate-900 uppercase">{planTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Limit:</span>
                <span className="font-bold text-slate-900">{maxQuota.toLocaleString()} messages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-emerald-600">{remaining.toLocaleString()} messages</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`mailto:contact@maifelz.com?subject=Quota%20Recharge%20Request%20-%20${encodeURIComponent(tenantProfile?.company_name || "Customer")}&body=Hello%20Maifelz%20Team,%0A%0AWe%20would%20like%20to%20upgrade%20our%20monthly%20message%20quota%20for%20our%20account:%20${encodeURIComponent(tenantProfile?.email || "")}.`}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Contact Maifelz Support via Email
              </a>
              <button
                type="button"
                onClick={() => setShowRechargeModal(false)}
                className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="font-bold text-blue-600 hover:text-blue-800">×</button>
        </div>
      )}

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
                      <button onClick={() => setChips(chips.filter((_, idx) => idx !== i))} className="text-blue-400 hover:text-blue-700">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add suggested quick question chip..."
                    value={newChip}
                    onChange={(e) => setNewChip(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newChip.trim()) {
                        e.preventDefault();
                        setChips([...chips, newChip.trim()]);
                        setNewChip("");
                      }
                    }}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newChip.trim()) {
                        setChips([...chips, newChip.trim()]);
                        setNewChip("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Escalation / Human Lead Capture Prompt</label>
                <input
                  type="text"
                  value={escalationMsg}
                  onChange={(e) => setEscalationMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                {saveSuccess && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1 text-xs">
                    <Check className="w-4 h-4" /> Changes saved to production bot!
                  </span>
                )}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveChanges}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Appearance
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[560px]">
              {/* Widget Header */}
              <div style={{ backgroundColor: brandColor }} className="p-4 text-white flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                    {botTitle.charAt(0) || "M"}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-none">{botTitle}</div>
                    <div className="text-[10px] text-white/80 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {botSubtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
                {previewMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      style={m.role === "user" ? { backgroundColor: brandColor } : {}}
                      className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                        m.role === "user" ? "text-white" : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isPreviewStreaming && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chips */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPreviewInput(chip);
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium whitespace-nowrap transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendPreviewMessage();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl outline-none text-xs focus:border-blue-500"
                />
                <button
                  onClick={handleSendPreviewMessage}
                  style={{ backgroundColor: brandColor }}
                  className="p-2 rounded-xl text-white transition hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">Live Customer Interactive Preview</span>
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE BASE HUB */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Ingestion Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-600" /> Upload Documents
                </h3>
                <p className="text-slate-500 mb-4 leading-relaxed">
                  Upload company PDFs, brochures, manuals, or pricing sheets. MAZ automatically parses and vector-indexes them.
                </p>
              </div>

              <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer bg-slate-50/50 block">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-1" />
                    <span className="font-semibold text-blue-600">Indexing document into vector DB...</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                    <div className="font-semibold text-slate-700">Click to upload PDF, DOCX, or TXT</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Up to 25MB • Instant RAG chunking</div>
                  </>
                )}
              </label>
            </div>

            {/* URL Crawler Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" /> Crawl Website URL
              </h3>
              <p className="text-slate-500 mb-4 leading-relaxed">
                Enter your landing page, service catalogue, or documentation URL. MAZ will crawl and index its contents.
              </p>
              <form onSubmit={handleCrawlUrl} className="space-y-3">
                <input
                  type="url"
                  required
                  placeholder="https://yourcompany.com/services"
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={isCrawling}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isCrawling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {isCrawling ? "Crawling & Vector Indexing..." : "Crawl & Index Page"}
                </button>
              </form>
            </div>

            {/* Custom FAQ / Note Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" /> Add Custom FAQ Note
              </h3>
              <p className="text-slate-500 mb-3 leading-relaxed">
                Directly add facts, objection responses, or internal policies for the AI assistant.
              </p>
              <form onSubmit={handleAddFaq} className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="Title (e.g. Return Policy or Custom Pricing)"
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-purple-500 text-xs"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Explain the answer or company policy details..."
                  value={faqContent}
                  onChange={(e) => setFaqContent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-purple-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={isAddingFaq}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isAddingFaq ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {isAddingFaq ? "Saving Note..." : "Add Knowledge Note"}
                </button>
              </form>
            </div>
          </div>

          {/* Indexed Documents Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                Trained Knowledge Base Documents ({documents.length})
              </span>
              <button
                onClick={() => currentBot && fetchDocuments(currentBot.bot_id, apiKey)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                ↻ Refresh List
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Title / Source</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Indexed Chunks</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Created</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No documents indexed yet. Upload a PDF or crawl a URL above to train your bot!
                    </td>
                  </tr>
                ) : (
                  documents.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {d.source_url ? (
                          <a href={d.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 flex items-center gap-1">
                            {d.title} <ArrowUpRight className="w-3 h-3" />
                          </a>
                        ) : (
                          d.title
                        )}
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500">{d.source_type}</td>
                      <td className="py-3 px-4 font-mono">{d.chunk_count} chunks</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString() : "Just now"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteDoc(d.id, d.title)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                          title="Remove document from knowledge base"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold">
                {leads.filter(l => l.score === "HOT").length} Hot Deals 🔥
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">
                {leads.filter(l => l.score === "WARM").length} Warm Inquiries 🌤️
              </span>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Flame className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-slate-700">No leads captured yet</div>
              <div className="text-xs text-slate-400 mt-1">
                When visitors chat on your website and ask about pricing or services, MAZ scores their qualification and records them here automatically.
              </div>
            </div>
          ) : (
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
                      <span className="text-[10px] text-slate-400">
                        {ld.created_at ? new Date(ld.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mb-1">{ld.name}</h4>
                    <div className="text-slate-500 text-[11px] mb-2">
                      {ld.email || "No email"} {ld.phone ? `• ${ld.phone}` : ""}
                    </div>

                    <p className="text-slate-700 text-xs line-clamp-2 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {ld.summary || ld.score_reason || "Inquiry from website chat"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Click to view details</span>
                    {ld.synced_to_odoo && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Synced to Odoo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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
                      {selectedLead.score_reason || "Lead qualified through interactive website dialogue."}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Executive Summary:</span>
                    <p className="p-2.5 bg-blue-50/60 rounded-lg text-blue-900 mt-1 border border-blue-100">
                      {selectedLead.summary || "Prospective client contacted assistant directly on website."}
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
              Paste this asynchronous code snippet right before the closing <code>&lt;/body&gt;</code> tag on any website (WordPress, Shopify, Squarespace, Webflow, Odoo, or custom Next.js/HTML).
            </p>

            <div className="relative bg-slate-900 text-blue-200 font-mono p-4 rounded-xl text-[11px] overflow-x-auto">
              <code>
                {`<script \n  src="https://maz-portal.vercel.app/maz.js" \n  data-bot-id="${currentBot?.bot_id}" \n  defer>\n</script>`}
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
              ⚡ <strong>Zero SEO / Core Web Vitals Impact:</strong> Loads asynchronously after initial page load with scoped styles.
            </div>
          </div>

          {/* Odoo CRM Integration Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-600" /> Dedicated Odoo CRM Connector
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Connect this bot directly to Odoo CRM using the standalone <code>maz_odoo_connector</code> module.
            </p>

            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-700">Webhook Endpoint for Odoo:</div>
              <code className="text-slate-600 bg-white p-2 rounded border border-slate-200 block text-[11px]">
                https://maz-backend-t1hy.onrender.com/api/v1/chat/lead
              </code>
              <div className="text-[10px] text-slate-400">
                Whenever a qualified lead submits contact details in your widget, MAZ instantly dispatches the lead into your Odoo CRM pipeline.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
