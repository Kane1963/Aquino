{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let editingOpen = false;\
let editingClose = false;\
\
document.getElementById("openTime").addEventListener("focus", ()=> editingOpen=true);\
document.getElementById("openTime").addEventListener("blur", ()=> editingOpen=false);\
\
document.getElementById("closeTime").addEventListener("focus", ()=> editingClose=true);\
document.getElementById("closeTime").addEventListener("blur", ()=> editingClose=false);\
\
function updateStatus() \{\
  fetch("/status")\
    .then(r=>r.json())\
    .then(data=>\{\
      document.getElementById("status").innerHTML =\
        "Stato: <b>" + (data.led ? "APERTO" : "CHIUSO") + "</b>";\
\
      document.getElementById("mqttServer").innerText = "broker locale";\
      document.getElementById("mqttStatus").innerText =\
        data.mqtt ? "Connesso" : "Disconnesso";\
\
      if(!editingOpen)\{\
        document.getElementById("openTime").value =\
          String(data.openHour).padStart(2,'0') + ":" +\
          String(data.openMinute).padStart(2,'0');\
      \}\
\
      if(!editingClose)\{\
        document.getElementById("closeTime").value =\
          String(data.closeHour).padStart(2,'0') + ":" +\
          String(data.closeMinute).padStart(2,'0');\
      \}\
    \});\
\}\
\
function toggleLed(state)\{\
  fetch("/toggle?state=" + (state ? "on" : "off"))\
    .then(updateStatus);\
\}\
\
function setSchedule()\{\
  alert("Non ancora collegato lato server");\
\}\
\
setInterval(updateStatus, 1000);\
updateStatus();}