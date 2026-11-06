require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
const PAYBETA_BASE = "https://api.paybeta.com";
const API_KEY = process.env.PAYBETA_API_KEY;
const SECRET_KEY = process.env.PAYBETA_SECRET_KEY;
app.get("/", (req, res) => {
  res.json({ message: "Rolly Backend dey alive!" });
});
app.get("/api/providers", async (req, res) => {
  try {
    const r = await fetch(`${PAYBETA_BASE}/v2/airtime/providers`, {
      headers: { "P-API-KEY": API_KEY, "Accept": "application/json" }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Paybeta no respond", details: e.message });
  }
});
app.post("/api/buy-airtime", async (req, res) => {
  const { network, phone, amount } = req.body;
  if (!network || !phone || !amount) {
    return res.status(400).json({ error: "Fill network, phone and amount" });
  }
  try {
    const r = await fetch(`${PAYBETA_BASE}/v2/airtime/purchase`, {
      method: "POST",
      headers: {
        "P-API-KEY": API_KEY,
        "P-SECRET-KEY": SECRET_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        network: network,
        phone: phone,
        amount: Number(amount),
        reference: "ROLLY-" + Date.now()
      })
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Paybeta error", details: e.message });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Rolly backend running on port " + PORT));
