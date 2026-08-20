package com.healthmonitor.service;

import com.healthmonitor.dto.AlertDto;
import com.healthmonitor.dto.ReadingDto;
import com.healthmonitor.entity.AlertEntity;
import com.healthmonitor.entity.ReadingEntity;
import com.healthmonitor.repository.AlertRepository;
import com.healthmonitor.repository.ReadingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class TelemetryService {

    private final ReadingRepository readingRepository;
    private final AlertRepository alertRepository;
    private final List<SseEmitter> sseEmitters = new CopyOnWriteArrayList<>();

    public TelemetryService(ReadingRepository readingRepository, AlertRepository alertRepository) {
        this.readingRepository = readingRepository;
        this.alertRepository = alertRepository;
    }

    public ReadingDto processAndSaveReading(Double heartRate, Double spo2, Double temperature, String deviceId) {
        String effectiveDeviceId = (deviceId != null && !deviceId.isBlank()) ? deviceId : "ESP32-DEMO-001";
        
        String status = evaluateStatus(heartRate, spo2, temperature);
        ReadingEntity entity = new ReadingEntity(effectiveDeviceId, heartRate, spo2, temperature, status);
        entity = readingRepository.save(entity);

        evaluateThresholdAlerts(entity);

        ReadingDto dto = toReadingDto(entity);
        broadcastSseReading(dto);

        return dto;
    }

    public ReadingDto getLatestReading(String deviceId) {
        String effectiveDeviceId = (deviceId != null && !deviceId.isBlank()) ? deviceId : "ESP32-DEMO-001";
        return readingRepository.findFirstByDeviceIdOrderByTimestampDesc(effectiveDeviceId)
                .map(this::toReadingDto)
                .orElseGet(() -> readingRepository.findFirstByOrderByTimestampDesc()
                        .map(this::toReadingDto)
                        .orElseGet(() -> new ReadingDto(null, effectiveDeviceId, 75.0, 98.0, 36.6, "NORMAL", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))));
    }

    public List<ReadingDto> getHistory(String deviceId, String range, int limit) {
        String effectiveDeviceId = (deviceId != null && !deviceId.isBlank()) ? deviceId : null;
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        if ("7d".equalsIgnoreCase(range)) {
            since = LocalDateTime.now().minusDays(7);
        } else if ("30d".equalsIgnoreCase(range)) {
            since = LocalDateTime.now().minusDays(30);
        }

        List<ReadingEntity> entities = readingRepository.findHistory(effectiveDeviceId, since, PageRequest.of(0, Math.min(limit, 500)));
        List<ReadingDto> dtos = new ArrayList<>();
        for (ReadingEntity entity : entities) {
            dtos.add(toReadingDto(entity));
        }
        return dtos;
    }

    public List<AlertDto> getAlerts(String deviceId) {
        String effectiveDeviceId = (deviceId != null && !deviceId.isBlank()) ? deviceId : null;
        List<AlertEntity> entities = alertRepository.findRecentAlerts(effectiveDeviceId);
        List<AlertDto> dtos = new ArrayList<>();
        for (AlertEntity entity : entities) {
            dtos.add(toAlertDto(entity));
        }
        return dtos;
    }

    public SseEmitter createSseEmitter() {
        SseEmitter emitter = new SseEmitter(0L); // Infinite timeout
        sseEmitters.add(emitter);

        emitter.onCompletion(() -> sseEmitters.remove(emitter));
        emitter.onTimeout(() -> sseEmitters.remove(emitter));
        emitter.onError((e) -> sseEmitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data("SSE Telemetry Connected"));
        } catch (IOException e) {
            sseEmitters.remove(emitter);
        }

        return emitter;
    }

    private void broadcastSseReading(ReadingDto dto) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : sseEmitters) {
            try {
                emitter.send(SseEmitter.event().name("reading").data(dto));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        sseEmitters.removeAll(deadEmitters);
    }

    private String evaluateStatus(Double hr, Double spo2, Double temp) {
        if (hr == null || spo2 == null || temp == null) return "CHECK READING";
        if (spo2 < 90.0 || hr < 45.0 || hr > 130.0 || temp > 38.5) return "ATTENTION";
        if (spo2 < 95.0 || hr < 60.0 || hr > 100.0 || temp > 37.5 || temp < 35.5) return "ATTENTION";
        return "NORMAL";
    }

    private void evaluateThresholdAlerts(ReadingEntity r) {
        if (r.getSpo2() != null && r.getSpo2() < 90.0) {
            alertRepository.save(new AlertEntity(r.getDeviceId(), "LOW_SPO2", "Critical SpO2 drop: " + r.getSpo2() + "% (Normal: >95%)", "CRITICAL"));
        }
        if (r.getHeartRate() != null && r.getHeartRate() > 120.0) {
            alertRepository.save(new AlertEntity(r.getDeviceId(), "HIGH_HR", "Elevated Heart Rate: " + r.getHeartRate() + " BPM", "WARNING"));
        }
        if (r.getHeartRate() != null && r.getHeartRate() < 50.0) {
            alertRepository.save(new AlertEntity(r.getDeviceId(), "LOW_HR", "Low Heart Rate (Bradycardia): " + r.getHeartRate() + " BPM", "WARNING"));
        }
        if (r.getTemperature() != null && r.getTemperature() > 38.0) {
            alertRepository.save(new AlertEntity(r.getDeviceId(), "FEVER", "Elevated Temperature: " + r.getTemperature() + "°C", "WARNING"));
        }
    }

    public ReadingDto toReadingDto(ReadingEntity e) {
        return new ReadingDto(
                e.getId(),
                e.getDeviceId(),
                e.getHeartRate(),
                e.getSpo2(),
                e.getTemperature(),
                e.getStatus(),
                e.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    public AlertDto toAlertDto(AlertEntity e) {
        return new AlertDto(
                e.getId(),
                e.getDeviceId(),
                e.getType(),
                e.getMessage(),
                e.getSeverity(),
                e.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }
}
