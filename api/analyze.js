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

  return res.status(200).json({
    success: true,
    project: "Ninja.X-1",
    action,
    received: data ?? null,
    message: "Request received successfully"
  });
};
