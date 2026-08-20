package com.healthmonitor.dto;

public class DemoToggleRequest {

    private Boolean enable;
    private String deviceId;

    public DemoToggleRequest() {}

    public DemoToggleRequest(Boolean enable, String deviceId) {
        this.enable = enable;
        this.deviceId = deviceId;
    }

    public Boolean getEnable() { return enable; }
    public void setEnable(Boolean enable) { this.enable = enable; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
}
