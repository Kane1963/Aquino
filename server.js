const express = require("express");
const mqtt = require("mqtt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve la cartella public
app.use(express.static(path.join(__dirname, "public")));

// MQTT (semplice esempio)
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
let gateState = false;

client.on("connect", () => {
  console.log("MQTT connesso");
});

app.get("/status", (req, res) => {
  res.json({ led: gateState, mqtt: client.connected });
});

app.get("/toggle", (req, res) => {
  const state = req.query.state;
  gateState = state === "on";
  res.send("OK");
});

// Tutte le altre richieste → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`Server attivo su porta ${PORT}`));
