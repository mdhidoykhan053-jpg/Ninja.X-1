module.exports = async (req, res) => {
  // ==========================================
  // NINJA.X-1 BACKEND
  // License Verification + JavaScript Engine
  // ==========================================

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

      if (body.action !== "verify-license") {
        return res.status(400).json({
          success: false,
          message: "Invalid action"
        });
      }

      const licenseKey = String(body.key || "").trim();
      const validKey = process.env.NINJA_LICENSE_KEY;

      if (!validKey) {
        return res.status(500).json({
          success: false,
          message: "License server is not configured"
        });
      }

      if (licenseKey !== validKey) {
        return res.status(401).json({
          success: false,
          message: "Invalid license key"
        });
      }

      return res.status(200).json({
        success: true,
        message: "License activated"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).end("Method not allowed");
  }

  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");

  const scriptContent =
    "(" + function ninjaBoot() {

      // =====================================
      // 1. INITIALIZATION
      // =====================================

      if (window.__Ninja_X_1_ACTIVATED__) {
        const existing = document.getElementById(
          "ninja-main-panel"
        );

        if (existing) {
          existing.style.display =
            existing.style.display === "none"
              ? "block"
              : "none";
        }
        return;
      }

      if (document.getElementById("ninja-license-modal")) {
        return;
      }

      const API_URL = "/api/ninja";
      const MARKET_API = "/api/market-data";

      // =====================================
      // 2. DRAGGABLE FUNCTION
      // =====================================

      function makeDraggable(element) {
        const header =
          element.querySelector(".ninja-drag-header") ||
          element;

        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        header.style.cursor = "move";

        function start(e) {
          if (e.target.closest("button, input, select")) {
            return;
          }

          const point = e.touches
            ? e.touches[0]
            : e;

          startX = point.clientX;
          startY = point.clientY;

          const rect = element.getBoundingClientRect();

          startLeft = rect.left;
          startTop = rect.top;

          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", stop);

          document.addEventListener("touchmove", move, {
            passive: false
          });

          document.addEventListener("touchend", stop);
        }

        function move(e) {
          const point = e.touches
            ? e.touches[0]
            : e;

          if (e.cancelable) e.preventDefault();

          const x = startLeft + point.clientX - startX;
          const y = startTop + point.clientY - startY;

          element.style.left =
            Math.max(0, Math.min(x, window.innerWidth - 60)) + "px";

          element.style.top =
            Math.max(0, Math.min(y, window.innerHeight - 60)) + "px";
        }

        function stop() {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", stop);
          document.removeEventListener("touchmove", move);
          document.removeEventListener("touchend", stop);
        }

        header.addEventListener("mousedown", start);
        header.addEventListener("touchstart", start, {
          passive: true
        });
      }

      // =====================================
      // 3. LICENSE MODAL
      // =====================================

      const modal = document.createElement("div");

      modal.id = "ninja-license-modal";

      modal.style.cssText =
        "position:fixed;top:50%;left:50%;" +
        "transform:translate(-50%,-50%);" +
        "z-index:999999;width:min(340px,90vw);" +
        "background:#121622;border:1px solid #1e2638;" +
        "border-radius:14px;box-shadow:0 15px 35px rgba(0,0,0,.6);" +
        "font-family:sans-serif;color:#fff;overflow:hidden;";

      modal.innerHTML = `
        <div class="ninja-drag-header"
          style="background:#181d2d;padding:18px;text-align:center;
          border-bottom:1px solid #1e2638;position:relative;">

          <div style="width:50px;height:50px;background:#1e2638;
            border-radius:50%;margin:0 auto 10px;
            display:flex;align-items:center;justify-content:center;">
            <span style="font-size:22px;">🥷</span>
          </div>

          <h3 style="margin:0;font-size:16px;">
            NINJA TRADERS BD
          </h3>

          <p style="font-size:10px;color:#8f9bb3;">
            Security Activation
          </p>

          <span id="ninja-close-modal"
            style="position:absolute;top:12px;right:15px;
            cursor:pointer;font-size:18px;">&times;</span>
        </div>

        <div style="padding:20px;text-align:center;">

          <h4>LICENSE ACTIVATION</h4>

          <p style="font-size:11px;color:#8f9bb3;">
            Enter your authorized license key.
          </p>

          <input id="ninja-license-input"
            type="password"
            placeholder="ENTER LICENSE KEY"
            autocomplete="off"
            style="width:100%;box-sizing:border-box;padding:12px;
            background:#0d111a;border:1px solid #2a344d;
            border-radius:8px;color:white;text-align:center;
            margin-bottom:10px;">

          <div id="ninja-error-msg"
            style="color:#ff4d4d;font-size:11px;min-height:20px;">
          </div>

          <button id="ninja-activate-btn"
            style="width:100%;padding:12px;
            background:linear-gradient(135deg,#0070f3,#00c6ff);
            border:none;border-radius:8px;color:white;
            font-weight:bold;cursor:pointer;">
            ACTIVATE TERMINAL
          </button>

        </div>
      `;

      document.body.appendChild(modal);
      makeDraggable(modal);

      document.getElementById("ninja-close-modal").onclick =
        () => modal.remove();

      // =====================================
      // 4. LICENSE VERIFICATION
      // =====================================

      document.getElementById("ninja-activate-btn").onclick =
        async function () {

          const input = document.getElementById(
            "ninja-license-input"
          );

          const error = document.getElementById(
            "ninja-error-msg"
          );

          const button = this;
          const key = input.value.trim();

          if (!key) {
            error.textContent = "Please enter license key";
            return;
          }

          button.disabled = true;
          button.textContent = "VERIFYING...";

          try {
            const response = await fetch(API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                action: "verify-license",
                key: key
              })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
              throw new Error(
                data.message || "Invalid license"
              );
            }

            window.__Ninja_X_1_ACTIVATED__ = true;

            modal.remove();
            createSignalPanel();

          } catch (e) {
            error.textContent = e.message;
            button.disabled = false;
            button.textContent = "ACTIVATE TERMINAL";
          }
        };

      // =====================================
      // 5. TECHNICAL INDICATORS
      // =====================================

      function EMA(values, period) {
        if (values.length < period) return null;

        const multiplier = 2 / (period + 1);

        let result = values
          .slice(0, period)
          .reduce((a, b) => a + b, 0) / period;

        for (let i = period; i < values.length; i++) {
          result =
            (values[i] - result) * multiplier + result;
        }

        return result;
      }

      function RSI(values, period = 14) {
        if (values.length <= period) return null;

        let gains = 0;
        let losses = 0;

        for (let i = 1; i <= period; i++) {
          const diff = values[i] - values[i - 1];

          if (diff > 0) gains += diff;
          else losses += Math.abs(diff);
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        for (let i = period + 1; i < values.length; i++) {
          const diff = values[i] - values[i - 1];

          avgGain =
            (avgGain * (period - 1) + Math.max(diff, 0)) /
            period;

          avgLoss =
            (avgLoss * (period - 1) + Math.max(-diff, 0)) /
            period;
        }

        if (avgLoss === 0) return 100;

        return 100 - (100 / (1 + avgGain / avgLoss));
      }

      function MACD(values) {
        if (values.length < 35) return null;

        const fast = [];
        const slow = [];

        for (let i = 0; i < values.length; i++) {
          const part = values.slice(0, i + 1);

          fast.push(EMA(part, 12));
          slow.push(EMA(part, 26));
        }

        const line = fast.map((v, i) =>
          v !== null && slow[i] !== null
            ? v - slow[i]
            : null
        ).filter(v => v !== null);

        if (line.length < 9) return null;

        const signal = EMA(line, 9);

        return {
          line: line[line.length - 1],
          signal: signal
        };
      }

      // =====================================
      // 6. SIGNAL ENGINE
      // =====================================

      function analyzeCandles(candles) {

        if (!Array.isArray(candles) || candles.length < 40) {
          throw new Error(
            "Insufficient candle data. Need at least 40 candles."
          );
        }

        const closes = candles.map(c => Number(c.close));

        if (closes.some(v => !Number.isFinite(v) || v <= 0)) {
          throw new Error("Invalid candle data");
        }

        const last = closes[closes.length - 1];

        const rsi = RSI(closes, 14);
        const ema9 = EMA(closes, 9);
        const ema21 = EMA(closes, 21);
        const macd = MACD(closes);

        if (
          rsi === null ||
          ema9 === null ||
          ema21 === null ||
          !macd ||
          macd.signal === null
        ) {
          throw new Error("Indicator calculation failed");
        }

        let score = 0;
        const reasons = [];

        if (ema9 > ema21) {
          score += 2;
          reasons.push("EMA bullish");
        } else if (ema9 < ema21) {
          score -= 2;
          reasons.push("EMA bearish");
        }

        if (macd.line > macd.signal) {
          score += 2;
          reasons.push("MACD bullish");
        } else {
          score -= 2;
          reasons.push("MACD bearish");
        }

        if (rsi > 50 && rsi < 70) {
          score += 1;
          reasons.push("RSI bullish");
        } else if (rsi < 50 && rsi > 30) {
          score -= 1;
          reasons.push("RSI bearish");
        }

        if (last > ema21) {
          score += 1;
        } else {
          score -= 1;
        }

        let signal = "NEUTRAL";
        let color = "#ffcc00";

        if (score >= 4) {
          signal = "UP 🚀";
          color = "#00ffcc";
        } else if (score <= -4) {
          signal = "DOWN 🔻";
          color = "#ff4d4d";
        }

        return {
          signal,
          color,
          score,
          rsi: rsi.toFixed(2),
          ema9: ema9.toFixed(6),
          ema21: ema21.toFixed(6),
          macd: macd.line.toFixed(6),
          macdSignal: macd.signal.toFixed(6),
          price: last,
          reasons
        };
      }

      // =====================================
      // 7. MARKET DATA CONNECTION
      // =====================================

      async function getMarketData(market, expiry) {

        const url = new URL(
          MARKET_API,
          window.location.origin
        );

        url.searchParams.set("market", market);
        url.searchParams.set("expiry", expiry);

        const response = await fetch(url.toString(), {
          method: "GET",
          cache: "no-store",
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(
            "Market Data API Error: " + response.status
          );
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.candles)) {
          throw new Error("Market data unavailable");
        }

        return data.candles;
      }

      // =====================================
      // 8. MAIN SIGNAL PANEL
      // =====================================

      function createSignalPanel() {

        const panel = document.createElement("div");

        panel.id = "ninja-main-panel";

        panel.style.cssText =
          "position:fixed;top:100px;left:50px;z-index:999999;" +
          "width:min(260px,90vw);background:#121622;" +
          "border:1px solid #1e2638;border-radius:16px;" +
          "box-shadow:0 10px 30px rgba(0,0,0,.7);" +
          "font-family:sans-serif;color:white;text-align:center;" +
          "padding:15px;box-sizing:border-box;";

        const markets = [
          ["Popular Currencies", [
            "EUR/USD (OTC)", "GBP/USD (OTC)",
            "AUD/USD (OTC)", "USD/JPY (OTC)",
            "USD/CAD (OTC)", "NZD/USD (OTC)",
            "USD/CHF (OTC)", "EUR/GBP (OTC)",
            "EUR/JPY (OTC)", "GBP/JPY (OTC)",
            "AUD/CAD (OTC)", "AUD/JPY (OTC)",
            "CAD/JPY (OTC)", "EUR/AUD (OTC)",
            "GBP/AUD (OTC)", "CHF/JPY (OTC)",
            "EUR/CAD (OTC)", "GBP/CAD (OTC)",
            "NZD/JPY (OTC)", "AUD/NZD (OTC)"
          ]],
          ["Exotic Currencies", [
            "USD/BDT (OTC)", "USD/INR (OTC)",
            "USD/PKR (OTC)", "USD/PHP (OTC)",
            "USD/IDR (OTC)", "USD/ZAR (OTC)",
            "USD/MXN (OTC)", "USD/BRL (OTC)",
            "USD/TRY (OTC)", "USD/SGD (OTC)"
          ]],
          ["Cryptocurrencies", [
            "BTC/USD (OTC)", "ETH/USD (OTC)",
            "LTC/USD (OTC)", "XRP/USD (OTC)",
            "ADA/USD (OTC)", "SOL/USD (OTC)",
            "DOGE/USD (OTC)", "DOT/USD (OTC)",
            "TRX/USD (OTC)", "BNB/USD (OTC)"
          ]],
          ["Metals & Commodities", [
            "Gold / XAUUSD (OTC)",
            "Silver / XAGUSD (OTC)",
            "Brent Crude (OTC)",
            "Natural Gas (OTC)"
          ]],
          ["Regular Forex", [
            "EUR/USD", "GBP/USD", "USD/JPY",
            "AUD/USD", "USD/CHF", "USD/CAD",
            "NZD/USD", "EUR/GBP", "EUR/JPY",
            "GBP/JPY", "AUD/JPY", "CAD/JPY",
            "CHF/JPY", "EUR/AUD", "GBP/AUD",
            "EUR/CAD", "AUD/NZD", "NZD/JPY"
          ]],
          ["Stocks & Indices", [
            "Apple Inc (OTC)", "Tesla (OTC)",
            "Microsoft (OTC)", "Amazon (OTC)",
            "Netflix (OTC)", "Google (OTC)",
            "Facebook / Meta (OTC)",
            "S&P 500 (OTC)", "NASDAQ (OTC)",
            "Dow Jones (OTC)", "FTSE 100 (OTC)",
            "DAX 30 (OTC)", "CAC 40 (OTC)",
            "NIKKEI 225 (OTC)"
          ]]
        ];

        let marketOptions = "";

        markets.forEach(group => {
          marketOptions +=
            '<optgroup label="' + group[0] + '">';

          group[1].forEach(market => {
            marketOptions +=
              '<option value="' + market + '">' +
              market + '</option>';
          });

          marketOptions += "</optgroup>";
        });

        panel.innerHTML = `
          <div class="ninja-drag-header"
            style="cursor:move;padding-bottom:8px;">

            <div style="width:45px;height:45px;
              background:linear-gradient(135deg,#00c9ff,#92fe9d);
              border-radius:50%;margin:0 auto 8px;
              display:flex;align-items:center;
              justify-content:center;">
              <span style="font-size:20px;">🥷</span>
            </div>

            <h4 style="margin:0;font-size:13px;">
              NINJA VIP SIGNAL
            </h4>

            <p style="font-size:9px;color:#8f9bb3;">
              MARKET ANALYSIS TERMINAL
            </p>
          </div>

          <div style="text-align:left;margin-bottom:9px;">
            <label style="font-size:10px;color:#8f9bb3;">
              SELECT MARKET:
            </label>

            <select id="ninja-market-select"
              style="width:100%;padding:8px;
              background:#0d111a;color:white;
              border:1px solid #2a344d;border-radius:6px;">
              ${marketOptions}
            </select>
          </div>

          <div style="text-align:left;margin-bottom:10px;">
            <label style="font-size:10px;color:#8f9bb3;">
              EXPIRY TIME:
            </label>

            <select id="ninja-time-select"
              style="width:100%;padding:8px;
              background:#0d111a;color:white;
              border:1px solid #2a344d;border-radius:6px;">

              <option value="5">5 Seconds</option>
              <option value="10">10 Seconds</option>
              <option value="15">15 Seconds</option>
              <option value="30">30 Seconds</option>
              <option value="60" selected>1 Minute (M1)</option>
              <option value="120">2 Minutes (M2)</option>
              <option value="180">3 Minutes (M3)</option>
              <option value="240">4 Minutes (M4)</option>
              <option value="300">5 Minutes (M5)</option>
            </select>
          </div>

          <div id="ninja-signal-box"
            style="background:#0d111a;
            border:1px solid #2a344d;border-radius:10px;
            padding:12px;margin-bottom:10px;">

            <div id="ninja-signal-status"
              style="font-size:11px;color:#8f9bb3;">
              Configure & Scan
            </div>

            <div id="ninja-signal-result"
              style="font-size:17px;font-weight:800;
              color:#00ffcc;margin:6px;">
              READY
            </div>

            <div id="ninja-indicators"
              style="font-size:10px;color:#8f9bb3;
              text-align:left;line-height:1.8;">
              RSI: --<br>
              EMA: --<br>
              MACD: --<br>
              PRICE: --
            </div>
          </div>

          <button id="ninja-scan-btn"
            style="width:100%;padding:11px;
            background:linear-gradient(135deg,#00b09b,#96c93d);
            border:none;border-radius:8px;color:white;
            font-weight:bold;cursor:pointer;">
            START SCANNING
          </button>

          <div style="font-size:9px;color:#8f9bb3;margin-top:9px;">
            NINJA.X-1 | AI ANALYSIS ENGINE
          </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);

        // =====================================
        // 9. SCAN BUTTON
        // =====================================

        const scanButton = document.getElementById(
          "ninja-scan-btn"
        );

        scanButton.onclick = async function () {

          const market = document.getElementById(
            "ninja-market-select"
          ).value;

          const expiry = Number(
            document.getElementById(
              "ninja-time-select"
            ).value
          );

          const status = document.getElementById(
            "ninja-signal-status"
          );

          const result = document.getElementById(
            "ninja-signal-result"
          );

          const indicators = document.getElementById(
            "ninja-indicators"
          );

          scanButton.disabled = true;
          scanButton.textContent = "ANALYZING...";

          status.textContent = "Connecting to market data...";
          result.textContent = "LOADING...";
          result.style.color = "#ffcc00";

          indicators.textContent = "Waiting for candle data...";

          try {

            const candles = await getMarketData(
              market,
              expiry
            );

            const analysis = analyzeCandles(candles);

            status.textContent =
              market + " | " + expiry + " Seconds";

            result.textContent = analysis.signal;
            result.style.color = analysis.color;

            indicators.innerHTML =
              "RSI: " + analysis.rsi +
              "<br>EMA 9: " + analysis.ema9 +
              "<br>EMA 21: " + analysis.ema21 +
              "<br>MACD: " + analysis.macd +
              "<br>PRICE: " + analysis.price +
              "<br>SCORE: " + analysis.score;

          } catch (error) {

            status.textContent = "DATA CONNECTION ERROR";

            result.textContent = "NO SIGNAL";
            result.style.color = "#ff4d4d";

            indicators.textContent = error.message;

          } finally {

            scanButton.disabled = false;
            scanButton.textContent = "START SCANNING";
          }
        };
      }

    }.toString() + ")();";

  return res.status(200).send(scriptContent);
};
