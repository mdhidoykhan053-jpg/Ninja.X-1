module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");

  const scriptContent = `
    (function() {
      if (document.getElementById('ninja-traders-root')) return;
      const r = document.createElement('div');
      r.id = 'ninja-traders-root';
      r.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;background:#1e222d;color:#fff;padding:15px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
      r.innerHTML = '<h3>Ninja Terminal Active</h3><p>Panel is working successfully!</p>';
      document.body.appendChild(r);
      window.__Ninja_X_1_ROUND_ACTIVATED__ = true;
    })();
  `;
  
  res.status(200).send(scriptContent);
};
