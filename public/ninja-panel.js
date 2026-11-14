(function () {
  "use strict";

  const ID = "ninja-x1-analysis-panel";

  // Prevent duplicate panels
  if (document.getElementById(ID)) return;

  const style = document.createElement("style");
  style.textContent = `
    #${ID} {
      position: fixed;
      top: 90px;
      right: 12px;
      width: 310px;
      max-width: calc(100vw - 24px);
      z-index: 2147483647;
      background: #0b101a;
      color: #e8f0ff;
      border: 1px solid #26374d;
      border-radius: 13px;
      box-shadow: 0 12px 45px #000b;
      font-family: Arial, sans-serif;
      font-size: 13px;
      overflow: hidden;
    }
    #${ID} * { box-sizing: border-box; }
    #${ID} .header {
      padding: 13px;
      background: #111c2b;
      border-bottom: 1px solid #26374d;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      touch-action: none;
    }
    #${ID} .brand {
      color: #00e5b0;
      font-weight: 900;
      font-size: 16px;
      letter-spacing: 1px;
    }
    #${ID} .sub {
      color: #91a4bd;
      font-size: 10px;
      margin-top: 4px;
    }
    #${ID} .actions { display: flex; gap: 6px; }
    #${ID} button {
      cursor: pointer;
      border: 0;
      border-radius: 6px;
      padding: 9px;
      color: white;
      font-weight: bold;
    }
    #${ID} .small {
      background: #25364b;
      padding: 5px 9px;
    }
    #${ID} .content { padding: 12px; }
    #${ID} .vip {
      text-align: center;
      background: linear-gradient(90deg,#153e3b,#12302f);
      color: #00f0bd;
      padding: 10px;
      border: 1px solid #17675a;
      border-radius: 7px;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    #${ID} .label {
      color: #8fa3bc;
      font-size: 11px;
      margin-bottom: 5px;
    }
    #${ID} select {
      width: 100%;
      background: #141f2e;
      color: white;
      border: 1px solid #33475e;
      padding: 10px;
      border-radius: 7px;
      margin-bottom: 11px;
      outline: none;
    }
    #${ID} .status {
      background: #172334;
      padding: 10px;
      border-radius: 7px;
      margin: 5px 0 12px;
      color: #f5c76b;
      font-size: 11px;
      line-height: 1.5;
    }
    #${ID} .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 10px 0;
    }
    #${ID} .metric {
      background: #121e2c;
      padding: 10px;
      border: 1px solid #24374c;
      border-radius: 7px;
    }
    #${ID} .metric span {
      display: block;
      color: #91a4bd;
      font-size: 10px;
      margin-bottom: 7px;
    }
    #${ID} .metric b { color: #dceaff; }
    #${ID} .signal {
      text-align: center;
      padding: 15px;
      background: #121e2c;
      border: 1px solid #26374d;
      border-radius: 8px;
      margin: 10px 0;
    }
    #${ID} .signal b {
      display: block;
      font-size: 21px;
      color: #f5c76b;
      margin-bottom: 5px;
    }
    #${ID} .start {
      width: 100%;
      padding: 13px;
      background: linear-gradient(90deg,#008d72,#00c69a);
      font-size: 14px;
      letter-spacing: 1px;
    }
    #${ID} .start:active { opacity: .75; }
    #${ID} .footer {
      text-align: center;
      color: #71869e;
      font-size: 10px;
      padding: 10px 5px 2px;
    }
    #${ID} .hidden { display: none; }
  `;

  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = ID;

  panel.innerHTML = `
    <div class="header" id="nx-header">
      <div>
        <div class="brand">NINJA TRADERS BD</div>
        <div class="sub">NINJA.X-1 • ANALYSIS TERMINAL</div>
      </div>
      <div class="actions">
        <button class="small" id="nx-min">−</button>
        <button class="small" id="nx-close">×</button>
      </div>
    </div>

    <div class="content" id="nx-content">
      <div class="vip">✦ NINJA VIP SIGNAL ✦</div>

      <div class="label">MARKET / ASSET</div>
      <select id="nx-market">
        <option value="AUTO">AUTO DETECT MARKET</option>
        <option>EUR/USD</option>
        <option>GBP/USD</option>
        <option>USD/JPY</option>
        <option>AUD/USD</option>
        <option>AUD/CAD</option>
        <option>USD/CHF</option>
        <option>EUR/GBP</option>
        <option>BTC/USD</option>
        <option>GOLD/USD</option>
      </select>

      <div class="label">EXPIRY / TIMEFRAME</div>
      <select id="nx-expiry">
        <option value="30">30 Seconds</option>
        <option value="60" selected>1 Minute</option>
        <option value="120">2 Minutes</option>
        <option value="300">5 Minutes</option>
      </select>

      <div class="status" id="nx-status">
        ● SYSTEM READY<br>
        Live market data: NOT CONNECTED
      </div>

      <div class="grid">
        <div class="metric">
          <span>EMA TREND</span>
          <b id="nx-ema">Waiting...</b>
        </div>
        <div class="metric">
          <span>RSI VALUE</span>
          <b id="nx-rsi">Waiting...</b>
        </div>
        <div class="metric">
          <span>MACD</span>
          <b id="nx-macd">Waiting...</b>
        </div>
        <div class="metric">
          <span>MOMENTUM</span>
          <b id="nx-momentum">Waiting...</b>
        </div>
      </div>

      <div class="signal">
        <b id="nx-signal">WAITING</b>
        <span id="nx-confidence">Confidence: --</span>
      </div>

      <button class="start" id="nx-start">
        ▶ START SCANNING
      </button>

      <div class="footer">
        Ninja.X-1 • Analysis Panel v1.0<br>
        Signals require verified live market data
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  const $ = id => panel.querySelector("#" + id);

  // Market detection from visible page text/title
  function detectMarket() {
    const text = (
      document.title + " " +
      location.href + " " +
      document.body.innerText.slice(0, 5000)
    ).toUpperCase();

    const pairs = [
      "EUR/USD", "GBP/USD", "USD/JPY",
      "AUD/USD", "AUD/CAD", "USD/CHF",
      "EUR/GBP", "BTC/USD", "GOLD/USD"
    ];

    for (const pair of pairs) {
      if (text.includes(pair)) return pair;
    }

    return "UNKNOWN";
  }

  function updateMarket() {
    const select = $("nx-market");
    if (select.value === "AUTO") {
      const pair = detectMarket();
      $("nx-status").innerHTML =
        "● SYSTEM READY<br>Detected market: " + pair +
        "<br>Live data: NOT CONNECTED";
    }
  }

  $("nx-market").addEventListener("change", updateMarket);

  // Scanning UI - does not fabricate trading signals
  $("nx-start").addEventListener("click", function () {
    const button = this;
    button.disabled = true;
    button.textContent = "SCANNING...";

    $("nx-status").textContent =
      "Analyzing connection status...";

    $("nx-signal").textContent = "WAITING";
    $("nx-confidence").textContent = "Confidence: --";

    $("nx-ema").textContent = "No data";
    $("nx-rsi").textContent = "No data";
    $("nx-macd").textContent = "No data";
    $("nx-momentum").textContent = "No data";

    setTimeout(() => {
      $("nx-status").innerHTML =
        "⚠ LIVE DATA CONNECTION REQUIRED<br>" +
        "WebSocket feed is not connected. No real signal generated.";

      $("nx-signal").textContent = "NO DATA";
      $("nx-confidence").textContent = "Confidence: N/A";

      button.disabled = false;
      button.textContent = "▶ START SCANNING";
    }, 1000);
  });

  // Minimize / restore
  $("nx-min").addEventListener("click", () => {
    const content = $("nx-content");
    content.classList.toggle("hidden");
    $("nx-min").textContent =
      content.classList.contains("hidden") ? "+" : "−";
  });

  // Close
  $("nx-close").addEventListener("click", () => {
    panel.remove();
    style.remove();
  });

  // Drag panel on desktop and touch
  const header = $("nx-header");
  let dragging = false;
  let startX = 0, startY = 0;
  let left = 0, top = 0;

  header.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;

    dragging = true;
    const rect = panel.getBoundingClientRect();
    left = rect.left;
    top = rect.top;
    startX = e.clientX;
    startY = e.clientY;

    panel.style.right = "auto";
    header.setPointerCapture(e.pointerId);
  });

  header.addEventListener("pointermove", e => {
    if (!dragging) return;

    const x = Math.max(
      0, Math.min(window.innerWidth - panel.offsetWidth,
      left + e.clientX - startX)
    );

    const y = Math.max(
      0, Math.min(window.innerHeight - 60,
      top + e.clientY - startY)
    );

    panel.style.left = x + "px";
    panel.style.top = y + "px";
  });

  header.addEventListener("pointerup", () => {
    dragging = false;
  });

  updateMarket();

  console.log("[Ninja.X-1] Analysis Panel loaded.");
})();
