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
      
      // ড্রেগেবল (Drag and Drop) সুবিধা যোগ করার ফাংশন
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

      // ২. লাইসেন্স ভ্যালিডেশন
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

      // ৩. ড্রেগেবল সিগন্যাল প্যানেল
      function createSignalPanel() {
        const panel = document.createElement('div');
        panel.id = 'ninja-main-panel';
        panel.style.cssText = 'position:fixed;top:100px;left:50px;z-index:999999;width:220px;background:#121622;border:1px solid #1e2638;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.7);font-family:sans-serif;color:#fff;text-align:center;padding:15px;touch-action:none;';

        panel.innerHTML = \`
          <div class="ninja-drag-header" style="cursor:move;padding-bottom:5px;">
            <div style="width:45px;height:45px;background:linear-gradient(135deg, #00c9ff, #92fe9d);border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(0,201,255,0.4);">
              <span style="font-size:20px;">🥷</span>
            </div>
            <h4 style="margin:0;font-size:13px;color:#fff;letter-spacing:0.5px;">NINJA VIP SIGNAL</h4>
            <p style="margin:2px 0 10px;font-size:9px;color:#8f9bb3;text-transform:uppercase;">Market Scanner (Drag Me)</p>
          </div>
          
          <div id="ninja-signal-box" style="background:#0d111a;border:1px solid #2a344d;border-radius:10px;padding:12px;margin-bottom:10px;">
            <div id="ninja-signal-status" style="font-size:11px;color:#8f9bb3;margin-bottom:4px;">Click Scan Below</div>
            <div id="ninja-signal-result" style="font-size:16px;font-weight:800;color:#00ffcc;">READY</div>
          </div>

          <button id="ninja-scan-btn" style="width:100%;padding:10px;background:linear-gradient(135deg, #00b09b, #96c93d);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:11px;cursor:pointer;box-shadow:0 4px 12px rgba(0,176,155,0.3);">START SCANNING</button>
        \`;

        document.body.appendChild(panel);
        makeDraggable(panel);

        document.getElementById('ninja-scan-btn').onclick = function() {
          const status = document.getElementById('ninja-signal-status');
          const result = document.getElementById('ninja-signal-result');
          
          status.innerText = 'Scanning Market...';
          result.innerText = '...';
          result.style.color = '#ffcc00';

          setTimeout(() => {
            const signals = [
              { type: 'UP 🚀', color: '#00ffcc', text: 'BULLISH SIGNAL (95%)' },
              { type: 'DOWN 🔻', color: '#ff4d4d', text: 'BEARISH SIGNAL (95%)' }
            ];
            const selected = signals[Math.floor(Math.random() * signals.length)];
            
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
