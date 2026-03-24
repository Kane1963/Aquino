let editingOpen=false;
let editingClose=false;

document.getElementById("openTime").addEventListener("focus",()=>{editingOpen=true});
document.getElementById("openTime").addEventListener("blur",()=>{editingOpen=false});
document.getElementById("closeTime").addEventListener("focus",()=>{editingClose=true});
document.getElementById("closeTime").addEventListener("blur",()=>{editingClose=false});

function updateStatus(){
  fetch("/status").then(r=>r.json()).then(data=>{
    document.getElementById("status").innerHTML="Stato: <b>"+(data.led?"APERTO":"CHIUSO")+"</b>";
    document.getElementById("modeSelect").value = data.autoMode?"auto":"manual";
    if(!editingOpen){document.getElementById("openTime").value = String(data.openHour).padStart(2,'0')+':'+String(data.openMinute).padStart(2,'0');}
    if(!editingClose){document.getElementById("closeTime").value = String(data.closeHour).padStart(2,'0')+':'+String(data.closeMinute).padStart(2,'0');}
  });
}

function toggle(state){
  fetch("/toggle",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({state: state ? "on" : "off"})
  }).then(updateStatus);
}

function setSchedule(){
  const open=document.getElementById("openTime").value;
  const close=document.getElementById("closeTime").value;
  fetch("/schedule",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({open,close})
  }).then(()=>alert("Orari aggiornati"));
}

function setMode(){
  const mode=document.getElementById("modeSelect").value;
  fetch("/mode",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({set:mode})
  }).then(()=>alert("Modalità aggiornata"));
}

setInterval(updateStatus,1000);
updateStatus();
