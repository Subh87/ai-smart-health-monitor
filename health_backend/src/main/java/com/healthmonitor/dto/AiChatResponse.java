package com.healthmonitor.dto;

public class AiChatResponse {

    private String reply;
    private String disclaimer;

    public AiChatResponse() {}

    public AiChatResponse(String reply, String disclaimer) {
        this.reply = reply;
        this.disclaimer = disclaimer;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
