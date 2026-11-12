module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const engine = `
(function () {
  "use strict";

  if (window.NINJA_X1_LOADED) return;

  window.NINJA_X1_LOADED = true;

  window.NINJA_X1 = {
    version: "1.0.0",
    status: "ready",
    licenseRequired: false,

    start: function () {
      console.log("[NINJA.X-1] Terminal Started");

      window.dispatchEvent(
        new CustomEvent("NINJA_X1_READY", {
          detail: {
            success: true,
            status: "ready"
          }
        })
      );
    }
  };

  window.NINJA_X1.start();

})();
`;

  return res.status(200).send(engine);
};
