const express = require("express");
const mqtt = require("mqtt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve la cartella public
app.use(express.static(path.join(__dirname, "public")));

// MQTT TLS
const MQTT_SERVER = "mqtts://broker.hivemq.com:8883";
const MQTT_TOPIC_CMD = "aquino/gate/control";
const MQTT_TOPIC_STATUS = "aquino/gate/status";

const client = mqtt.connect(MQTT_SERVER);

let gateState = false;

client.on("connect", () => {
  console.log("MQTT connesso su TLS 8883");
  client.subscribe(MQTT_TOPIC_STATUS);
});

client.on("message", (topic, message) => {
  if (topic === MQTT_TOPIC_STATUS) {
    gateState = message.toString() === "OPEN";
  }
});

// API stato
app.get("/status", (req, res) => {
  res.json({ led: gateState, mqtt: client.connected });
});

// API toggle cancello
app.get("/toggle", (req, res) => {
  const state = req.query.state;
  if (state === "on") {
    client.publish(MQTT_TOPIC_CMD, "OPEN");
    gateState = true;
  } else if (state === "off") {
    client.publish(MQTT_TOPIC_CMD, "CLOSE");
    gateState = false;
  }
  res.send("OK");
});

// Tutte le altre richieste → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`Server attivo su porta ${PORT}`));ttivo su porta ${PORT}`));
