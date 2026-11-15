(function () {
  "use strict";

  if (window.__NINJA_BOT_CONTROLLER__) return;
  window.__NINJA_BOT_CONTROLLER__ = true;

  const API = "https://ninja-x-1.vercel.app";
  const MIN_CANDLES = 35;

  let candles = [];
  let market = null;
  let timeframe = "1m";
  let scanning = false;
  let busy = false;

  function status(message) {
    console.log("[NINJA.X-1]", message);

    window.dispatchEvent(new CustomEvent(
      "NINJA_BOT_STATUS",
      { detail: { message } }
    ));
  }

  async function request(path, body) {
    const response = await fetch(API + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "API error");
    }

    return result;
  }

  function validCandle(c) {
    return c &&
      [c.open, c.high, c.low, c.close]
        .every(v => Number.isFinite(Number(v)));
  }

  async function analyze() {
    if (busy || !scanning) return;
    if (candles.length < MIN_CANDLES) {
      status("Waiting for 35 real candles");
      return;
    }

    busy = true;

    try {
      const data = {
        market,
        timeframe,
        candles: candles.slice(-200)
      };

      await request("/api/market-data", {
        action: "ingest",
        data: {
          ...data,
          source: "quotex-websocket"
        }
      });

      const result = await request("/api/analyze", {
        action: "analyze",
        data
      });

      status(
        result.market + " | " +
        result.signal + " | " +
        result.trend
      );

      window.dispatchEvent(new CustomEvent(
        "NINJA_BOT_SIGNAL",
        { detail: result }
      ));

    } catch (error) {
      status("Analysis error: " + error.message);
    } finally {
      busy = false;
    }
  }

  function onMarketData(event) {
    if (!scanning) return;

    const packet = event.detail || {};

    if (packet.source !== "NINJA_X1") return;
    if (packet.type !== "CANDLE") return;

    if (!packet.market || !validCandle(packet.candle)) {
      return;
    }

    market = packet.market;
    timeframe = packet.timeframe || "1m";

    const candle = packet.candle;

    const previous = candles[candles.length - 1];

    if (
      previous &&
      candle.timestamp != null &&
      previous.timestamp === candle.timestamp
    ) {
      candles[candles.length - 1] = candle;
    } else {
      candles.push(candle);
    }

    candles = candles.slice(-200);

    if (candles.length >= MIN_CANDLES) {
      analyze();
    }
  }

  function start() {
    scanning = true;
    status("Scanner started. Waiting for real candle data.");
  }

  function stop() {
    scanning = false;
    status("Scanner stopped");
  }

  window.addEventListener(
    "NINJA_MARKET_DATA",
    onMarketData
  );

  window.NINJA_BOT = {
    start,
    stop,
    analyze,
    getStatus: () => ({
      scanning,
      market,
      timeframe,
      candles: candles.length
    })
  };

  status("Bot Controller Ready");

})();
