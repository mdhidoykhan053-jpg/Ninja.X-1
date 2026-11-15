(function () {
  "use strict";

  if (window.__NINJA_CANDLE_BUILDER__) return;
  window.__NINJA_CANDLE_BUILDER__ = true;

  const TIMEFRAME = 60;
  const STORAGE_LIMIT = 200;

  let currentCandle = null;
  let candles = [];
  let currentMarket = null;

  function emit(candle) {
    window.dispatchEvent(
      new CustomEvent("NINJA_MARKET_DATA", {
        detail: {
          source: "NINJA_X1",
          type: "CANDLE",
          market: currentMarket,
          timeframe: "1m",
          candle: { ...candle }
        }
      })
    );
  }

  function addPrice(market, price, timestamp) {
    price = Number(price);
    timestamp = Number(timestamp);

    if (
      !market ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(timestamp) ||
      timestamp <= 0
    ) return;

    currentMarket = market;

    // Unix seconds বা milliseconds সমর্থন
    if (timestamp < 1e12) {
      timestamp *= 1000;
    }

    const bucket =
      Math.floor(timestamp / 60000) * 60000;

    if (!currentCandle) {
      currentCandle = {
        open: price,
        high: price,
        low: price,
        close: price,
        timestamp: bucket
      };
      return;
    }

    if (bucket < currentCandle.timestamp) {
      return;
    }

    if (bucket === currentCandle.timestamp) {
      currentCandle.high = Math.max(
        currentCandle.high, price
      );

      currentCandle.low = Math.min(
        currentCandle.low, price
      );

      currentCandle.close = price;

      return;
    }

    candles.push({ ...currentCandle });
    candles = candles.slice(-STORAGE_LIMIT);

    emit(currentCandle);

    let next = currentCandle.timestamp + 60000;

    while (next < bucket) {
      const previous = currentCandle.close;

      currentCandle = {
        open: previous,
        high: previous,
        low: previous,
        close: previous,
        timestamp: next
      };

      candles.push({ ...currentCandle });
      candles = candles.slice(-STORAGE_LIMIT);

      emit(currentCandle);
      next += 60000;
    }

    currentCandle = {
      open: price,
      high: price,
      low: price,
      close: price,
      timestamp: bucket
    };
  }

  window.NINJA_CANDLE = {
    addPrice,

    getCandles: () => [
      ...candles,
      ...(currentCandle ? [{ ...currentCandle }] : [])
    ],

    getCurrent: () => currentCandle
      ? { ...currentCandle }
      : null
  };

  console.log(
    "[NINJA.X-1] Live Candle Builder Ready"
  );

})();
