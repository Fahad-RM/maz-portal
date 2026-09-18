/**
 * MAZ Universal Embeddable AI Widget
 * Copyright (c) 2026 Maifel Technologies LLP
 * https://maifeltechnologies.com
 */
(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.__MAZ_INITIALIZED__) return;
  window.__MAZ_INITIALIZED__ = true;

  // Find script element and attributes
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

  // Session Token
  let sessionToken = localStorage.getItem("maz_session_token_" + botId);
  if (!sessionToken) {
    sessionToken = "sess_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("maz_session_token_" + botId, sessionToken);
  }

  let botConfig = {
    brand_title: "MAZ AI Assistant",
    brand_subtitle: "Trained on company knowledge 24/7",
    brand_color: "#2563eb",
    welcome_message: "👋 Hi there! How can I help you today?",
    placeholder_text: "Ask a question...",
    suggested_chips: ["Pricing", "Services", "Talk to an Expert"],
    escalation_message: "Would you like our team to follow up with you directly?"
  };

  let isOpen = false;
  let conversationHistory = [];
  let isStreaming = false;

  // Inject CSS Styles
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    #maz-root * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    #maz-launcher-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: #2563eb;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
      border: none;
      outline: none;
    }
    #maz-launcher-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 32px rgba(37, 99, 235, 0.45);
    }
    #maz-launcher-btn svg { width: 30px; height: 30px; fill: #ffffff; transition: transform 0.2s; }
    
    #maz-chat-panel {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 580px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #maz-chat-panel.maz-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .maz-header {
      padding: 16px 20px;
      background: #2563eb;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .maz-header-info { display: flex; align-items: center; gap: 12px; }
    .maz-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }
    .maz-title { font-weight: 600; font-size: 15px; line-height: 1.2; }
    .maz-sub { font-size: 11px; opacity: 0.85; margin-top: 3px; display: flex; align-items: center; gap: 5px; }
    .maz-online-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; display: inline-block; }
    .maz-close-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 4px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .maz-close-btn:hover { opacity: 1; }

    .maz-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .maz-bubble {
      max-width: 82%;
      padding: 12px 16px;
      font-size: 14px;
      line-height: 1.45;
      border-radius: 16px;
      word-wrap: break-word;
    }
    .maz-bubble-bot {
      background: #ffffff;
      color: #1e293b;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      border: 1px solid #e2e8f0;
    }
    .maz-bubble-user {
      background: #2563eb;
      color: #ffffff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .maz-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .maz-chip {
      background: #eef2ff;
      color: #3730a3;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid #c7d2fe;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .maz-chip:hover { background: #e0e7ff; transform: translateY(-1px); }

    .maz-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      align-self: flex-start;
      width: fit-content;
    }
    .maz-typing-dot {
      width: 6px;
      height: 6px;
      background: #94a3b8;
      border-radius: 50%;
      animation: mazBounce 1.2s infinite ease-in-out;
    }
    .maz-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .maz-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes mazBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

    .maz-lead-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      margin-top: 6px;
    }
    .maz-lead-card h4 { margin: 0 0 6px 0; font-size: 13px; color: #1e293b; }
    .maz-lead-input {
      width: 100%;
      padding: 8px 10px;
      font-size: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      margin-bottom: 8px;
      outline: none;
    }
    .maz-lead-input:focus { border-color: #2563eb; }
    .maz-lead-btn {
      width: 100%;
      padding: 8px;
      background: #2563eb;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }

    .maz-footer {
      padding: 10px 14px;
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .maz-input {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .maz-input:focus { border-color: #2563eb; }
    .maz-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .maz-send-btn:hover { background: #1d4ed8; }
    .maz-send-btn svg { width: 16px; height: 16px; fill: #ffffff; }

    .maz-branding {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      padding: 4px 0 6px 0;
      background: #ffffff;
    }
    .maz-branding a { color: #64748b; text-decoration: none; font-weight: 600; }
  `;
  document.head.appendChild(styleEl);

  // Create Widget Elements
  const root = document.createElement("div");
  root.id = "maz-root";

  root.innerHTML = `
    <button id="maz-launcher-btn" aria-label="Open chat">
      <svg id="maz-icon-open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <svg id="maz-icon-close" viewBox="0 0 24 24" style="display:none;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>

    <div id="maz-chat-panel">
      <div class="maz-header" id="maz-header">
        <div class="maz-header-info">
          <div class="maz-avatar" id="maz-avatar">M</div>
          <div>
            <div class="maz-title" id="maz-title">MAZ Support</div>
            <div class="maz-sub">
              <span class="maz-online-dot"></span>
              <span id="maz-subtitle">Online • Answers 24/7</span>
            </div>
          </div>
        </div>
        <button class="maz-close-btn" id="maz-close-x" aria-label="Close chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>

      <div class="maz-body" id="maz-body"></div>

      <div class="maz-footer">
        <input type="text" class="maz-input" id="maz-input" placeholder="Ask a question..." autocomplete="off" />
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

  // References
  const launcherBtn = document.getElementById("maz-launcher-btn");
  const iconOpen = document.getElementById("maz-icon-open");
  const iconClose = document.getElementById("maz-icon-close");
  const chatPanel = document.getElementById("maz-chat-panel");
  const closeX = document.getElementById("maz-close-x");
  const chatBody = document.getElementById("maz-body");
  const inputEl = document.getElementById("maz-input");
  const sendBtn = document.getElementById("maz-send");

  // Fetch Public Config
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
      launcherBtn.style.background = botConfig.brand_color;
      document.getElementById("maz-header").style.background = botConfig.brand_color;
      sendBtn.style.background = botConfig.brand_color;
    }
    if (botConfig.brand_title) document.getElementById("maz-title").textContent = botConfig.brand_title;
    if (botConfig.brand_subtitle) document.getElementById("maz-subtitle").textContent = botConfig.brand_subtitle;
    if (botConfig.placeholder_text) inputEl.placeholder = botConfig.placeholder_text;
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatPanel.classList.add("maz-open");
      iconOpen.style.display = "none";
      iconClose.style.display = "block";
      setTimeout(() => inputEl.focus(), 150);
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
    b.style.background = botConfig.brand_color || "#2563eb";
    b.textContent = text;
    chatBody.appendChild(b);
    chatBody.scrollTop = chatBody.scrollHeight;
    conversationHistory.push({ role: "user", content: text });
  }

  function appendBotMessage(text) {
    const b = document.createElement("div");
    b.className = "maz-bubble maz-bubble-bot";
    b.textContent = text;
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
      <h4>📬 Connect with our team</h4>
      <input type="text" id="maz-lead-name" class="maz-lead-input" placeholder="Your Name" />
      <input type="email" id="maz-lead-email" class="maz-lead-input" placeholder="Your Email address" />
      <input type="tel" id="maz-lead-phone" class="maz-lead-input" placeholder="Phone number (optional)" />
      <button class="maz-lead-btn" id="maz-lead-submit">Request Follow-Up</button>
    `;
    chatBody.appendChild(card);
    chatBody.scrollTop = chatBody.scrollHeight;

    document.getElementById("maz-lead-submit").onclick = () => {
      const name = document.getElementById("maz-lead-name").value;
      const email = document.getElementById("maz-lead-email").value;
      const phone = document.getElementById("maz-lead-phone").value;

      if (!email && !phone) {
        alert("Please provide an email or phone number.");
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
      .then(res => {
        card.innerHTML = `<div style="color:#15803d; font-weight:600; font-size:13px;">✅ Thank you! Our specialist will reach out to you shortly.</div>`;
      })
      .catch(() => {
        card.innerHTML = `<div style="color:#b91c1c; font-size:12px;">Notice: Could not submit. Please try again later.</div>`;
      });
    };
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isStreaming) return;

    inputEl.value = "";
    appendUserMessage(text);
    const typing = showTypingIndicator();
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
                botBubble.textContent = fullAssistantText;
                chatBody.scrollTop = chatBody.scrollHeight;
              }
            } catch (e) {}
          }
        }
      }

      conversationHistory.push({ role: "assistant", content: fullAssistantText });

      // If user asks for pricing, demo, or escalation, offer lead capture card
      const lower = text.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("talk") || lower.includes("demo") || lower.includes("quote") || conversationHistory.length >= 4) {
        setTimeout(offerLeadCapture, 800);
      }

    } catch (err) {
      removeTypingIndicator();
      appendBotMessage("Sorry, I'm having trouble connecting to the knowledge base right now. Please try again in a moment.");
    } finally {
      isStreaming = false;
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

})();
