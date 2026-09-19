"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { 
  Bot, Palette, BookOpen, Flame, Code, UploadCloud, 
  Globe, Plus, Check, Copy, Sparkles, Send, Save, 
  Trash2, LogOut, Key, ArrowUpRight, Loader2, FileText,
  User, Lock, Eye, EyeOff, Shield, Zap, AlertCircle, BarChart3, RefreshCw, MessageSquare,
  Search, Settings, Database, FileSpreadsheet, Download, Share2, Phone, ExternalLink, X
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
  const [activeTab, setActiveTab] = useState<"appearance" | "knowledge" | "leads" | "conversations" | "embed" | "odoo">("appearance");

  // Odoo AI Analytics State
  const isMaifelzOwner = tenantProfile?.company_name?.toLowerCase().includes("maifelz") || false;
  const [odooUrl, setOdooUrl] = useState("");
  const [odooDb, setOdooDb] = useState("");
  const [odooUsername, setOdooUsername] = useState("");
  const [odooApiKey, setOdooApiKey] = useState("");
  const [showOdooConfigModal, setShowOdooConfigModal] = useState(false);
  const [isConnectingOdoo, setIsConnectingOdoo] = useState(false);
  const [odooConnected, setOdooConnected] = useState(false);
  const [odooMetrics, setOdooMetrics] = useState<any>(null);
  const [odooQuestion, setOdooQuestion] = useState("");
  const [isQueryingOdoo, setIsQueryingOdoo] = useState(false);
  const [odooReport, setOdooReport] = useState<any>(null);
  const [odooError, setOdooError] = useState<string | null>(null);

  // WhatsApp Dispatch & Export States
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [metaPhoneNumberId, setMetaPhoneNumberId] = useState("");
  const [metaAccessToken, setMetaAccessToken] = useState("");
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsAppStatusMsg, setWhatsAppStatusMsg] = useState<string | null>(null);
  const [showMetaSettings, setShowMetaSettings] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMetaPhoneNumberId(localStorage.getItem("maz_meta_phone_id") || "");
      setMetaAccessToken(localStorage.getItem("maz_meta_token") || "");
    }
  }, []);

  const formatWhatsAppMessage = (report: any) => {
    if (!report) return "";
    const title = `*📊 ${report.model_label || "MAZ AI Analytics Report"}*`;
    const period = report.period && report.period !== "All time" ? `\n*Period:* ${report.period}` : "";
    const total = report.total_found !== undefined ? `\n*Total Records:* ${Number(report.total_found).toLocaleString()}` : "";
    const sum = report.total_amount ? `\n*Total Value:* ${Number(report.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "";
    
    let cleanAnswer = (report.direct_answer || "")
      .replace(/^#+\s+/gm, "")
      .replace(/\n\s*[\*\-]\s+/g, "\n• ");
      
    return `${title}${period}${total}${sum}\n\n*Executive Summary:*\n${cleanAnswer}\n\n_Generated via MAZ AI (ai.maifelz.com)_`;
  };

  const handleSendMetaWhatsApp = async () => {
    if (!whatsAppPhone.trim() || !odooReport) return;
    const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      alert("Please enter a valid phone number with country code.");
      return;
    }
    setIsSendingWhatsApp(true);
    setWhatsAppStatusMsg(null);
    const msg = formatWhatsAppMessage(odooReport);
    try {
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/odoo-analytics/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: cleanPhone,
          message: msg,
          meta_phone_number_id: metaPhoneNumberId || undefined,
          meta_access_token: metaAccessToken || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setWhatsAppStatusMsg(`Sent successfully to +${cleanPhone} via Meta Cloud API!`);
      } else if (data.fallback_url) {
        setWhatsAppStatusMsg("Meta Cloud API not configured on server. Opening in WhatsApp Web...");
        window.open(data.fallback_url, "_blank");
      } else {
        throw new Error(data.detail || data.error || "Failed to send WhatsApp message");
      }
    } catch (err: any) {
      console.error("WhatsApp send error:", err);
      const fallbackUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(fallbackUrl, "_blank");
      setWhatsAppStatusMsg("Opened report in WhatsApp!");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleOpenWhatsAppWeb = () => {
    if (!whatsAppPhone.trim() || !odooReport) return;
    const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, "");
    const msg = formatWhatsAppMessage(odooReport);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleExportExcel = () => {
    if (!odooReport) return;
    try {
      const wb = XLSX.utils.book_new();
      if (odooReport.records && odooReport.records.length > 0) {
        const wsData = XLSX.utils.json_to_sheet(odooReport.records);
        XLSX.utils.book_append_sheet(wb, wsData, "Live Report");
      }
      const summaryRows = [
        ["Report Title", odooReport.model_label || "Odoo Report"],
        ["Target Model", odooReport.model || ""],
        ["Period", odooReport.period || "All time"],
        ["Total Database Records", odooReport.total_found ?? 0],
        ["Total Amount", odooReport.total_amount ? Number(odooReport.total_amount).toFixed(2) : "N/A"],
        ["Generated At", new Date().toLocaleString()],
        ["", ""],
        ["Executive Analysis", odooReport.direct_answer ? odooReport.direct_answer.replace(/^#+\s*/gm, "") : ""]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      const filename = `${(odooReport.model_label || "odoo_report").toLowerCase().replace(/[^a-z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (err) {
      console.error("Failed to export Excel:", err);
      alert("Could not export Excel file.");
    }
  };

  const handleExportPDF = () => {
    if (!odooReport) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const tableHeaders = odooReport.records && odooReport.records.length > 0 ? Object.keys(odooReport.records[0]) : [];
    const tableRowsHtml = odooReport.records && odooReport.records.length > 0
      ? odooReport.records.map((row: any) => `
        <tr>
          ${Object.values(row).map((val: any) => `<td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #1e293b;">${val ?? '—'}</td>`).join('')}
        </tr>
      `).join('')
      : '';

    const cleanAnswerHtml = (odooReport.direct_answer || '')
      .split('\n')
      .map((l: string) => {
        const tr = l.trim();
        if (!tr) return '<br/>';
        if (tr.startsWith('#')) return `<h3 style="margin: 12px 0 6px 0; font-size: 13px; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">${tr.replace(/^#+\s*/, '')}</h3>`;
        if (tr.startsWith('* ') || tr.startsWith('- ')) return `<li style="margin: 4px 0; font-size: 11px; color: #334155;">${tr.replace(/^[\*\-]\s*/, '')}</li>`;
        return `<p style="margin: 4px 0; font-size: 11px; color: #334155; line-height: 1.6;">${tr}</p>`;
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${odooReport.model_label || 'Executive Report'} - MAZ AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #0f172a; margin: 0; }
          .header { border-bottom: 2px solid #9333ea; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }
          .brand { font-size: 13px; font-weight: 700; color: #9333ea; margin: 0; }
          .badges { display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
          .badge { padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; background: #f8fafc; border: 1px solid #e2e8f0; }
          .summary-card { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 18px; margin-bottom: 25px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left; }
          th { background: #f8fafc; padding: 8px 12px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
          @media print { body { padding: 0; } @page { margin: 1.5cm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${odooReport.model_label || 'Executive Analytics Report'}</h1>
            <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Generated on ${new Date().toLocaleString()} • Odoo Live XML-RPC</p>
          </div>
          <div style="text-align: right;">
            <p class="brand">MAZ AI</p>
            <p style="font-size: 10px; color: #94a3b8; margin: 0;">ai.maifelz.com</p>
          </div>
        </div>

        <div class="badges">
          <span class="badge">Model: ${odooReport.model || 'N/A'}</span>
          ${odooReport.period ? `<span class="badge" style="background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;">Period: ${odooReport.period}</span>` : ''}
          <span class="badge" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0;">Total: ${(odooReport.total_found || 0).toLocaleString()} Records</span>
          ${odooReport.total_amount ? `<span class="badge" style="background: #fffbeb; color: #b45309; border-color: #fde68a;">Total Value: ${Number(odooReport.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>` : ''}
        </div>

        ${cleanAnswerHtml ? `
          <div class="summary-card">
            <div style="font-size: 11px; font-weight: 800; color: #581c87; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Executive Summary</div>
            <div>${cleanAnswerHtml}</div>
          </div>
        ` : ''}

        ${tableHeaders.length > 0 ? `
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 20px;">Detailed Data Ledger</div>
          <table>
            <thead>
              <tr>${tableHeaders.map((h: string) => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>${tableRowsHtml}</tbody>
          </table>
        ` : ''}

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-950 font-bold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-purple-100/80 text-purple-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold">$1</code>');
  };

  const renderDirectAnswer = (content: string) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // 1. Headers: ### Title or ## Title -> Clean Section Headings (removes ### entirely)
      if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
        const cleanTitle = trimmed.replace(/^#+\s*/, "");
        elements.push(
          <div key={idx} className="text-xs font-black text-slate-900 border-b border-purple-100/80 pb-1 mt-3 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0"></span>
            <span>{cleanTitle}</span>
          </div>
        );
        return;
      }

      // 2. Subheaders: #### Subtitle or Numbered Section (e.g. #### 1. Overall Summary) -> Clean Sub-heading
      if (trimmed.startsWith("####") || /^(\d+\.\s+[A-Za-z]+)/.test(trimmed)) {
        const cleanSub = trimmed.replace(/^#+\s*/, "");
        elements.push(
          <div key={idx} className="text-xs font-black text-purple-950 mt-2.5 mb-1 flex items-center gap-1.5">
            <span className="text-purple-600 font-black">▸</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(cleanSub) }} />
          </div>
        );
        return;
      }

      // 3. Bullet points: * Bullet or - Bullet -> Cleanly Indented Bullet with Round Indicator
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const cleanBullet = trimmed.replace(/^[\*\-]\s+/, "");
        elements.push(
          <div key={idx} className="flex items-start gap-2.5 my-1 pl-1 text-slate-700 leading-relaxed text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(cleanBullet) }} />
          </div>
        );
        return;
      }

      // 4. Notes: *(Note: ...)* or *Note: ...* -> Clean Highlighted Box
      if ((trimmed.startsWith("*(") && trimmed.endsWith(")*")) || trimmed.toLowerCase().startsWith("*note:")) {
        const cleanNote = trimmed.replace(/^\*\(?/, "").replace(/\)?\*$/, "");
        elements.push(
          <div key={idx} className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/60 text-[11px] text-purple-900 leading-relaxed my-2 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
            <div className="flex-1 italic" dangerouslySetInnerHTML={{ __html: formatInline(cleanNote) }} />
          </div>
        );
        return;
      }

      // 5. Standard paragraph with clean line-height and aligned text
      elements.push(
        <p
          key={idx}
          className="text-slate-700 text-xs leading-relaxed font-normal my-1"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });

    return <div className="space-y-0.5">{elements}</div>;
  };

  const handleOdooQuery = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : odooQuestion).trim();
    if (!q) return;

    // Conversational WhatsApp dispatch detection
    const waMatch = q.match(/send (?:this )?(?:report )?to whatsapp (?:number )?([+\d\s-]+)/i);
    if (waMatch && odooReport) {
      const phone = waMatch[1].replace(/[^0-9]/g, "");
      if (phone) {
        setWhatsAppPhone(phone);
        setIsWhatsAppModalOpen(true);
        setOdooQuestion("");
        return;
      }
    }

    if (!odooUrl || !odooDb || !odooUsername || !odooApiKey) {
      setShowOdooConfigModal(true);
      return;
    }
    setIsQueryingOdoo(true);
    setOdooError(null);
    setOdooReport(null);
    try {
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/odoo-analytics/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          odoo_url: odooUrl,
          odoo_db: odooDb,
          odoo_username: odooUsername,
          odoo_api_key: odooApiKey,
          question: q
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Query failed");
      setOdooReport(data.report);
      setOdooConnected(true);
    } catch (err: any) {
      setOdooError(err.message || "Could not query Odoo");
    } finally {
      setIsQueryingOdoo(false);
    }
  };

  const handleTestOdooConnection = async () => {
    if (!odooUrl || !odooDb || !odooUsername || !odooApiKey) {
      setShowOdooConfigModal(true);
      return;
    }
    setIsConnectingOdoo(true);
    setOdooError(null);
    try {
      const res = await fetch("https://maz-backend-t1hy.onrender.com/api/v1/odoo-analytics/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          odoo_url: odooUrl,
          odoo_db: odooDb,
          odoo_username: odooUsername,
          odoo_api_key: odooApiKey
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Connection failed");
      setOdooConnected(true);
      setOdooMetrics(data.metrics);
    } catch (err: any) {
      setOdooError(err.message || "Failed to connect to Odoo");
    } finally {
      setIsConnectingOdoo(false);
    }
  };

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

  // Conversations History State
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

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
          
          // Auto-configure credentials for Maifelz, otherwise load client's saved credentials
          if (pData.tenant?.company_name?.toLowerCase().includes("maifelz")) {
            setOdooUrl("https://maifelz-maifelz.odoo.com");
            setOdooDb("maifelz-maifelz-maifelz-37525993");
            setOdooUsername("fahad@maifelz.com");
            setOdooApiKey("04474c6cbf27ffae05a5e4c85d7bbe4ad00df9cb");
          } else {
            // Check if tenant has their own Odoo credentials saved in localStorage
            const savedOdoo = localStorage.getItem(`maz_odoo_creds_${pData.tenant?.id}`);
            if (savedOdoo) {
              try {
                const parsed = JSON.parse(savedOdoo);
                setOdooUrl(parsed.url || "");
                setOdooDb(parsed.db || "");
                setOdooUsername(parsed.username || "");
                setOdooApiKey(parsed.api_key || "");
              } catch (e) {}
            }
          }
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
    fetchConversations(bot.bot_id, key);
  };

  const fetchConversations = async (botId: string, key: string) => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch(`https://maz-backend-t1hy.onrender.com/api/v1/bots/${botId}/conversations`, {
        headers: { "X-MAZ-API-KEY": key }
      });
      if (res.ok) {
        const d = await res.json();
        setConversations(d.conversations || []);
      }
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      setIsLoadingConversations(false);
    }
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
    const code = `<script \n  src="https://ai.maifelz.com/maz.js" \n  data-bot-id="${currentBot.bot_id}" \n  defer>\n</script>`;
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
            onClick={() => setActiveTab("conversations")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "conversations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Conversations ({conversations.length})
          </button>
          <button
            onClick={() => setActiveTab("embed")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "embed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Embed &amp; Widget
          </button>
          <button
            onClick={() => setActiveTab("odoo")}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "odoo" ? "bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white shadow-sm font-bold" : "text-purple-700 hover:bg-purple-100/60 font-semibold"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Odoo AI Analytics
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

      {/* TAB: CONVERSATIONS HISTORY */}
      {activeTab === "conversations" && (
        <div className="space-y-6 text-xs animate-fade-up">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] mb-2 border border-blue-200">
                <MessageSquare className="w-3.5 h-3.5" /> Full Transparency &amp; AI Training
              </div>
              <h2 className="text-lg font-black text-slate-900">Live Website Conversation History</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Inspect every question asked by visitors on your website. Use these real questions to refine your Knowledge Base notes.
              </p>
            </div>

            <button
              onClick={() => currentBot && fetchConversations(currentBot.bot_id, apiKey)}
              disabled={isLoadingConversations}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition flex items-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingConversations ? "animate-spin text-purple-600" : ""}`} />
              Refresh Logs
            </button>
          </div>

          {isLoadingConversations ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-600">Loading conversation transcripts...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">No conversation logs yet</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                When visitors chat with your AI assistant on your website, their full message history will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversation List */}
              <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {conversations.map((c) => {
                  const isSelected = selectedConversation?.id === c.id;
                  const firstUserMsg = c.messages?.find((m: any) => m.role === "user")?.content || "Session started";
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConversation(c)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? "bg-purple-50/80 border-purple-300 shadow-sm ring-2 ring-purple-500/20" 
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          {c.session_token.slice(0, 12)}...
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                          {c.message_count} msgs
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2">
                        💬 "{firstUserMsg}"
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {c.created_at ? new Date(c.created_at).toLocaleString() : "Recent"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conversation Detail View */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[450px]">
                {selectedConversation ? (
                  <>
                    <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Transcript View</div>
                        <div className="text-[11px] text-slate-400 font-mono">Session: {selectedConversation.session_token}</div>
                      </div>
                      <button
                        onClick={() => {
                          const transcriptText = selectedConversation.messages
                            ?.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
                            .join("\n\n");
                          navigator.clipboard.writeText(transcriptText || "");
                          alert("Transcript copied to clipboard!");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Copy className="w-3 h-3" /> Copy Transcript
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3.5 py-4 max-h-[500px]">
                      {selectedConversation.messages?.map((m: any) => {
                        const isUser = m.role === "user";
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                          >
                            <span className="text-[10px] font-bold text-slate-400 mb-1">
                              {isUser ? "Visitor" : "MAZ Assistant"}
                            </span>
                            <div
                              className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                                isUser 
                                  ? "bg-purple-700 text-white rounded-tr-none shadow-sm" 
                                  : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80"
                              }`}
                            >
                              {m.content}
                            </div>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                    <div className="font-semibold text-slate-600">Select a conversation from the left</div>
                    <div className="text-xs text-slate-400 mt-0.5">View full user &amp; AI dialogue exchange</div>
                  </div>
                )}
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
                {`<script \n  src="https://ai.maifelz.com/maz.js" \n  data-bot-id="${currentBot?.bot_id}" \n  defer>\n</script>`}
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

      {/* TAB 5: ODOO AI ANALYTICS & EXECUTIVE REPORTING */}
      {activeTab === "odoo" && (
        <div className="space-y-6 text-xs animate-fade-up">
          {/* Header & Status Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shadow-inner shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">Odoo AI Analyst</h2>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                      Live ERP Intelligence
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Ask natural language questions to query your live Odoo database, inspect leads, contacts, orders, and applications.
                  </p>
                </div>
              </div>

              {/* Status & Settings Button */}
              <div className="flex items-center gap-2">
                {odooConnected ? (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{tenantProfile?.company_name || "Odoo"} Live</span>
                  </div>
                ) : (
                  <button
                    onClick={handleTestOdooConnection}
                    disabled={isConnectingOdoo}
                    className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold text-[11px] transition flex items-center gap-1.5 shadow-sm"
                  >
                    {isConnectingOdoo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    {isConnectingOdoo ? "Connecting..." : (odooUrl ? `Connect ${tenantProfile?.company_name || "Odoo"}` : "Configure Gateway")}
                  </button>
                )}

                <button
                  onClick={() => setShowOdooConfigModal(true)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition border border-slate-200"
                  title="Configure Odoo Credentials"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtle Inline Metrics Strip */}
            {odooMetrics && (
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Live Database:</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold text-[11px] border border-purple-100">
                  👥 {odooMetrics.leads_count} Leads
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-100">
                  🏢 {odooMetrics.partners_count} Partners &amp; Contacts
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-100">
                  📑 {odooMetrics.sales_count} Sales Orders
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-100">
                  💰 {odooMetrics.invoices_count} Invoices &amp; Bills
                </span>
                <button
                  onClick={handleTestOdooConnection}
                  disabled={isConnectingOdoo}
                  title="Refresh counts"
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition ml-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isConnectingOdoo ? "animate-spin" : ""}`} />
                </button>
              </div>
            )}
          </div>

          {/* Central Hero: Clean "Ask Anything" Search Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOdooQuery();
              }}
              className="relative"
            >
              <div className="relative flex items-center">
                <div className="absolute left-4 text-purple-600 pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ask anything about your Odoo ERP (e.g., 'Who applied for internships?', 'Show top leads', 'List customer contacts')..."
                  value={odooQuestion}
                  onChange={(e) => setOdooQuestion(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 text-slate-900 placeholder:text-slate-400 text-xs font-medium transition"
                />
                <div className="absolute right-1.5 flex items-center">
                  <button
                    type="submit"
                    disabled={isQueryingOdoo || !odooQuestion.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-800 hover:to-purple-900 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-900/20 disabled:opacity-50"
                  >
                    {isQueryingOdoo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{isQueryingOdoo ? "Querying..." : "Ask AI"}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Clean Prompt Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Suggested:</span>
              {[
                { label: "🎓 Internship & Job Applications", q: "Who applied for jobs or internships recently?" },
                { label: "👥 Recent CRM Leads", q: "Show recent CRM leads with email and phone" },
                { label: "🏢 Contacts & Partners", q: "List all contacts in our Odoo database" },
                { label: "📑 Sales Orders & Quotations", q: "Show all sales orders and quotations" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOdooQuestion(item.q);
                    handleOdooQuery(item.q);
                  }}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-600 text-[11px] font-medium transition flex items-center gap-1 border border-slate-200/60"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {odooError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center justify-between gap-3 animate-fade-up">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-medium">{odooError}</span>
              </div>
              <button
                onClick={() => setOdooError(null)}
                className="text-xs text-rose-500 hover:text-rose-800 font-bold px-2 py-1 rounded"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State */}
          {isQueryingOdoo && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Odoo AI Analyst is querying your ERP database...</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                Translating question to XML-RPC domain filters, querying live models, and synthesizing executive insights.
              </p>
            </div>
          )}

          {/* Generated Report Result */}
          {odooReport && !isQueryingOdoo && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-5 p-6 sm:p-7 animate-fade-up">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Model: {odooReport.model}
                    </span>
                    {odooReport.period && odooReport.period !== "All time" && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 capitalize">
                        Period: {odooReport.period}
                      </span>
                    )}
                    {odooReport.total_amount && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Total Sum: {odooReport.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live XML-RPC
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {odooReport.model_label} (
                    {(odooReport.total_found ?? odooReport.records?.length ?? 0).toLocaleString()} Total Records
                    {odooReport.records && odooReport.records.length > 0 && !odooReport.is_count_only
                      ? odooReport.is_grouped
                        ? `, ${odooReport.records.length} Breakdown Rows`
                        : `, Showing ${odooReport.records.length}`
                      : ""}
                    )
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportExcel}
                    title="Export as professional Excel (.xlsx) workbook"
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Excel
                  </button>

                  <button
                    onClick={handleExportPDF}
                    title="Print or Save clean Executive PDF Report"
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    PDF
                  </button>

                  <button
                    onClick={() => setIsWhatsAppModalOpen(true)}
                    title="Send query report to WhatsApp via Meta Cloud API or direct link"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>

                  <button
                    onClick={() => {
                      setOdooReport(null);
                      setOdooQuestion("");
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Direct Specific Answer Card */}
              {odooReport.direct_answer && (
                <div className="p-5 bg-gradient-to-r from-purple-50/90 via-fuchsia-50/50 to-purple-50/80 rounded-2xl border border-purple-200/90 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                      <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <span>Direct Answer:</span>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 text-purple-600" /> Powered by MAZ AI
                    </span>
                  </div>
                  <div className="text-slate-800 text-xs leading-relaxed font-medium pl-8 space-y-1.5">
                    {renderDirectAnswer(odooReport.direct_answer)}
                  </div>
                </div>
              )}

              {/* AI Key Insights Box */}
              {odooReport.insights && odooReport.insights.length > 0 && !odooReport.direct_answer && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                  <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Executive Summary:
                  </div>
                  <div className="space-y-1.5">
                    {odooReport.insights.map((ins: string, idx: number) => (
                      <div key={idx} className="text-slate-700 text-xs flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: ins.replace(/\*\*(.*?)\*\*/g, '<strong className="text-purple-950 font-bold">$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Table (Only rendered when detailed records are requested, hidden for count-only queries) */}
              {!odooReport.is_count_only && odooReport.records && odooReport.records.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-inner">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        {Object.keys(odooReport.records[0]).map((col) => (
                          <th key={col} className="py-3 px-4 capitalize whitespace-nowrap">
                            {col.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {odooReport.records.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-purple-50/30 transition">
                          {Object.values(row).map((val: any, cIdx: number) => (
                            <td key={cIdx} className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                              {val === null || val === false || val === "" ? (
                                <span className="text-slate-300">-</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : !odooReport.is_count_only ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No matching records found in this Odoo model for your search.
                </div>
              ) : null}
            </div>
          )}

          {/* Clean Initial Hero State when no report yet */}
          {!odooReport && !isQueryingOdoo && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-slate-900">Direct Natural Language ERP Gateway</h3>
                <p className="text-slate-500 text-xs">
                  Ask any question above or choose a suggested prompt to query your live Odoo models and generate instant executive reports.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Real-Time XML-RPC
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Multi-Tenant Isolated
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Instant AI Summaries
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ODOO CREDENTIALS CONFIGURATION MODAL */}
      {showOdooConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configure Odoo Gateway: {tenantProfile?.company_name || "Client ERP"}
                </h3>
                <span className="text-slate-500 text-[11px]">Connect your company's Odoo ERP instance via XML-RPC.</span>
              </div>
              <button
                onClick={() => setShowOdooConfigModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tenantProfile?.id) {
                  localStorage.setItem(
                    `maz_odoo_creds_${tenantProfile.id}`,
                    JSON.stringify({
                      url: odooUrl.trim(),
                      db: odooDb.trim(),
                      username: odooUsername.trim(),
                      api_key: odooApiKey.trim(),
                    })
                  );
                }
                setShowOdooConfigModal(false);
                setOdooConnected(false);
                setOdooMetrics(null);
              }}
              className="space-y-3.5 my-4"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odoo Server URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://yourcompany.odoo.com"
                  value={odooUrl}
                  onChange={(e) => setOdooUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Database Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourcompany_db"
                  value={odooDb}
                  onChange={(e) => setOdooDb(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odoo User Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@yourcompany.com"
                  value={odooUsername}
                  onChange={(e) => setOdooUsername(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odoo API Key</label>
                <input
                  type="password"
                  required
                  placeholder="Enter Odoo generated API Key"
                  value={odooApiKey}
                  onChange={(e) => setOdooApiKey(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Generate in Odoo: User Profile ➔ Account Security ➔ New API Key.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOdooConfigModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Dispatch Modal */}
      {isWhatsAppModalOpen && odooReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug">Dispatch to WhatsApp</h3>
                    <p className="text-emerald-100 text-xs">Send live analytics & executive summary</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsWhatsAppModalOpen(false);
                    setWhatsAppStatusMsg(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Report Summary Preview */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{odooReport.model_label || "Analytics Report"}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    {(odooReport.total_found ?? odooReport.records?.length ?? 0).toLocaleString()} Records
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] line-clamp-2">
                  {odooReport.direct_answer ? odooReport.direct_answer.replace(/^#+\s*/gm, "") : "Direct report overview"}
                </p>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Number (with Country Code)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +971501234567 or 919876543210"
                  value={whatsAppPhone}
                  onChange={(e) => setWhatsAppPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-600 transition"
                />
                <p className="text-[10px] text-slate-400">
                  Include country code (e.g. 971 for UAE, 91 for India, 1 for US/Canada).
                </p>
              </div>

              {/* Meta Cloud API Optional Configuration Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMetaSettings(!showMetaSettings)}
                  className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {showMetaSettings ? "Hide Meta Cloud API Settings" : "Custom Meta Cloud API Credentials (Optional)"}
                </button>

                {showMetaSettings && (
                  <div className="mt-2.5 p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2.5 text-xs">
                    <p className="text-[10px] text-slate-500">
                      If configured, messages are dispatched automatically in the background via the official Meta Cloud API. Otherwise, it opens directly in WhatsApp Web.
                    </p>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Meta Phone Number ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 104593829102938"
                        value={metaPhoneNumberId}
                        onChange={(e) => {
                          setMetaPhoneNumberId(e.target.value);
                          localStorage.setItem("maz_meta_phone_id", e.target.value);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Meta Permanent Access Token</label>
                      <input
                        type="password"
                        placeholder="EAAB..."
                        value={metaAccessToken}
                        onChange={(e) => {
                          setMetaAccessToken(e.target.value);
                          localStorage.setItem("maz_meta_token", e.target.value);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Message */}
              {whatsAppStatusMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{whatsAppStatusMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppWeb}
                  disabled={!whatsAppPhone.trim()}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  title="Open WhatsApp chat with pre-filled message"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open WhatsApp Web
                </button>

                <button
                  type="button"
                  onClick={handleSendMetaWhatsApp}
                  disabled={isSendingWhatsApp || !whatsAppPhone.trim()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isSendingWhatsApp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      Dispatch via API
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
