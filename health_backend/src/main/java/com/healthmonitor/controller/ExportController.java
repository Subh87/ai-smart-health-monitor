package com.healthmonitor.controller;

import com.healthmonitor.dto.ReadingDto;
import com.healthmonitor.service.TelemetryService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final TelemetryService telemetryService;

    public ExportController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @GetMapping("/csv")
    public ResponseEntity<String> exportCsv(
            @RequestParam(required = false) String deviceId,
            @RequestParam(defaultValue = "30d") String range,
            @RequestParam(required = false) String token) {

        List<ReadingDto> history = telemetryService.getHistory(deviceId, range, 1000);

        StringBuilder sb = new StringBuilder();
        sb.append("ID,Device ID,Heart Rate (BPM),SpO2 (%),Temperature (C),Status,Timestamp\n");

        for (ReadingDto r : history) {
            sb.append(String.format("%s,%s,%s,%s,%s,%s,%s\n",
                    r.getId() != null ? r.getId() : "",
                    r.getDeviceId() != null ? r.getDeviceId() : "",
                    r.getHeartRate() != null ? r.getHeartRate() : "",
                    r.getSpo2() != null ? r.getSpo2() : "",
                    r.getTemperature() != null ? r.getTemperature() : "",
                    r.getStatus() != null ? r.getStatus() : "",
                    r.getTimestamp() != null ? r.getTimestamp() : ""
            ));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"health_readings_export.csv\"");

        return ResponseEntity.ok()
                .headers(headers)
                .body(sb.toString());
    }
}
