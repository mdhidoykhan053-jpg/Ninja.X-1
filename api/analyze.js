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

  if (!action) {
    return res.status(400).json({
      success: false,
      message: "Action is required"
    });
  }

  if (action !== "analyze") {
    return res.status(400).json({
      success: false,
      message: "Unsupported action"
    });
  }

  const candles = data?.candles;

  if (!Array.isArray(candles) || candles.length < 35) {
    return res.status(400).json({
      success: false,
      message: "At least 35 candles are required"
    });
  }

  const closes = candles.map(c => Number(c.close));

  if (closes.some(v => !Number.isFinite(v) || v <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Invalid candle close prices"
    });
  }

  function ema(values, period) {
    const k = 2 / (period + 1);
    let result = values.slice(0, period)
      .reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < values.length; i++) {
      result = values[i] * k + result * (1 - k);
    }

    return result;
  }

  function rsi(values, period = 14) {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = values[i] - values[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < values.length; i++) {
      const change = values[i] - values[i - 1];

      avgGain = (avgGain * (period - 1) +
        Math.max(change, 0)) / period;

      avgLoss = (avgLoss * (period - 1) +
        Math.max(-change, 0)) / period;
    }

    if (avgLoss === 0) return 100;

    return 100 - (100 / (1 + avgGain / avgLoss));
  }

  function calculateMACD(values) {
    const fast = 12;
    const slow = 26;
    const signalPeriod = 9;

    const series = [];

    for (let i = slow - 1; i < values.length; i++) {
      const subset = values.slice(0, i + 1);
      series.push(ema(subset, fast) - ema(subset, slow));
    }

    const macdLine = series[series.length - 1];
    const signalLine = ema(series, signalPeriod);

    return {
      macd: macdLine,
      signal: signalLine,
      histogram: macdLine - signalLine
    };
  }

  const ema9 = ema(closes, 9);
  const ema21 = ema(closes, 21);
  const rsi14 = rsi(closes);
  const macd = calculateMACD(closes);

  const recent = candles.slice(-20);

  const support = Math.min(
    ...recent.map(c => Number(c.low))
  );

  const resistance = Math.max(
    ...recent.map(c => Number(c.high))
  );

  if (!Number.isFinite(support) ||
      !Number.isFinite(resistance) ||
      recent.some(c =>
        !Number.isFinite(Number(c.low)) ||
        !Number.isFinite(Number(c.high))
      )) {
    return res.status(400).json({
      success: false,
      message: "Invalid candle high/low values"
    });
  }

  let score = 0;

  if (ema9 > ema21) score += 2;
  else if (ema9 < ema21) score -= 2;

  if (rsi14 > 55) score += 1;
  else if (rsi14 < 45) score -= 1;

  if (macd.histogram > 0) score += 2;
  else if (macd.histogram < 0) score -= 2;

  let signal = "NEUTRAL";

  if (score >= 3) signal = "BUY";
  if (score <= -3) signal = "SELL";

  const confidence = Math.round(
    Math.abs(score) / 5 * 100
  );

  const trend =
    ema9 > ema21 ? "BULLISH" :
    ema9 < ema21 ? "BEARISH" : "SIDEWAYS";

  return res.status(200).json({
    success: true,
    project: "Ninja.X-1",
    engine: "Technical Analysis Engine V1",
    market: data?.market || "Unknown",
    timeframe: data?.timeframe || "Unknown",
    signal,
    confidence,
    trend,
    indicators: {
      RSI: Number(rsi14.toFixed(2)),
      EMA9: Number(ema9.toFixed(6)),
      EMA21: Number(ema21.toFixed(6)),
      MACD: Number(macd.macd.toFixed(6)),
      MACDSignal: Number(macd.signal.toFixed(6)),
      MACDHistogram: Number(macd.histogram.toFixed(6))
    },
    support,
    resistance,
    candlesAnalyzed: candles.length,
    message: "Technical analysis completed"
  });
};
