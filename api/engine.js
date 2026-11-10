module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");

  const scriptContent = `
    (function() {
      // যদি প্যানেল ইতিমধ্যেই থাকে তবে টগল করবে
      if (window.__Ninja_X_1_ROUND_ACTIVATED__) {
        const r = document.getElementById('ninja-traders-root');
        if (r) r.style.display = (r.style.display === 'none' ? 'block' : 'none');
        return;
      }
      
      window.__Ninja_X_1_ROUND_ACTIVATED__ = true;

      // মেইন কন্টেইনার তৈরি
      const r = document.createElement('div');
      r.id = 'ninja-traders-root';
      r.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:999999;width:340px;background:#121622;border:1px solid #1e2638;border-radius:14px;box-shadow:0 15px 35px rgba(0,0,0,0.6);font-family:sans-serif;color:#fff;overflow:hidden;';

      r.innerHTML = \`
        <div style="background:#181d2d;padding:18px;text-align:center;border-bottom:1px solid #1e2638;position:relative;">
          <div style="width:50px;height:50px;background:#1e2638;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(0,168,255,0.3);">
            <span style="font-size:22px;">🥷</span>
          </div>
          <h3 style="margin:0;font-size:16px;font-weight:700;letter-spacing:0.5px;color:#fff;">NINJA TRADERS BD</h3>
          <p style="margin:4px 0 0;font-size:10px;color:#8f9bb3;letter-spacing:1px;text-transform:uppercase;">Security Activation</p>
          <div id="ninja-close-btn" style="position:absolute;top:12px;right:15px;cursor:pointer;color:#8f9bb3;font-size:18px;">&times;</div>
        </div>
        
        <div style="padding:20px;text-align:center;">
          <h4 style="margin:0 0 8px;font-size:15px;color:#fff;">LICENSE ACTIVATION</h4>
          <p style="margin:0 0 16px;font-size:11px;color:#8f9bb3;line-height:1.4;">Enter your authorized license key to unlock the tracker on this browser.</p>
          
          <input type="text" id="ninja-license-input" placeholder="NINJA-VIP-2026-OK" style="width:100%;box-sizing:border-box;padding:12px;background:#0d111a;border:1px solid #2a344d;border-radius:8px;color:#fff;font-size:12px;text-align:center;margin-bottom:8px;outline:none;" />
          
          <div id="ninja-error-msg" style="color:#ff4d4d;font-size:11px;margin-bottom:12px;min-height:15px;"></div>
          
          <button id="ninja-activate-btn" style="width:100%;padding:12px;background:linear-gradient(135deg, #0070f3, #00c6ff);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 4px 12px rgba(0,112,243,0.3);margin-bottom:10px;">ACTIVATE TERMINAL</button>
          
          <a href="https://t.me/" target="_blank" style="display:block;padding:10px;background:transparent;border:1px solid #2a344d;border-radius:8px;color:#8f9bb3;text-decoration:none;font-size:11px;font-weight:600;">✈ CONTACT FOR KEY</a>
        </div>
        
        <div style="background:#0d111a;padding:10px;text-align:center;border-top:1px solid #1e2638;font-size:9px;color:#596579;letter-spacing:0.5px;">
          NINJA X-1 ROUND NUMBER TRACKER
        </div>
      \`;

      document.body.appendChild(r);

      // ক্লোজ বাটন ইভেন্ট
      document.getElementById('ninja-close-btn').onclick = function() {
        r.style.display = 'none';
      };

      // অ্যাক্টিভেট বাটন ক্লিক লজিক (নির্ধারিত কি চেক করবে)
      document.getElementById('ninja-activate-btn').onclick = function() {
        const key = document.getElementById('ninja-license-input').value.trim();
        const err = document.getElementById('ninja-error-msg');
        
        if(!key) {
          err.innerText = 'Please enter a valid license key.';
          return;
        }

        // এখানে আপনার নির্দিষ্ট কি টি চেক করা হচ্ছে
        if(key === 'NINJA-VIP-2026-OK') {
          err.style.color = '#00ffcc';
          err.innerText = 'License Activated Successfully!';
          setTimeout(() => {
            // অ্যাক্টিভ হওয়ার পর প্যানেল হাইড করে মূল টার্মিনাল সচল করার সিগন্যাল
            document.getElementById('ninja-traders-root').style.display = 'none';
            alert('Ninja.X-1 Terminal Unlocked & Ready!');
          }, 1000);
        } else {
          err.style.color = '#ff4d4d';
          err.innerText = 'Invalid license key! Please check again.';
        }
      };
    })();
  `;

  res.status(200).send(scriptContent);
};
