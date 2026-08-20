package com.healthmonitor.dto;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;
    private String deviceId;
    private Double heartRate;
    private Double spo2;
    private Double temperature;

    public AiChatRequest() {}

    public AiChatRequest(String message, String deviceId, Double heartRate, Double spo2, Double temperature) {
        this.message = message;
        this.deviceId = deviceId;
        this.heartRate = heartRate;
        this.spo2 = spo2;
        this.temperature = temperature;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public Double getHeartRate() { return heartRate; }
    public void setHeartRate(Double heartRate) { this.heartRate = heartRate; }

    public Double getSpo2() { return spo2; }
    public void setSpo2(Double spo2) { this.spo2 = spo2; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
}

