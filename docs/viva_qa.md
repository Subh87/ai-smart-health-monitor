# Viva Voce & Project Defense Q&A Guide

## Project Title: AI Smart Health Monitor

---

### Q1: What is the primary objective of this project?
**Answer**: The objective is to design a full-stack IoT healthcare monitoring prototype that reads physiological metrics (Heart Rate, SpO2, Temperature) via an ESP32 edge microcontroller, visualizes real-time telemetry on an interactive web dashboard using Server-Sent Events (SSE), and generates non-diagnostic educational health insights via Google Gemini AI.

---

### Q2: How does the optical PPG sensor (MAX30102) compute heart rate and SpO2?
**Answer**: The MAX30102 emits red (660nm) and infrared (880nm) light into microvascular tissue. Oxygenated hemoglobin absorbs more IR light, whereas deoxygenated hemoglobin absorbs more red light. By measuring the ratio of AC/DC pulsatile signals ($R = \frac{(AC/DC)_{red}}{(AC/DC)_{ir}}$), peripheral oxygen saturation ($\text{SpO}_2\%$) is computed.

---

### Q3: Why is there an explicit disclaimer on all AI insights and threshold alerts?
**Answer**: To enforce strict ethical AI guardrails and legal compliance. The system is designed as an educational prototype and **not a certified medical diagnostic device**. The backend system prompts prohibit diagnosing medical conditions or prescribing medication.

---

### Q4: How does the backend database architecture achieve high availability?
**Answer**: The database layer uses a 3-tier fallback strategy:
1. **Primary**: PostgreSQL (via connection string).
2. **Secondary**: Local disk-based SQLite (`health_monitor.db`).
3. **Tertiary**: Pure JavaScript in-memory data store when native C++ SQLite binaries are unavailable.

---

### Q5: How are real-time telemetry updates delivered to the browser dashboard?
**Answer**: Via **Server-Sent Events (SSE)** at `/api/readings/stream`. When the ESP32 or Demo Mode posts telemetry to `/api/readings`, Node.js `EventEmitter` broadcasts the reading payload down open HTTP streams to all connected browser clients.
