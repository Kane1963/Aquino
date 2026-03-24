const socket = io();

socket.on("status", (data) => {
  const stato = data.led ? "APERTO" : "CHIUSO";
  document.getElementById("status").innerText = `Stato cancello: ${stato}\nModalità: ${data.autoMode ? 'AUTO' : 'MANUALE'}`;
  document.getElementById("openTime").value = String(data.openHour).padStart(2,'0') + ':' + String(data.openMinute).padStart(2,'0');
  document.getElementById("closeTime").value = String(data.closeHour).padStart(2,'0') + ':' + String(data.closeMinute).padStart(2,'0');
});

function sendCmd(cmd){
  socket.emit("command", cmd);
}

function updateSchedule(){
  const [oh, om] = document.getElementById("openTime").value.split(":").map(Number);
  const [ch, cm] = document.getElementById("closeTime").value.split(":").map(Number);
  socket.emit("updateSchedule", {openHour: oh, openMinute: om, closeHour: ch, closeMinute: cm});
}
