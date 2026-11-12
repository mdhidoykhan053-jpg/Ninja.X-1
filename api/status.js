module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  return res.status(200).json({
    success: true,
    project: "Ninja.X-1",
    backend: "online",
    version: "1.0.0",
    message: "Ninja.X-1 Backend is running"
  });
};
