const socket = io();

// Aggiorna la UI con lo stato ricevuto dal server
socket.on("status", (data) => {
    document.getElementById("status").innerHTML = "Stato: <b>" + (data.led ? "APERTO" : "CHIUSO") + "</b>";
    document.getElementById("modeSelect")?.value = data.autoMode ? "auto" : "manual";
    document.getElementById("openTime").value = String(data.openHour).padStart(2,'0') + ':' + String(data.openMinute).padStart(2,'0');
    document.getElementById("closeTime").value = String(data.closeHour).padStart(2,'0') + ':' + String(data.closeMinute).padStart(2,'0');

    document.getElementById("fwVersion").innerText = data.firmware || "--";
    document.getElementById("mqttServer").innerText = data.mqttServer || "--";
    document.getElementById("mqttPort").innerText = data.mqttPort || "--";
    document.getElementById("mqttStatus").innerText = data.mqttStatus ? "Connesso" : "Disconnesso";
});

// Invia comandi al server (che poi pubblica su MQTT)
function sendCmd(cmd){
    socket.emit("command", cmd);
}

// Aggiorna gli orari e invia al server
function updateSchedule(){
    const [oh, om] = document.getElementById("openTime").value.split(":").map(Number);
    const [ch, cm] = document.getElementById("closeTime").value.split(":").map(Number);
    socket.emit("updateSchedule", {openHour: oh, openMinute: om, closeHour: ch, closeMinute: cm});
    alert("Orari inviati al cancello!");
}
