const statusEl = document.getElementById("status");
const modeSelect = document.getElementById("modeSelect");
const openTime = document.getElementById("openTime");
const closeTime = document.getElementById("closeTime");
const saveBtn = document.getElementById("saveSchedule");
const toggleOpen = document.getElementById("toggleOpen");
const toggleClose = document.getElementById("toggleClose");

let client;

// Connessione MQTT
function connectMQTT(){
  client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
  client.on('connect', () => {
    console.log("MQTT Connesso");
    document.getElementById("mqttStatus").innerText = "Connesso";
    client.subscribe('cancello/aquino/status');
  });

  client.on('message', (topic,message) => {
    const msg = message.toString();
    const data = JSON.parse(msg);
    statusEl.innerHTML = "Stato: <b>"+(data.led?"APERTO":"CHIUSO")+"</b>";
    modeSelect.value = data.autoMode?"auto":"manual";
    openTime.value = String(data.openHour).padStart(2,'0')+":"+String(data.openMinute).padStart(2,'0');
    closeTime.value = String(data.closeHour).padStart(2,'0')+":"+String(data.closeMinute).padStart(2,'0');
  });
}

// Pulsanti manuale
toggleOpen.onclick = ()=>{ client.publish('cancello/aquino/cmd','apri'); }
toggleClose.onclick = ()=>{ client.publish('cancello/aquino/cmd','chiudi'); }

// Modalità
modeSelect.onchange = ()=>{ client.publish('cancello/aquino/cmd','auto:'+(modeSelect.value=="auto"?"on":"off")); }

// Salva orari
saveBtn.onclick = ()=>{
  const openVal = openTime.value;
  const closeVal = closeTime.value;
  client.publish('cancello/aquino/cmd','CF:'+openVal+"-"+closeVal);
  alert("Orari inviati");
}

connectMQTT();
