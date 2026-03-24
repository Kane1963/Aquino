const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MQTT_BROKER = "mqtts://broker.hivemq.com:8883";
const MQTT_TOPIC_CMD = "cancello/aquino/cmd";
const MQTT_TOPIC_STATUS = "cancello/aquino/status";

const client = mqtt.connect(MQTT_BROKER);

let lastStatus = {};

client.on("connect", () => {
  console.log("MQTT connesso!");
  client.subscribe(MQTT_TOPIC_STATUS);
});

client.on("message", (topic, message) => {
  if (topic === MQTT_TOPIC_STATUS) {
    try {
      lastStatus = JSON.parse(message.toString());
      io.emit("status", lastStatus);
    } catch (e) { console.error("Errore parsing MQTT", e); }
  }
});

// Serve static files
app.use(express.static("public"));

// Socket.io per comandi dal frontend
io.on("connection", (socket) => {
  console.log("Nuovo client connesso");
  socket.emit("status", lastStatus);

  socket.on("command", (cmd) => {
    if (cmd === "apri" || cmd === "chiudi" || cmd === "auto" || cmd === "manual") {
      client.publish(MQTT_TOPIC_CMD, cmd);
      console.log("Comando inviato:", cmd);
    }
  });

  socket.on("updateSchedule", ({openHour, openMinute, closeHour, closeMinute}) => {
    const msg = JSON.stringify({openHour, openMinute, closeHour, closeMinute});
    client.publish(MQTT_TOPIC_CMD, msg);
    console.log("Orari aggiornati:", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server in ascolto su ${PORT}`));
