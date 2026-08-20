package com.healthmonitor.dto;

public class DeviceStatusDto {

    private String deviceId;
    private String status;
    private Integer batteryLevel;
    private Boolean isConnected;
    private String lastSeen;
    private Boolean demoMode;

    public DeviceStatusDto() {}

    public DeviceStatusDto(String deviceId, String status, Integer batteryLevel, Boolean isConnected, String lastSeen, Boolean demoMode) {
        this.deviceId = deviceId;
        this.status = status;
        this.batteryLevel = batteryLevel;
        this.isConnected = isConnected;
        this.lastSeen = lastSeen;
        this.demoMode = demoMode;
    }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public Boolean getIsConnected() { return isConnected; }
    public void setIsConnected(Boolean isConnected) { this.isConnected = isConnected; }

    public String getLastSeen() { return lastSeen; }
    public void setLastSeen(String lastSeen) { this.lastSeen = lastSeen; }

    public Boolean getDemoMode() { return demoMode; }
    public void setDemoMode(Boolean demoMode) { this.demoMode = demoMode; }
}
