export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "POST method required"
    });
  }

  try {
    const { candles, market, timeframe = "1m" } = req.body || {};

    if (!Array.isArray(candles) || candles.length < 30) {
      return res.status(400).json({
        success: false,
        message: "At least 30 candles required"
      });
    }

    const data = candles
      .map(c => ({
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close)
      }))
      .filter(c => Object.values(c).every(Number.isFinite));

    if (data.length < 30) {
      return res.status(400).json({
        success: false,
        message: "Invalid candle data"
      });
    }

    const closes = data.map(c => c.close);

    function ema(values, period) {
      const k = 2 / (period + 1);
      let result = values[0];

      for (let i = 1; i < values.length; i++) {
        result = values[i] * k + result * (1 - k);
      }

      return result;
    }

    function rsi(values, period = 14) {
      let gain = 0, loss = 0;

      for (let i = values.length - period; i < values.length; i++) {
        const change = values[i] - values[i - 1];
        if (change > 0) gain += change;
        else loss -= change;
      }

      if (loss === 0) return 100;

      const rs = gain / loss;
      return 100 - 100 / (1 + rs);
    }

    const last = closes[closes.length - 1];

    const ema9 = ema(closes, 9);
    const ema21 = ema(closes, 21);

    const fast = ema(closes, 12);
    const slow = ema(closes, 26);
    const macd = fast - slow;

    const rsiValue = rsi(closes);

    const macdPrevious =
      ema(closes.slice(0, -1), 12) -
      ema(closes.slice(0, -1), 26);

    const signalLine = macdPrevious * 0.2 + macd * 0.8;

    let bullish = 0;
    let bearish = 0;

    if (ema9 > ema21) bullish++;
    else if (ema9 < ema21) bearish++;

    if (macd > signalLine) bullish++;
    else if (macd < signalLine) bearish++;

    if (rsiValue > 50 && rsiValue < 70) bullish++;
    else if (rsiValue < 50 && rsiValue > 30) bearish++;

    if (last > ema9) bullish++;
    else if (last < ema9) bearish++;

    let signal = "NEUTRAL";
    let confidence = 0;

    if (bullish >= 3) {
      signal = "BUY";
      confidence = Math.round((bullish / 4) * 100);
    } else if (bearish >= 3) {
      signal = "SELL";
      confidence = Math.round((bearish / 4) * 100);
    }

    const trend =
      ema9 > ema21 ? "BULLISH" :
      ema9 < ema21 ? "BEARISH" : "SIDEWAYS";

    return res.status(200).json({
      success: true,
      project: "Ninja.X-1",
      mode: "MANUAL_SIGNAL",
      market: market || "UNKNOWN",
      timeframe,
      signal,
      confidence,
      trend,
      indicators: {
        RSI: Number(rsiValue.toFixed(2)),
        EMA9: ema9,
        EMA21: ema21,
        MACD: macd,
        MACDSignal: signalLine
      },
      lastPrice: last,
      candleCount: data.length,
      timestamp: new Date().toISOString(),
      autoTrade: false
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Analysis failed"
    });
  }
}
