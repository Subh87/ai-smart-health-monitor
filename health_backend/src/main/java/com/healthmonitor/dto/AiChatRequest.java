package com.healthmonitor.dto;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;
    private String deviceId;

    public AiChatRequest() {}

    public AiChatRequest(String message, String deviceId) {
        this.message = message;
        this.deviceId = deviceId;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
}
