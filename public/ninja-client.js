(function () {
  "use strict";

  const API_BASE = "https://ninja-x-1.vercel.app/api";

  if (window.NINJA_X1_LOADED) {
    alert("Ninja.X-1 is already running!");
    return;
  }

  window.NINJA_X1_LOADED = true;

  const panel = document.createElement("div");

  panel.id = "ninja-x1-panel";
  panel.style.cssText = `
    position:fixed;
    top:100px;
    right:15px;
    width:260px;
    padding:15px;
    background:#101827;
    color:white;
    border:1px solid #00e5ff;
    border-radius:12px;
    z-index:2147483647;
    font-family:Arial,sans-serif;
    box-shadow:0 0 20px #00e5ff55;
  `;

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between">
      <b style="color:#00e5ff">NINJA.X-1</b>
      <button id="nx-close">✕</button>
    </div>

    <p id="nx-status">Backend checking...</p>

    <button id="nx-check" style="
      width:100%;padding:10px;
      background:#00bcd4;color:#001018;
      border:0;border-radius:7px;font-weight:bold">
      CHECK BACKEND
    </button>

    <pre id="nx-result" style="white-space:pre-wrap"></pre>
  `;

  document.body.appendChild(panel);

  panel.querySelector("#nx-close").onclick = () => {
    panel.remove();
    window.NINJA_X1_LOADED = false;
  };

  panel.querySelector("#nx-check").onclick = async () => {
    const status = panel.querySelector("#nx-status");
    const result = panel.querySelector("#nx-result");

    status.textContent = "Checking...";
    result.textContent = "";

    try {
      const response = await fetch(API_BASE + "/status");
      const data = await response.json();

      status.textContent = data.backend === "online"
        ? "Backend Online"
        : "Backend unavailable";

      result.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
      status.textContent = "Connection failed";
      result.textContent = error.message;
    }
  };

})();
