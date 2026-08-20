# Complete Setup Guide - AI Smart Health Monitor

## System Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Arduino IDE**: 2.x (with ESP32 board manager installed)
- **PostgreSQL**: (Optional) PostgreSQL 14+ database. *If PostgreSQL is not running, the application automatically uses a zero-config SQLite / In-memory fallback.*

---

## 1. Quick Start (Demo Mode - No Hardware Required)

You can launch and demonstrate the entire system immediately without connecting hardware or configuring a database:

```bash
# Clone or navigate to the project directory
cd C:\Users\subha\.gemini\antigravity-ide\scratch\ai-smart-health-monitor

# Install root & workspace dependencies
npm run install:all

# Run backend development server (Port 5000)
npm run dev:backend

# In a separate terminal, run frontend development server (Port 5173)
npm run dev:frontend
```

Open `http://localhost:5173` in your browser. Toggle **DEMO MODE** on the top header to see simulated live heart rate, SpO2, temperature streams, AI analysis, charts, and alert triggers!

---

## 2. Environment Variable Configuration

Copy `.env.example` in both backend and root:

### Backend `.env` (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_12345
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://health_user:health_password@localhost:5432/health_db
USE_SQLITE_FALLBACK=true
GEMINI_API_KEY=AIzaSy... (Your Google Gemini API Key)
```

---

## 3. Obtaining Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API key**.
3. Copy your API key and paste it into `backend/.env` under `GEMINI_API_KEY`.

---

## 4. Hardware Setup & Flashing ESP32

1. **Wire the hardware** following [docs/hardware.md](hardware.md).
2. Open **Arduino IDE**.
3. Install required libraries via Arduino Library Manager (`Ctrl + Shift + I`):
   - `SparkFun MAX3010x Pulse and Proximity Sensor Library`
   - `Adafruit SSD1306` & `Adafruit GFX Library`
   - `OneWire`
   - `DallasTemperature`
   - `ArduinoJson`
4. Open `esp32/esp32_smart_health_monitor.ino`.
5. Update your Wi-Fi details and Backend IP:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverUrl = "http://192.168.1.100:5000/api/readings"; // Replace with your computer's local IP address
   ```
6. Select Board **ESP32 Dev Module** and click **Upload**.
7. Open Serial Monitor at **115200 baud** to view real-time debug logs.
