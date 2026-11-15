module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "POST method required"
    });
  }

  const { action, data } = req.body || {};

  if (action !== "ingest") {
    return res.status(400).json({
      success: false,
      message: "Action must be ingest"
    });
  }

  if (!data || typeof data !== "object") {
    return res.status(400).json({
      success: false,
      message: "Market data is required"
    });
  }

  const { market, timeframe, candles, source } = data;

  if (!market || !timeframe) {
    return res.status(400).json({
      success: false,
      message: "Market and timeframe are required"
    });
  }

  if (!Array.isArray(candles) ||
      candles.length < 1 ||
      candles.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Provide 1 to 500 candles"
    });
  }

  const normalized = [];

  for (const candle of candles) {
    const open = Number(candle.open);
    const close = Number(candle.close);
    const high = Number(candle.high);
    const low = Number(candle.low);

    if (![open, close, high, low].every(
      v => Number.isFinite(v) && v > 0
    )) {
      return res.status(400).json({
        success: false,
        message: "Invalid OHLC candle values"
      });
    }

    if (
      high < Math.max(open, close) ||
      low > Math.min(open, close) ||
      high < low
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid candle high/low range"
      });
    }

    normalized.push({
      open,
      high,
      low,
      close,
      timestamp: candle.timestamp ?? null
    });
  }

  return res.status(200).json({
    success: true,
    project: "Ninja.X-1",
    endpoint: "/api/market-data",
    action: "ingest",
    market,
    timeframe,
    source: source || "unknown",
    candlesReceived: normalized.length,
    candles: normalized,
    message: "Market data received and validated"
  });
};
