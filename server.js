const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mqtt = require("mqtt");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MQTT
const MQTT_BROKER = "mqtts://broker.hivemq.com:8883";
const MQTT_TOPIC_CMD = "cancello/aquino/cmd";
const MQTT_TOPIC_STATUS = "cancello/aquino/status";

const client = mqtt.connect(MQTT_BROKER, { username: "", password: "" });

let cancelloState = {
  led: false,
  autoMode: true,
  openHour: -1,
  openMinute: -1,
  closeHour: -1,
  closeMinute: -1
};

client.on("connect", () => {
  console.log("Connesso al broker MQTT");
  client.subscribe(MQTT_TOPIC_STATUS);
});

client.on("message", (topic, message) => {
  if(topic === MQTT_TOPIC_STATUS){
    try {
      const data = JSON.parse(message.toString());
      cancelloState = {...cancelloState, ...data};
      io.emit("statusUpdate", cancelloState);
    } catch(e){ console.error("Errore parsing MQTT:", e); }
  }
});

// Web static
app.use(express.static("public"));
app.use(express.json());

// Socket.io per invio comandi
io.on("connection", (socket) => {
  socket.emit("statusUpdate", cancelloState);

  socket.on("command", cmd => {
    console.log("Invio comando MQTT:", cmd);
    client.publish(MQTT_TOPIC_CMD, cmd);
  });
});

// Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
