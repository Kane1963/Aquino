function update() {
  fetch("/status")
    .then(r => r.json())
    .then(data => {
      document.getElementById("status").innerText = "Stato: " + (data.led ? "APERTO" : "CHIUSO");
      document.getElementById("mqtt").innerText = "MQTT: " + (data.mqtt ? "Connesso" : "Offline");
    });
}

function toggle(state) {
  fetch("/toggle?state=" + (state ? "on" : "off"))
    .then(update);
}

setInterval(update, 1000);
update();
