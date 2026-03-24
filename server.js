const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const MQTT_SERVER = "mqtts://broker.hivemq.com:8883"; // TLS
const MQTT_TOPIC_CMD = "aquino/gate/control";
const MQTT_TOPIC_STATUS = "aquino/gate/status";

let gateStatus = "CHIUSO";
let mode = "auto";
let openTime = "08:00";
let closeTime = "20:30";
let lastAction = "manuale";

// ---------------------- MQTT ----------------------
const client = mqtt.connect(MQTT_SERVER, {rejectUnauthorized: false});

client.on("connect", () => {
  console.log("MQTT connesso");
  client.subscribe(MQTT_TOPIC_CMD);
});

client.on("message", (topic, message) => {
  const msg = message.toString();
  if(topic === MQTT_TOPIC_CMD){
    if(msg === "OPEN") gateStatus = "APERTO";
    if(msg === "CLOSE") gateStatus = "CHIUSO";
    lastAction = "manuale";
  }
});

// ---------------------- API ----------------------
app.get("/status", (req,res) => {
  res.json({
    led: gateStatus==="APERTO",
    autoMode: mode==="auto",
    openHour: openTime.split(":")[0],
    openMinute: openTime.split(":")[1],
    closeHour: closeTime.split(":")[0],
    closeMinute: closeTime.split(":")[1],
    lastAction,
    mqttStatus: client.connected() ? "Connesso" : "Disconnesso"
  });
});

app.post("/toggle", (req,res)=>{
  const state = req.body.state;
  if(state==="on"){ client.publish(MQTT_TOPIC_CMD,"OPEN"); gateStatus="APERTO"; lastAction="manuale"; }
  if(state==="off"){ client.publish(MQTT_TOPIC_CMD,"CLOSE"); gateStatus="CHIUSO"; lastAction="manuale"; }
  res.sendStatus(200);
});

app.post("/schedule", (req,res)=>{
  openTime = req.body.open;
  closeTime = req.body.close;
  lastAction="automatica";
  res.sendStatus(200);
});

app.post("/mode", (req,res)=>{
  mode = req.body.set;
  lastAction="automatica";
  res.sendStatus(200);
});

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server avviato su http://localhost:${PORT}`));
