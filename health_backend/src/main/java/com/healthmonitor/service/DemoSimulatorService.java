package com.healthmonitor.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class DemoSimulatorService {

    private final TelemetryService telemetryService;
    private final Random random = new Random();

    private boolean demoModeActive = true;
    private long lastHeartbeatTime = System.currentTimeMillis();
    private String defaultDeviceId = "ESP32-DEMO-001";

    public DemoSimulatorService(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    public boolean isDemoModeActive() {
        return demoModeActive;
    }

    public void setDemoModeActive(boolean active, String deviceId) {
        this.demoModeActive = active;
        if (deviceId != null && !deviceId.isBlank()) {
            this.defaultDeviceId = deviceId;
        }
    }

    public void updateHeartbeat(String deviceId) {
        this.lastHeartbeatTime = System.currentTimeMillis();
        if (deviceId != null && !deviceId.isBlank()) {
            this.defaultDeviceId = deviceId;
        }
    }

    public boolean isDeviceOnline() {
        return demoModeActive || (System.currentTimeMillis() - lastHeartbeatTime < 30000);
    }

    public String getLastSeen() {
        return Instant.ofEpochMilli(lastHeartbeatTime).toString();
    }

    public String getDefaultDeviceId() {
        return defaultDeviceId;
    }

    @Scheduled(fixedRate = 5000)
    public void generateDemoTelemetry() {
        if (!demoModeActive) return;

        double hr = 68.0 + (random.nextDouble() * 14.0) + (random.nextDouble() > 0.92 ? 28.0 : 0.0);
        double spo2 = 96.0 + (random.nextDouble() * 3.5) - (random.nextDouble() > 0.95 ? 7.0 : 0.0);
        double temp = 36.4 + (random.nextDouble() * 0.7) + (random.nextDouble() > 0.94 ? 1.4 : 0.0);

        hr = Math.round(hr * 10.0) / 10.0;
        spo2 = Math.min(100.0, Math.round(spo2 * 10.0) / 10.0);
        temp = Math.round(temp * 10.0) / 10.0;

        telemetryService.processAndSaveReading(hr, spo2, temp, defaultDeviceId);
    }
}
