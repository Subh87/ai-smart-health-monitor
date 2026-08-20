package com.healthmonitor.controller;

import com.healthmonitor.dto.AlertDto;
import com.healthmonitor.dto.ReadingDto;
import com.healthmonitor.service.DemoSimulatorService;
import com.healthmonitor.service.TelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ReadingsController {

    private final TelemetryService telemetryService;
    private final DemoSimulatorService demoSimulatorService;

    public ReadingsController(TelemetryService telemetryService, DemoSimulatorService demoSimulatorService) {
        this.telemetryService = telemetryService;
        this.demoSimulatorService = demoSimulatorService;
    }

    @GetMapping("/readings/latest")
    public ResponseEntity<Map<String, Object>> getLatestReading(@RequestParam(required = false) String deviceId) {
        ReadingDto reading = telemetryService.getLatestReading(deviceId);
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("reading", reading);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/readings/history")
    public ResponseEntity<Map<String, Object>> getHistory(
            @RequestParam(required = false) String deviceId,
            @RequestParam(defaultValue = "24h") String range,
            @RequestParam(defaultValue = "100") int limit) {
        List<ReadingDto> history = telemetryService.getHistory(deviceId, range, limit);
        return ResponseEntity.ok(Map.of("history", history, "count", history.size()));
    }

    @PostMapping("/readings")
    public ResponseEntity<Map<String, Object>> postReading(@RequestBody Map<String, Object> payload) {
        Double heartRate = payload.get("heartRate") != null ? Double.valueOf(payload.get("heartRate").toString()) : null;
        Double spo2 = payload.get("spo2") != null ? Double.valueOf(payload.get("spo2").toString()) : null;
        Double temperature = payload.get("temperature") != null ? Double.valueOf(payload.get("temperature").toString()) : null;
        String deviceId = payload.get("deviceId") != null ? payload.get("deviceId").toString() : "ESP32-DEMO-001";

        demoSimulatorService.updateHeartbeat(deviceId);

        ReadingDto data = telemetryService.processAndSaveReading(heartRate, spo2, temperature, deviceId);
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @GetMapping("/readings/stream")
    public SseEmitter streamReadings() {
        return telemetryService.createSseEmitter();
    }

    @GetMapping("/alerts")
    public ResponseEntity<Map<String, Object>> getAlerts(@RequestParam(required = false) String deviceId) {
        List<AlertDto> alerts = telemetryService.getAlerts(deviceId);
        return ResponseEntity.ok(Map.of("alerts", alerts, "count", alerts.size()));
    }
}
