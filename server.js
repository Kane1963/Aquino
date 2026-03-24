const express = require("express");
const mqtt = require("mqtt");

const app = express();

// PORTA RENDER
const PORT = process.env.PORT || 3000;

// MQTT pubblico
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

let gateState = false;

client.on("connect", () => {
  console.log("MQTT connesso");
  client.subscribe("aquino/gate/status");
});

client.on("message", (topic, message) => {
  if (topic === "aquino/gate/status") {
    gateState = message.toString() === "OPEN";
  }
});

// STATIC FILES
app.use(express.static("public"));

// API
app.get("/status", (req, res) => {
  res.json({
    led: gateState,
    mqtt: client.connected
  });
});

app.get("/toggle", (req, res) => {
  const state = req.query.state;

  if (state === "on") {
    client.publish("aquino/gate/control", "OPEN");
    gateState = true;
  } else {
    client.publish("aquino/gate/control", "CLOSE");
    gateState = false;
  }

  res.send("OK");
});

// AVVIO SERVER
app.listen(PORT, () => {
  console.log("Server attivo su porta " + PORT);
});