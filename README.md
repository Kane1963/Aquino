# Cruscotto Web Cancello - Aquino

Questo progetto permette di controllare un cancello tramite **ESP32-S3** collegato via **MQTT TLS**.  
Include un **cruscotto web** per visualizzare lo stato del cancello, modificare modalità (auto/manuale) e impostare gli orari di apertura/chiusura.

---

## **Funzionalità**

- Controllo cancello tramite relè collegato all'ESP32-S3  
- Modalità automatica o manuale  
- Impostazione orari apertura/chiusura  
- **Dashboard in tempo reale** via Web  
- MQTT TLS (porta 8883) per comunicazione sicura  
- LittleFS per salvataggio configurazioni e sfondo (ESP32)  
- ISR pulsante manuale  
- Watchdog per sicurezza  
- Serial Monitor con **dashboard aggiornata ogni secondo**  

---

## **Struttura del progetto**
