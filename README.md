# AI Smart Health Monitor

A complete full-stack IoT healthcare monitoring system built with an **ESP32 microcontroller**, **MAX30102 PPG pulse oximeter**, **DS18B20 digital thermometer**, **SSD1306 OLED display**, **Spring Boot 3 Java backend (`health_backend`)**, **H2 Embedded Database** (with JPA entity mapping), **React 18 + Vite frontend**, and **Google Gemini AI integration**.

> [!IMPORTANT]
> **Educational Disclaimer**: This project is strictly an educational prototype and is **NOT a medical diagnostic device**. All AI output, threshold alerts, and health badges emphasize non-diagnostic, educational insights only.

---

## System Architecture & Project Structure

```
ai-smart-health-monitor/
├── README.md                          # Main project guide & viva explanation
├── package.json                       # Monorepo workspace scripts (Concurrently launcher)
├── docker-compose.separate.yml        # Independent Docker Compose manifest
├── esp32/                             # ESP32 C++ Arduino Firmware
│   ├── esp32_smart_health_monitor.ino # Main firmware source code
│   └── README.md                      # Wiring & flashing instructions
├── health_backend/                    # Fresh Spring Boot 3 Java REST API Server
│   ├── pom.xml                        # Maven dependencies (Web, Security, Data JPA, H2, JWT)
│   ├── Dockerfile                     # Multi-stage Dockerfile for cloud backend hosting
│   ├── render.yaml                    # 1-Click Render deployment manifest
│   ├── .env.example                   # Environment configuration guide
│   └── src/main/java/com/healthmonitor/
│       ├── HealthMonitorApplication.java
│       ├── controller/                # Health, Auth, Readings, AI, Export, Device controllers
│       ├── dto/                       # Request & Response DTOs
│       ├── entity/                    # UserEntity, ReadingEntity, AlertEntity JPA models
│       ├── repository/                # UserRepository, ReadingRepository, AlertRepository
│       ├── security/                  # Spring Security filter chain & JWT provider
│       └── service/                   # Telemetry processing, Gemini AI service, Demo simulator
├── frontend/                          # React 18 + Vite + Tailwind CSS + Recharts
│   ├── Dockerfile                     # Nginx SPA production container
│   ├── nginx.conf                     # Client-side routing configuration
│   ├── vercel.json                    # 1-Click Vercel deployment manifest
│   ├── netlify.toml                   # 1-Click Netlify deployment manifest
│   ├── src/
│   │   ├── components/                # MetricCard, StatusBadge, Charts, Disclaimer, Navbar
│   │   ├── context/                   # AuthContext, HealthDataContext, DemoModeContext
│   │   ├── pages/                     # 10 UI Pages
│   │   ├── services/                  # Axios REST API client targeting Spring Boot
│   │   └── types/                     # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
└── docs/                              # Comprehensive documentation
    ├── DEPLOYMENT.md                  # Independent Cloud & Docker Deployment Guide
    ├── architecture.md                # System topology & data flow
    ├── api.md                         # OpenAPI REST API specifications
    ├── hardware.md                    # ESP32 pinout table & schematic diagrams
    └── ai.md                          # Gemini prompt engineering & guardrails
```

---

## Quick Start & Demo Mode (No Physical Hardware Needed!)

The project features a **built-in Demo Mode** that simulates live ESP32 sensor telemetry out-of-the-box:

```bash
# 1. Install dependencies
npm run install:all

# 2. Start Full-Stack System (Launches Spring Boot Backend & React Frontend together)
npm run dev
```

- **Spring Boot Backend**: Runs on `http://localhost:8080` (H2 Console at `http://localhost:8080/h2-console`).
- **React Frontend**: Runs on `http://localhost:5173`.

Open `http://localhost:5173` in your browser. Toggle **DEMO MODE** on the top header to stream simulated heart rate, SpO2, and temperature readings into real-time charts, trigger educational alerts, and run AI health analysis!

---

## Independent Deployment Guide

Both `health_backend` and `frontend` are arranged to be deployed completely independently:

- 📡 **Backend Deployment Guide**: Host on Render, Railway, Fly.io, or AWS App Runner using [`health_backend/Dockerfile`](file:///c:/Users/subha/.gemini/antigravity-ide/scratch/ai-smart-health-monitor/health_backend/Dockerfile).
- 💻 **Frontend Deployment Guide**: Host on Vercel, Netlify, Cloudflare Pages, or Docker Nginx using [`frontend/vercel.json`](file:///c:/Users/subha/.gemini/antigravity-ide/scratch/ai-smart-health-monitor/frontend/vercel.json) or [`frontend/netlify.toml`](file:///c:/Users/subha/.gemini/antigravity-ide/scratch/ai-smart-health-monitor/frontend/netlify.toml).
- 📖 **Full Instructions**: See [`docs/DEPLOYMENT.md`](file:///c:/Users/subha/.gemini/antigravity-ide/scratch/ai-smart-health-monitor/docs/DEPLOYMENT.md).

---

## Hardware Pin Connections (ESP32)

| Sensor / Module | Component Pin | ESP32 Pin | Interface / Notes |
|---|---|---|---|
| **MAX30102 PPG** | VCC, GND, SDA, SCL | 3.3V, GND, GPIO 21, GPIO 22 | Heart Rate & SpO2 (I2C 0x57) |
| **SSD1306 OLED** | VCC, GND, SDA, SCL | 3.3V, GND, GPIO 21, GPIO 22 | 0.96" 128x64 Graphic Screen (I2C 0x3C) |
| **DS18B20 Probe** | VCC, GND, DATA | 3.3V, GND, GPIO 4 | Digital Thermometer (4.7kΩ pull-up to 3.3V) |

---

## Google Gemini AI Setup

1. Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Set the environment variable `GEMINI_API_KEY=your_api_key_here`.

> *Note: If `GEMINI_API_KEY` is not set, the Spring Boot backend seamlessly uses an intelligent rule-based fallback analyzer so tests and offline demos work 100% reliably.*

---

## How to Build the Backend & Frontend Separately

```bash
# Compile and package Spring Boot executable JAR
npm run build:backend

# Bundle React frontend for production
npm run build:frontend
```
