# Cancello Aquino - ESP32 + Web MQTT

Cruscotto web per controllare cancello ESP32-S3 via MQTT TLS 8883.

## Funzionalità
- Toggle cancello manuale / automatico
- Gestione orari apertura/chiusura
- Dashboard web in tempo reale
- Serial monitor con dashboard
- LittleFS per configurazioni
- Watchdog ESP32-S3

## Setup
- Clona repo
- Web: `cd Web && npm install && npm start`
- ESP32: carica sketch `ESP32/sketch_mar24b.ino` tramite Arduino IDE
- Configura WiFi e MQTT TLS nel firmware

## Deploy Web
- Render: Build `npm install`, Start `npm start`, Runtime Node 18+
