# System Architecture - AI Smart Health Monitor

## Overview

The **AI Smart Health Monitor** is an educational, end-to-end IoT health monitoring platform. It combines edge sensing on an ESP32 microcontroller with a high-performance Node.js/Express REST backend, PostgreSQL database storage, Google Gemini AI analytical models, and a responsive React frontend dashboard.

> **Disclaimer**: This project is strictly an educational prototype and is **NOT a medical diagnostic device**.

```
+-------------------------------------------------------------------------+
|                                EDGE SENSING                             |
|  +--------------------+   +--------------------+   +-----------------+  |
|  | MAX30102 PPG Sensor|   | DS18B20 Temp Sensor|   | 0.96" OLED Disp |  |
|  +---------+----------+   +---------+----------+   +--------^--------+  |
|            |                        |                       |           |
|            +-----------+  +---------+                       |           |
|                        v  v                                 |           |
|                  +---------------+                          |           |
|                  | ESP32 Micro   +--------------------------+           |
|                  +-------+-------+                                      |
+--------------------------|----------------------------------------------+
                           | Wi-Fi HTTP POST /api/readings
                           v
+-------------------------------------------------------------------------+
|                              BACKEND LAYER                              |
|  +-------------------------------------------------------------------+  |
|  | Node.js + Express REST API (TypeScript)                          |  |
|  |  - Auth Middleware (JWT)                                          |  |
|  |  - Sensor Validation & Educational Classifier (NORMAL/ATTENTION)  |  |
|  |  - Demo Mode Sensor Data Generator                                |  |
|  +-------------------+---------------------------+-------------------+  |
|                      |                           |                      |
|                      v                           v                      |
|            +-------------------+       +--------------------+           |
|            | PostgreSQL DB     |       | Google Gemini API  |           |
|            | (SQLite Fallback) |       | (Backend Isolated) |           |
|            +-------------------+       +--------------------+           |
+----------------------^---------------------------^----------------------+
                       | HTTP GET / POST           |                      
+----------------------|---------------------------|----------------------+
|                      v                           v                      |
|                              FRONTEND DASHBOARD                         |
|  +-------------------------------------------------------------------+  |
|  | React 18 + Vite + Tailwind CSS + Recharts                         |  |
|  |  - Landing Page & Authentication                                  |  |
|  |  - Health Overview & Real-time Gauges                            |  |
|  |  - Interactive 24h / 7d / 30d Trend Charts                        |  |
|  |  - AI Analysis Generator & Interactive Health Assistant Chat      |  |
|  |  - Educational Threshold Alerts & Device Status                   |  |
|  |  - Built-in Hardware-Free Demo Mode                               |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

## Data Flow Architecture

1. **Sensor Data Collection**:
   - ESP32 queries the MAX30102 sensor over I2C (GPIO 21 SDA, GPIO 22 SCL) to compute Heart Rate (BPM) and Blood Oxygen Saturation (SpO2 %).
   - ESP32 queries the DS18B20 digital thermometer over OneWire (GPIO 4) to measure Body Temperature (°C).
   - Real-time values are rendered locally on the 0.96-inch SSD1306 OLED display.

2. **HTTP Transmission**:
   - The ESP32 packages readings into JSON format: `{ "deviceId": "ESP32-HEALTH-001", "heartRate": 75, "spo2": 98, "temperature": 36.8, "timestamp": "2026-08-19T11:00:00Z" }`.
   - The payload is transmitted via HTTP POST to `/api/readings` with retry logic and exponential backoff.

3. **Backend Processing & Storage**:
   - The Express backend validates numerical bounds:
     - Heart Rate: 30 – 220 BPM
     - SpO2: 70 – 100 %
     - Temperature: 30.0 – 45.0 °C
   - Evaluates educational status: `NORMAL`, `ATTENTION`, or `CHECK READING`.
   - Persists reading to PostgreSQL (or SQLite local storage).

4. **AI Analysis & Chat via Gemini**:
   - When requested by the frontend, the backend injects recent user sensor history and optional user-entered symptoms into a safety-tuned prompt sent to Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`).
   - Gemini responds with non-diagnostic educational explanations, general wellness guidance, and recommended questions for a physician.

5. **Demo Mode (Hardware Simulation)**:
   - When **Demo Mode** is enabled on the frontend (or backend), a deterministic simulation engine generates realistic physiological telemetry (sinusoidal heart rate curves, normal/mild SpO2 fluctuations, baseline temperature variance) allowing full system validation without hardware connected.
