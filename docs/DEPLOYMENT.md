# Separate Deployment Guide - AI Smart Health Monitor

This document details how to independently deploy the **Spring Boot 3 Java Backend (`health_backend`)** and the **React 18 Frontend (`frontend`)** across cloud hosting platforms.

---

## 1. Deplomynent Architecture Overview

```
                     ┌────────────────────────┐
                     │   ESP32 Microcontroller│
                     │ (MAX30102 + DS18B20)   │
                     └───────────┬────────────┘
                                 │ HTTP POST /api/readings
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HEALTH BACKEND (Spring Boot)                 │
│  Hosted on: Render / Railway / Fly.io / AWS App Runner / Docker │
│  - REST API & SSE Streaming (Port 8080 or $PORT)                │
│  - H2 Embedded Database & JPA Persistence                       │
│  - Google Gemini AI Integration Engine                          │
└─────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │ REST API & SSE /api/*
                                 │ (CORS Enabled)
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + Vite)                   │
│  Hosted on: Vercel / Netlify / Render Static / Cloudflare Pages │
│  - Dynamic Base API URL via VITE_API_BASE_URL                   │
│  - Real-time Vitals Dashboard & Gemini Chat                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Deploying `health_backend` (Spring Boot REST API)

### Option A: Render (1-Click Docker Web Service)
1. Push your repository to GitHub / GitLab.
2. Sign in to [Render Console](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your repository and select **Root Directory**: `health_backend`.
4. Render automatically detects `health_backend/render.yaml` or `health_backend/Dockerfile`.
5. Set Environment Variables:
   - `GEMINI_API_KEY`: `your_google_gemini_api_key`
   - `APP_CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
6. Click **Deploy Web Service**.
7. Note your public backend URL (e.g., `https://health-backend.onrender.com`).

---

### Option B: Railway / Fly.io / AWS App Runner
1. Set the root directory of your project deployment to `health_backend`.
2. Ensure build command is `mvn clean package -DskipTests` or use Dockerfile `health_backend/Dockerfile`.
3. Provide environment variables:
   - `PORT`: (Injected automatically by platform)
   - `GEMINI_API_KEY`: `your_api_key`
   - `APP_CORS_ALLOWED_ORIGINS`: `https://your-frontend-domain.com`

---

### Option C: Standalone Docker Container
```bash
# Build Docker Image
cd health_backend
docker build -t health-backend:latest .

# Run Container
docker run -d -p 8080:8080 \
  -e GEMINI_API_KEY="your_api_key" \
  -e APP_CORS_ALLOWED_ORIGINS="http://localhost:5173" \
  --name health_backend_app health-backend:latest
```

---

## 3. Deploying `frontend` (React 18 + Vite)

### Option A: Vercel (Recommended for React)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Select your repository and set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://health-backend.onrender.com/api` (URL of your live backend + `/api`)
   - `VITE_DEFAULT_DEVICE_ID`: `ESP32-DEMO-001`
5. Click **Deploy**. Vercel uses `frontend/vercel.json` for SPA routing automatically.

---

### Option B: Netlify
1. Log into Netlify and choose **Import from Git**.
2. Set **Base directory**: `frontend`.
3. Set **Build command**: `npm run build`.
4. Set **Publish directory**: `frontend/dist`.
5. Set Environment Variable: `VITE_API_BASE_URL` = `https://your-live-backend-url/api`.
6. Click **Deploy Site**. Netlify uses `frontend/netlify.toml` for SPA rewrites.

---

### Option C: Standalone Docker Nginx Container
```bash
# Build Frontend Image with production backend URL
cd frontend
docker build --build-arg VITE_API_BASE_URL="https://health-backend.onrender.com/api" -t health-frontend:latest .

# Run Container on Port 80
docker run -d -p 80:80 --name health_frontend_app health-frontend:latest
```

---

## 4. Configuring ESP32 Firmware for Live Deployed Backend

In `esp32/esp32_smart_health_monitor.ino`, update the `serverUrl` constant to your deployed backend domain:

```cpp
// Update to your live backend domain
const char* serverUrl = "https://health-backend.onrender.com/api/readings";
```

---

## 5. Verification Checklist

| Service | Test URL | Expected Response |
|---|---|---|
| **Backend Health** | `GET https://your-backend.com/api/health` | `{"status":"UP","service":"AI Smart Health Monitor Backend (health_backend)"}` |
| **Backend H2 Console** | `GET https://your-backend.com/h2-console` | H2 Web Console login screen |
| **Frontend App** | `GET https://your-frontend.vercel.app` | Live Health Dashboard |
