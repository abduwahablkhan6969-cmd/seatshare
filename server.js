// SeatShare backend starter. Provider adapters are intentionally disabled until
// you receive approved API credentials and documentation from a travel provider.
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://abduwahabkhan6969-cmd.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "SeatShare API", inventoryMode: "provider-required" });
});

app.post("/api/inventory/search", async (req, res) => {
  const { type, from, to, date } = req.body || {};
  if (!["flight", "bus"].includes(type) ||
      typeof from !== "string" || typeof to !== "string" ||
      typeof date !== "string" || !from.trim() || !to.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ code: "INVALID_SEARCH", message: "Enter a transport type, origin, destination and valid travel date." });
  }

  const providerReady = type === "flight"
    ? Boolean(process.env.FLIGHT_PROVIDER_API_URL && process.env.FLIGHT_PROVIDER_API_KEY)
    : Boolean(process.env.BUS_PROVIDER_API_URL && process.env.BUS_PROVIDER_API_KEY);

  if (!providerReady) {
    return res.status(503).json({
      code: "PROVIDER_NOT_CONFIGURED",
      message: `${type === "flight" ? "Flight" : "Bus"} live inventory is not connected yet. SeatShare needs an approved provider API URL, API key and integration documentation. No sample results are being presented as live availability.`
    });
  }

  // IMPORTANT: Do not guess a provider's API format. Implement the matching
  // adapter only after its official documentation and credentials are supplied.
  return res.status(501).json({
    code: "ADAPTER_PENDING",
    message: "Provider credentials are present, but the provider-specific adapter has not been implemented. Follow the provider's official API documentation before enabling live results."
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`SeatShare running at http://localhost:${port}`));
