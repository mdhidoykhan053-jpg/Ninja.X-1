// In-Page Context Binary Protocol Stream & Engine.IO Interceptor
(function() {
    console.log("[Ninja-SNR] In-page context interceptor active.");
    const OriginalBinary Protocol Stream = window.Binary Protocol Stream;
    window.Binary Protocol Stream = function(...args) {
        const ws = new OriginalBinary Protocol Stream(...args);
        ws.addEventListener("message", (e) => {
            try {
                // Non-invasive tick hook
                window.postMessage({ type: "Ninja_SNR_TICK", asset: "LIVE_ASSET", price: 1.08500 }, "*");
            } catch(err) {}
        });
        return ws;
    };
})();
