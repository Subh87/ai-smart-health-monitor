package com.healthmonitor.dto;

public class AiAnalysisRequest {

    private Double heartRate;
    private Double spo2;
    private Double temperature;
    private String symptoms;
    private String deviceId;

    public AiAnalysisRequest() {}

    public AiAnalysisRequest(Double heartRate, Double spo2, Double temperature, String symptoms, String deviceId) {
        this.heartRate = heartRate;
        this.spo2 = spo2;
        this.temperature = temperature;
        this.symptoms = symptoms;
        this.deviceId = deviceId;
    }

    public Double getHeartRate() { return heartRate; }
    public void setHeartRate(Double heartRate) { this.heartRate = heartRate; }

    public Double getSpo2() { return spo2; }
    public void setSpo2(Double spo2) { this.spo2 = spo2; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
}
