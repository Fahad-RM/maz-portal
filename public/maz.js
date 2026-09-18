/**
 * MAZ Universal Embeddable AI Widget
 * Ultra-Premium Glassmorphism & Smooth Letter Streaming
 * Copyright (c) 2026 Maifel Technologies LLP
 * https://maifeltechnologies.com
 */
(function () {
  "use strict";

  if (window.__MAZ_INITIALIZED__) return;
  window.__MAZ_INITIALIZED__ = true;

  const currentScript =
    document.currentScript ||
    document.querySelector('script[data-bot-id]');

  const botId = currentScript ? currentScript.getAttribute("data-bot-id") : null;
  const apiHost = (currentScript ? currentScript.getAttribute("data-api-host") : null) || 
    (window.location.hostname === "localhost" ? "http://localhost:8000" : "https://maz-backend-t1hy.onrender.com");

  if (!botId) {
    console.error("[MAZ Widget] Missing 'data-bot-id' attribute on script tag.");
    return;
  }

  let sessionToken = localStorage.getItem("maz_session_token_" + botId);
  if (!sessionToken) {
    sessionToken = "sess_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("maz_session_token_" + botId, sessionToken);
  }

  let botConfig = {
    brand_title: "Maifelz Support",
    brand_subtitle: "Official Odoo Partner & AI 24/7",
    brand_color: "#831843",
    welcome_message: "👋 Welcome to Maifelz! How can I assist with your Odoo ERP implementation, custom AI solutions, or integrations today?",
    placeholder_text: "Ask about Odoo, AI agents, or pricing...",
    suggested_chips: ["Xero Integration", "Odoo Implementation", "WhatsApp CRM", "Book a Free Consultation"],
    escalation_message: "Would you like our specialist to connect with you directly?"
  };

  let isOpen = false;
  let conversationHistory = [];
  let isStreaming = false;

  // Markdown Formatter (Converts **bold**, *italic*, bullets to clean safe HTML)
  function formatMarkdown(text) {
    if (!text) return "";
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Clean up excessive awkward bold start greetings
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:inherit;">$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em style="font-style:italic;">$1</em>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px;">$1</code>');
    formatted = formatted.replace(/^\s*[-•]\s+(.*)$/gm, '<div style="display:flex;align-items:flex-start;gap:6px;margin:3px 0;"><span style="color:#831843;font-size:14px;line-height:1.2;">•</span><span>$1</span></div>');
    formatted = formatted.replace(/\n\n/g, '<div style="height:8px;"></div>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  }

  // Inject Modern Glassmorphism CSS Styles
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes mazFloatPulse {
      0% { box-shadow: 0 8px 28px -4px rgba(131, 24, 67, 0.4), 0 0 0 0 rgba(131, 24, 67, 0.4); }
      70% { box-shadow: 0 12px 36px -4px rgba(131, 24, 67, 0.45), 0 0 0 14px rgba(131, 24, 67, 0); }
      100% { box-shadow: 0 8px 28px -4px rgba(131, 24, 67, 0.4), 0 0 0 0 rgba(131, 24, 67, 0); }
    }
    @keyframes mazFadeSlideUp {
      from { opacity: 0; transform: translateY(14px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes mazBubbleEnter {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    #maz-root * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    #maz-launcher-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #831843 0%, #9d174d 100%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      outline: none;
      animation: mazFloatPulse 3s infinite;
    }
    #maz-launcher-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 16px 40px -4px rgba(131, 24, 67, 0.55);
    }
    #maz-launcher-btn svg { width: 28px; height: 28px; fill: #ffffff; transition: transform 0.25s ease; }

    #maz-chat-panel {
      position: fixed;
      bottom: 98px;
      right: 24px;
      width: 400px;
      height: 610px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 26px;
      box-shadow: 
        0 28px 64px -16px rgba(15, 23, 42, 0.2), 
        0 0 0 1px rgba(255, 255, 255, 0.9) inset, 
        0 8px 24px -4px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      transform: translateY(24px) scale(0.96);
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #maz-chat-panel.maz-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .maz-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #831843 0%, #9d174d 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    .maz-header-info { display: flex; align-items: center; gap: 12px; }
    .maz-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .maz-title { font-weight: 700; font-size: 15px; line-height: 1.2; letter-spacing: -0.01em; }
    .maz-sub { font-size: 11px; opacity: 0.9; margin-top: 3px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
    .maz-online-dot {
      width: 7px;
      height: 7px;
      background: #34d399;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 8px #34d399;
    }
    .maz-close-btn {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .maz-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    .maz-body {
      flex: 1;
      overflow-y: auto;
      padding: 18px;
      background: rgba(248, 250, 252, 0.6);
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }
    .maz-body::-webkit-scrollbar { width: 5px; }
    .maz-body::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.6); border-radius: 10px; }

    .maz-bubble {
      max-width: 86%;
      padding: 13px 16px;
      font-size: 13.5px;
      line-height: 1.55;
      border-radius: 18px;
      word-wrap: break-word;
      animation: mazBubbleEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .maz-bubble-bot {
      background: rgba(255, 255, 255, 0.95);
      color: #1e293b;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 
        0 4px 16px -2px rgba(15, 23, 42, 0.05),
        0 0 0 1px rgba(226, 232, 240, 0.8) inset;
    }
    .maz-bubble-user {
      background: linear-gradient(135deg, #831843 0%, #9d174d 100%);
      color: #ffffff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      box-shadow: 0 6px 18px -2px rgba(131, 24, 67, 0.32);
    }

    .maz-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .maz-chip {
      background: rgba(255, 255, 255, 0.9);
      color: #831843;
      font-size: 11.5px;
      font-weight: 600;
      padding: 7px 13px;
      border-radius: 20px;
      border: 1px solid rgba(131, 24, 67, 0.18);
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .maz-chip:hover {
      background: #831843;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(131, 24, 67, 0.25);
    }

    .maz-typing {
      display: flex;
      gap: 5px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      width: fit-content;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .maz-typing-dot {
      width: 6px;
      height: 6px;
      background: #9d174d;
      border-radius: 50%;
      animation: mazBounce 1.2s infinite ease-in-out;
    }
    .maz-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .maz-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes mazBounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

    .maz-lead-card {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(203, 213, 225, 0.8);
      border-radius: 16px;
      padding: 14px;
      margin-top: 4px;
      box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.08);
      animation: mazBubbleEnter 0.3s ease;
    }
    .maz-lead-card h4 { margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #1e293b; }
    .maz-lead-input {
      width: 100%;
      padding: 9px 12px;
      font-size: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      margin-bottom: 8px;
      outline: none;
      background: #f8fafc;
      transition: all 0.2s;
    }
    .maz-lead-input:focus {
      border-color: #831843;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(131, 24, 67, 0.12);
    }
    .maz-lead-btn {
      width: 100%;
      padding: 9px;
      background: linear-gradient(135deg, #831843 0%, #9d174d 100%);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(131, 24, 67, 0.25);
      transition: all 0.2s;
    }
    .maz-lead-btn:hover { opacity: 0.95; transform: translateY(-1px); }

    .maz-footer {
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      border-top: 1px solid rgba(226, 232, 240, 0.8);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .maz-input {
      flex: 1;
      border: 1px solid rgba(203, 213, 225, 0.8);
      border-radius: 9999px;
      padding: 10px 18px;
      font-size: 13px;
      outline: none;
      background: rgba(241, 245, 249, 0.7);
      transition: all 0.2s ease;
    }
    .maz-input:focus {
      border-color: #831843;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(131, 24, 67, 0.12);
    }
    .maz-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #831843 0%, #9d174d 100%);
      border: none;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 12px rgba(131, 24, 67, 0.28);
      flex-shrink: 0;
    }
    .maz-send-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 6px 16px rgba(131, 24, 67, 0.38);
    }
    .maz-send-btn svg { width: 17px; height: 17px; fill: #ffffff; }

    .maz-branding {
      text-align: center;
      font-size: 10.5px;
      color: #94a3b8;
      padding: 6px 0 8px 0;
      background: rgba(255, 255, 255, 0.85);
      border-top: 1px solid rgba(241, 245, 249, 0.8);
      letter-spacing: 0.02em;
    }
    .maz-branding a { color: #64748b; text-decoration: none; font-weight: 700; transition: color 0.15s; }
    .maz-branding a:hover { color: #831843; }
  `;
  document.head.appendChild(styleEl);

  // Create Widget Elements
  const root = document.createElement("div");
  root.id = "maz-root";

  root.innerHTML = `
    <button id="maz-launcher-btn" aria-label="Open chat assistant">
      <svg id="maz-icon-open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <svg id="maz-icon-close" viewBox="0 0 24 24" style="display:none;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>

    <div id="maz-chat-panel">
      <div class="maz-header" id="maz-header">
        <div class="maz-header-info">
          <div class="maz-avatar" id="maz-avatar">M</div>
          <div>
            <div class="maz-title" id="maz-title">Maifelz Support</div>
            <div class="maz-sub">
              <span class="maz-online-dot"></span>
              <span id="maz-subtitle">Official Odoo Partner & AI 24/7</span>
            </div>
          </div>
        </div>
        <button class="maz-close-btn" id="maz-close-x" aria-label="Close chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>

      <div class="maz-body" id="maz-body"></div>

      <div class="maz-footer">
        <input type="text" class="maz-input" id="maz-input" placeholder="Ask about Odoo, AI agents, or pricing..." autocomplete="off" />
        <button class="maz-send-btn" id="maz-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="maz-branding">
        Powered by <a href="https://maifeltechnologies.com" target="_blank" rel="noopener">MAZ by Maifelz</a>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // DOM References
  const launcherBtn = document.getElementById("maz-launcher-btn");
  const iconOpen = document.getElementById("maz-icon-open");
  const iconClose = document.getElementById("maz-icon-close");
  const chatPanel = document.getElementById("maz-chat-panel");
  const closeX = document.getElementById("maz-close-x");
  const chatBody = document.getElementById("maz-body");
  const inputEl = document.getElementById("maz-input");
  const sendBtn = document.getElementById("maz-send");

  // Fetch Live Bot Config
  fetch(`${apiHost}/api/v1/chat/config/${botId}`)
    .then((r) => r.json())
    .then((cfg) => {
      botConfig = Object.assign(botConfig, cfg);
      applyTheme();
      renderInitialGreeting();
    })
    .catch(() => {
      renderInitialGreeting();
    });

  function applyTheme() {
    if (botConfig.brand_color) {
      launcherBtn.style.background = `linear-gradient(135deg, ${botConfig.brand_color} 0%, #1e293b 140%)`;
      document.getElementById("maz-header").style.background = `linear-gradient(135deg, ${botConfig.brand_color} 0%, #1e293b 140%)`;
      sendBtn.style.background = botConfig.brand_color;
    }
    if (botConfig.brand_title) {
      document.getElementById("maz-title").textContent = botConfig.brand_title;
      document.getElementById("maz-avatar").textContent = botConfig.brand_title.charAt(0);
    }
    if (botConfig.brand_subtitle) document.getElementById("maz-subtitle").textContent = botConfig.brand_subtitle;
    if (botConfig.placeholder_text) inputEl.placeholder = botConfig.placeholder_text;
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatPanel.classList.add("maz-open");
      iconOpen.style.display = "none";
      iconClose.style.display = "block";
      setTimeout(() => inputEl.focus(), 200);
    } else {
      chatPanel.classList.remove("maz-open");
      iconOpen.style.display = "block";
      iconClose.style.display = "none";
    }
  }

  launcherBtn.addEventListener("click", toggleChat);
  closeX.addEventListener("click", toggleChat);

  function renderInitialGreeting() {
    chatBody.innerHTML = "";
    appendBotMessage(botConfig.welcome_message);

    if (botConfig.suggested_chips && botConfig.suggested_chips.length > 0) {
      const chipsContainer = document.createElement("div");
      chipsContainer.className = "maz-chips";
      botConfig.suggested_chips.forEach((chipText) => {
        const chip = document.createElement("button");
        chip.className = "maz-chip";
        chip.textContent = chipText;
        chip.onclick = () => {
          inputEl.value = chipText;
          sendMessage();
        };
        chipsContainer.appendChild(chip);
      });
      chatBody.appendChild(chipsContainer);
    }
  }

  function appendUserMessage(text) {
    const b = document.createElement("div");
    b.className = "maz-bubble maz-bubble-user";
    if (botConfig.brand_color) b.style.background = botConfig.brand_color;
    b.textContent = text;
    chatBody.appendChild(b);
    chatBody.scrollTop = chatBody.scrollHeight;
    conversationHistory.push({ role: "user", content: text });
  }

  function appendBotMessage(text) {
    const b = document.createElement("div");
    b.className = "maz-bubble maz-bubble-bot";
    b.innerHTML = formatMarkdown(text);
    chatBody.appendChild(b);
    chatBody.scrollTop = chatBody.scrollHeight;
    return b;
  }

  function showTypingIndicator() {
    const typing = document.createElement("div");
    typing.id = "maz-typing-indicator";
    typing.className = "maz-typing";
    typing.innerHTML = '<span class="maz-typing-dot"></span><span class="maz-typing-dot"></span><span class="maz-typing-dot"></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
    return typing;
  }

  function removeTypingIndicator() {
    const t = document.getElementById("maz-typing-indicator");
    if (t) t.remove();
  }

  function offerLeadCapture() {
    if (document.getElementById("maz-lead-capture-card")) return;
    const card = document.createElement("div");
    card.id = "maz-lead-capture-card";
    card.className = "maz-lead-card";
    card.innerHTML = `
      <h4>📬 Connect with our specialist</h4>
      <input type="text" id="maz-lead-name" class="maz-lead-input" placeholder="Your Name" />
      <input type="email" id="maz-lead-email" class="maz-lead-input" placeholder="Your Work Email" />
      <input type="tel" id="maz-lead-phone" class="maz-lead-input" placeholder="Phone / WhatsApp Number" />
      <button class="maz-lead-btn" id="maz-lead-submit">Request Free Consultation</button>
    `;
    chatBody.appendChild(card);
    chatBody.scrollTop = chatBody.scrollHeight;

    document.getElementById("maz-lead-submit").onclick = () => {
      const name = document.getElementById("maz-lead-name").value;
      const email = document.getElementById("maz-lead-email").value;
      const phone = document.getElementById("maz-lead-phone").value;

      if (!email && !phone) {
        alert("Please provide an email or phone number so our team can reach you.");
        return;
      }

      fetch(`${apiHost}/api/v1/chat/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_id: botId,
          session_token: sessionToken,
          name: name,
          email: email,
          phone: phone
        })
      })
      .then(r => r.json())
      .then(() => {
        card.innerHTML = `<div style="color:#059669; font-weight:700; font-size:13px; padding:4px 0;">✅ Thank you! Our lead consultant will reach out to you shortly.</div>`;
      })
      .catch(() => {
        card.innerHTML = `<div style="color:#dc2626; font-size:12px;">Notice: Could not submit. Please try again.</div>`;
      });
    };
  }

  // Smooth Typewriter Letter Flow Manager
  class StreamTypewriter {
    constructor(targetElement, onScroll) {
      this.target = targetElement;
      this.onScroll = onScroll;
      this.queue = "";
      this.displayed = "";
      this.timer = null;
    }

    push(text) {
      this.queue += text;
      if (!this.timer) {
        this.step();
      }
    }

    step() {
      if (this.queue.length > 0) {
        // Dynamic speed based on buffer size
        const speed = this.queue.length > 30 ? 3 : this.queue.length > 10 ? 2 : 1;
        this.displayed += this.queue.slice(0, speed);
        this.queue = this.queue.slice(speed);
        this.target.innerHTML = formatMarkdown(this.displayed);
        this.onScroll();
        this.timer = setTimeout(() => this.step(), 14);
      } else {
        this.timer = null;
      }
    }

    flush() {
      if (this.queue.length > 0) {
        this.displayed += this.queue;
        this.queue = "";
        this.target.innerHTML = formatMarkdown(this.displayed);
        this.onScroll();
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isStreaming) return;

    inputEl.value = "";
    appendUserMessage(text);
    showTypingIndicator();
    isStreaming = true;

    try {
      const response = await fetch(`${apiHost}/api/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_id: botId,
          session_token: sessionToken,
          message: text,
          history: conversationHistory
        })
      });

      removeTypingIndicator();
      const botBubble = appendBotMessage("");
      const typewriter = new StreamTypewriter(botBubble, () => {
        chatBody.scrollTop = chatBody.scrollHeight;
      });

      let fullAssistantText = "";

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

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
                fullAssistantText += parsed.content;
                typewriter.push(parsed.content);
              }
            } catch (e) {}
          }
        }
      }

      // Finish smooth typing
      typewriter.flush();
      conversationHistory.push({ role: "assistant", content: fullAssistantText });

      // Offer Lead Capture if relevant intent
      const lower = text.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("talk") || lower.includes("demo") || lower.includes("quote") || conversationHistory.length >= 4) {
        setTimeout(offerLeadCapture, 800);
      }

    } catch (err) {
      removeTypingIndicator();
      appendBotMessage("I apologize, but I am having trouble connecting right now. Please leave your details or try again in a moment.");
    } finally {
      isStreaming = false;
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

})();
