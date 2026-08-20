package com.healthmonitor.dto;

public class ReadingDto {

    private Long id;
    private String deviceId;
    private Double heartRate;
    private Double spo2;
    private Double temperature;
    private String status;
    private String timestamp;

    public ReadingDto() {}

    public ReadingDto(Long id, String deviceId, Double heartRate, Double spo2, Double temperature, String status, String timestamp) {
        this.id = id;
        this.deviceId = deviceId;
        this.heartRate = heartRate;
        this.spo2 = spo2;
        this.temperature = temperature;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public Double getHeartRate() { return heartRate; }
    public void setHeartRate(Double heartRate) { this.heartRate = heartRate; }

    public Double getSpo2() { return spo2; }
    public void setSpo2(Double spo2) { this.spo2 = spo2; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
