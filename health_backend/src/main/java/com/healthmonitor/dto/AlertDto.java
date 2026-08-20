package com.healthmonitor.dto;

public class AlertDto {

    private Long id;
    private String deviceId;
    private String type;
    private String message;
    private String severity;
    private String timestamp;

    public AlertDto() {}

    public AlertDto(Long id, String deviceId, String type, String message, String severity, String timestamp) {
        this.id = id;
        this.deviceId = deviceId;
        this.type = type;
        this.message = message;
        this.severity = severity;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
