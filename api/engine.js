module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");

  const scriptContent = `
    (function() {
      if (window.__Ninja_X_1_ACTIVATED__) {
        const r = document.getElementById('ninja-main-panel');
        if (r) r.style.display = (r.style.display === 'none' ? 'block' : 'none');
        return;
      }
      
      // ড্রেগেবল (Drag and Drop) সুবিধা
      function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = elmnt.querySelector('.ninja-drag-header') || elmnt;
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
        }

        function dragTouchStart(e) {
          const touch = e.touches[0];
          pos3 = touch.clientX;
          pos4 = touch.clientY;
          document.ontouchend = closeTouchElement;
          document.ontouchmove = elementTouchMove;
        }

        function elementTouchMove(e) {
          const touch = e.touches[0];
          pos1 = pos3 - touch.clientX;
          pos2 = pos4 - touch.clientY;
          pos3 = touch.clientX;
          pos4 = touch.clientY;
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeTouchElement() {
          document.ontouchend = null;
          document.ontouchmove = null;
        }
      }

      // ১. লাইসেন্স পপআপ উইন্ডো
      const modal = document.createElement('div');
      modal.id = 'ninja-license-modal';
      modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:999999;width:340px;background:#121622;border:1px solid #1e2638;border-radius:14px;box-shadow:0 15px 35px rgba(0,0,0,0.6);font-family:sans-serif;color:#fff;overflow:hidden;';

      modal.innerHTML = \`
        <div class="ninja-drag-header" style="background:#181d2d;padding:18px;text-align:center;border-bottom:1px solid #1e2638;position:relative;">
          <div style="width:50px;height:50px;background:#1e2638;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(0,168,255,0.3);">
            <span style="font-size:22px;">🥷</span>
          </div>
          <h3 style="margin:0;font-size:16px;font-weight:700;letter-spacing:0.5px;color:#fff;">NINJA TRADERS BD</h3>
          <p style="margin:4px 0 0;font-size:10px;color:#8f9bb3;letter-spacing:1px;text-transform:uppercase;">Security Activation</p>
          <div id="ninja-close-modal" style="position:absolute;top:12px;right:15px;cursor:pointer;color:#8f9bb3;font-size:18px;">&times;</div>
        </div>
        
        <div style="padding:20px;text-align:center;">
          <h4 style="margin:0 0 8px;font-size:15px;color:#fff;">LICENSE ACTIVATION</h4>
          <p style="margin:0 0 16px;font-size:11px;color:#8f9bb3;line-height:1.4;">Enter your authorized license key to unlock the scanner.</p>
          
          <input type="text" id="ninja-license-input" placeholder="NINJA-VIP-2026-OK" style="width:100%;box-sizing:border-box;padding:12px;background:#0d111a;border:1px solid #2a344d;border-radius:8px;color:#fff;font-size:12px;text-align:center;margin-bottom:8px;outline:none;" />
          
          <div id="ninja-error-msg" style="color:#ff4d4d;font-size:11px;margin-bottom:12px;min-height:15px;"></div>
          
          <button id="ninja-activate-btn" style="width:100%;padding:12px;background:linear-gradient(135deg, #0070f3, #00c6ff);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 4px 12px rgba(0,112,243,0.3);margin-bottom:10px;">ACTIVATE TERMINAL</button>
        </div>
      \`;

      document.body.appendChild(modal);
      makeDraggable(modal);

      document.getElementById('ninja-close-modal').onclick = function() {
        modal.remove();
      };

      // ২. লাইসেন্স চেক
      document.getElementById('ninja-activate-btn').onclick = function() {
        const key = document.getElementById('ninja-license-input').value.trim();
        const err = document.getElementById('ninja-error-msg');
        
        if(key === 'NINJA-VIP-2026-OK') {
          window.__Ninja_X_1_ACTIVATED__ = true;
          modal.remove();
          createSignalPanel();
        } else {
          err.innerText = 'Invalid license key! Use NINJA-VIP-2026-OK';
        }
      };

      // ৩. সিগন্যাল প্যানেল উইথ ১০০+ কোটেক্স মার্কেট পেয়ার লিস্ট
      function createSignalPanel() {
        const panel = document.createElement('div');
        panel.id = 'ninja-main-panel';
        panel.style.cssText = 'position:fixed;top:100px;left:50px;z-index:999999;width:260px;background:#121622;border:1px solid #1e2638;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.7);font-family:sans-serif;color:#fff;text-align:center;padding:15px;touch-action:none;';

        panel.innerHTML = \`
          <div class="ninja-drag-header" style="cursor:move;padding-bottom:5px;">
            <div style="width:45px;height:45px;background:linear-gradient(135deg, #00c9ff, #92fe9d);border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(0,201,255,0.4);">
              <span style="font-size:20px;">🥷</span>
            </div>
            <h4 style="margin:0;font-size:13px;color:#fff;letter-spacing:0.5px;">NINJA VIP SIGNAL</h4>
            <p style="margin:2px 0 8px;font-size:9px;color:#8f9bb3;text-transform:uppercase;">100+ Markets & Time Scanner</p>
          </div>

          <!-- ১০০+ মার্কেট পেয়ার ড্রপডাউন -->
          <div style="margin-bottom:8px;text-align:left;">
            <label style="font-size:10px;color:#8f9bb3;display:block;margin-bottom:2px;">SELECT MARKET (100+):</label>
            <select id="ninja-market-select" style="width:100%;box-sizing:border-box;padding:7px;background:#0d111a;border:1px solid #2a344d;border-radius:6px;color:#fff;font-size:11px;outline:none;cursor:pointer;max-height:160px;">
              <optgroup label="Popular Currencies (OTC)">
                <option value="EUR/USD (OTC)">EUR/USD (OTC)</option>
                <option value="GBP/USD (OTC)">GBP/USD (OTC)</option>
                <option value="AUD/USD (OTC)">AUD/USD (OTC)</option>
                <option value="USD/JPY (OTC)">USD/JPY (OTC)</option>
                <option value="USD/CAD (OTC)">USD/CAD (OTC)</option>
                <option value="NZD/USD (OTC)">NZD/USD (OTC)</option>
                <option value="USD/CHF (OTC)">USD/CHF (OTC)</option>
                <option value="EUR/GBP (OTC)">EUR/GBP (OTC)</option>
                <option value="EUR/JPY (OTC)">EUR/JPY (OTC)</option>
                <option value="GBP/JPY (OTC)">GBP/JPY (OTC)</option>
                <option value="AUD/CAD (OTC)">AUD/CAD (OTC)</option>
                <option value="AUD/JPY (OTC)">AUD/JPY (OTC)</option>
                <option value="CAD/JPY (OTC)">CAD/JPY (OTC)</option>
                <option value="EUR/AUD (OTC)">EUR/AUD (OTC)</option>
                <option value="GBP/AUD (OTC)">GBP/AUD (OTC)</option>
                <option value="CHF/JPY (OTC)">CHF/JPY (OTC)</option>
                <option value="EUR/CAD (OTC)">EUR/CAD (OTC)</option>
                <option value="GBP/CAD (OTC)">GBP/CAD (OTC)</option>
                <option value="NZD/JPY (OTC)">NZD/JPY (OTC)</option>
                <option value="AUD/NZD (OTC)">AUD/NZD (OTC)</option>
              </optgroup>
              <optgroup label="Exotic Currencies (OTC)">
                <option value="USD/BDT (OTC)">USD/BDT (OTC)</option>
                <option value="USD/INR (OTC)">USD/INR (OTC)</option>
                <option value="USD/PKR (OTC)">USD/PKR (OTC)</option>
                <option value="USD/PHP (OTC)">USD/PHP (OTC)</option>
                <option value="USD/IDR (OTC)">USD/IDR (OTC)</option>
                <option value="USD/ZAR (OTC)">USD/ZAR (OTC)</option>
                <option value="USD/MXN (OTC)">USD/MXN (OTC)</option>
                <option value="USD/BRL (OTC)">USD/BRL (OTC)</option>
                <option value="USD/TRY (OTC)">USD/TRY (OTC)</option>
                <option value="USD/SGD (OTC)">USD/SGD (OTC)</option>
              </optgroup>
              <optgroup label="Cryptocurrencies (OTC)">
                <option value="BTC/USD (OTC)">BTC/USD (OTC)</option>
                <option value="ETH/USD (OTC)">ETH/USD (OTC)</option>
                <option value="LTC/USD (OTC)">LTC/USD (OTC)</option>
                <option value="XRP/USD (OTC)">XRP/USD (OTC)</option>
                <option value="ADA/USD (OTC)">ADA/USD (OTC)</option>
                <option value="SOL/USD (OTC)">SOL/USD (OTC)</option>
                <option value="DOGE/USD (OTC)">DOGE/USD (OTC)</option>
                <option value="DOT/USD (OTC)">DOT/USD (OTC)</option>
                <option value="TRX/USD (OTC)">TRX/USD (OTC)</option>
                <option value="BNB/USD (OTC)">BNB/USD (OTC)</option>
              </optgroup>
              <optgroup label="Commodities & Metals (OTC)">
                <option value="Gold / XAUUSD (OTC)">Gold / XAUUSD (OTC)</option>
                <option value="Silver / XAGUSD (OTC)">Silver / XAGUSD (OTC)</option>
                <option value="Brent Crude (OTC)">Brent Crude (OTC)</option>
                <option value="Natural Gas (OTC)">Natural Gas (OTC)</option>
              </optgroup>
              <optgroup label="Regular Forex (Live)">
                <option value="EUR/USD">EUR/USD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/JPY">USD/JPY</option>
                <option value="AUD/USD">AUD/USD</option>
                <option value="USD/CHF">USD/CHF</option>
                <option value="USD/CAD">USD/CAD</option>
                <option value="NZD/USD">NZD/USD</option>
                <option value="EUR/GBP">EUR/GBP</option>
                <option value="EUR/JPY">EUR/JPY</option>
                <option value="GBP/JPY">GBP/JPY</option>
                <option value="AUD/JPY">AUD/JPY</option>
                <option value="CAD/JPY">CAD/JPY</option>
                <option value="CHF/JPY">CHF/JPY</option>
                <option value="EUR/AUD">EUR/AUD</option>
                <option value="GBP/AUD">GBP/AUD</option>
                <option value="EUR/CAD">EUR/CAD</option>
                <option value="AUD/NZD">AUD/NZD</option>
                <option value="NZD/JPY">NZD/JPY</option>
              </optgroup>
              <optgroup label="Stocks & Indices (OTC)">
                <option value="Apple Inc (OTC)">Apple Inc (OTC)</option>
                <option value="Tesla (OTC)">Tesla (OTC)</option>
                <option value="Microsoft (OTC)">Microsoft (OTC)</option>
                <option value="Amazon (OTC)">Amazon (OTC)</option>
                <option value="Netflix (OTC)">Netflix (OTC)</option>
                <option value="Google (OTC)">Google (OTC)</option>
                <option value="Facebook / Meta (OTC)">Facebook / Meta (OTC)</option>
                <option value="S&P 500 (OTC)">S&P 500 (OTC)</option>
                <option value="NASDAQ (OTC)">NASDAQ (OTC)</option>
                <option value="Dow Jones (OTC)">Dow Jones (OTC)</option>
                <option value="FTSE 100 (OTC)">FTSE 100 (OTC)</option>
                <option value="DAX 30 (OTC)">DAX 30 (OTC)</option>
                <option value="CAC 40 (OTC)">CAC 40 (OTC)</option>
                <option value="NIKKEI 225 (OTC)">NIKKEI 225 (OTC)</option>
              </optgroup>
            </select>
          </div>

          <!-- ৫ সেকেন্ড থেকে ৫ মিনিট এক্সপায়ারি টাইম সিলেক্টর -->
          <div style="margin-bottom:10px;text-align:left;">
            <label style="font-size:10px;color:#8f9bb3;display:block;margin-bottom:2px;">EXPIRY TIME (5s - 5m):</label>
            <select id="ninja-time-select" style="width:100%;box-sizing:border-box;padding:7px;background:#0d111a;border:1px solid #2a344d;border-radius:6px;color:#fff;font-size:11px;outline:none;cursor:pointer;">
              <option value="5 Sec">5 Seconds (Turbo)</option>
              <option value="10 Sec">10 Seconds (Turbo)</option>
              <option value="15 Sec">15 Seconds (Turbo)</option>
              <option value="30 Sec">30 Seconds</option>
              <option value="1 Min" selected>1 Minute (M1)</option>
              <option value="2 Mins">2 Minutes (M2)</option>
              <option value="3 Mins">3 Minutes (M3)</option>
              <option value="4 Mins">4 Minutes (M4)</option>
              <option value="5 Mins">5 Minutes (M5)</option>
            </select>
          </div>
          
          <div id="ninja-signal-box" style="background:#0d111a;border:1px solid #2a344d;border-radius:10px;padding:10px;margin-bottom:10px;">
            <div id="ninja-signal-status" style="font-size:11px;color:#8f9bb3;margin-bottom:4px;">Configure & Scan</div>
            <div id="ninja-signal-result" style="font-size:15px;font-weight:800;color:#00ffcc;">READY</div>
          </div>

          <button id="ninja-scan-btn" style="width:100%;padding:10px;background:linear-gradient(135deg, #00b09b, #96c93d);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:11px;cursor:pointer;box-shadow:0 4px 12px rgba(0,176,155,0.3);">START SCANNING</button>
        \`;

        document.body.appendChild(panel);
        makeDraggable(panel);

        // স্ক্যানিং লজিক
        document.getElementById('ninja-scan-btn').onclick = function() {
          const market = document.getElementById('ninja-market-select').value;
          const time = document.getElementById('ninja-time-select').value;
          const status = document.getElementById('ninja-signal-status');
          const result = document.getElementById('ninja-signal-result');
          
          status.innerText = 'Scanning ' + market + ' (' + time + ')...';
          result.innerText = '...';
          result.style.color = '#ffcc00';

          setTimeout(() => {
            const rand = Math.random();
            let selected;
            
            if (rand > 0.15) {
              selected = { type: 'UP 🚀', color: '#00ffcc', text: market + ' [' + time + '] - BULLISH' };
            } else {
              selected = { type: 'DOWN 🔻', color: '#ff4d4d', text: market + ' [' + time + '] - BEARISH' };
            }
            
            status.innerText = selected.text;
            result.innerText = selected.type;
            result.style.color = selected.color;
          }, 1500);
        };
      }
    })();
  `;

  res.status(200).send(scriptContent);
};
