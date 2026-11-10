//Ninja.X-1 Traders BD - Round Number SNR Tracker Content Script (Manifest V3)
console.log("[CB-SNR-Tracker] Injecting Decrypted Raw Binary Protocol Pipeline Observer...");

const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data || event.data.type !== "Ninja_SNR_TICK") return;
    const { price, asset } = event.data;
    // Inspect round number proximity
    const decimals = (price.toString().split(".")[1] || "").padEnd(5, "0");
    const lastTwo = parseInt(decimals.slice(-2), 10);
    if (lastTwo === 0 || lastTwo === 50) {
        console.log(`%c[Ninja-SNR-ALERT] Major Round Level Hit on ${asset}: ${price}`, "color: #00ffcc; font-weight: bold;");
    }
});
