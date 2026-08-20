package com.healthmonitor.dto;

import java.util.List;

public class AiAnalysisResponse {

    private String overallStatus;
    private String summary;
    private List<String> observations;
    private List<String> recommendations;
    private String disclaimer;
    private Boolean isRuleBased;

    public AiAnalysisResponse() {}

    public AiAnalysisResponse(String overallStatus, String summary, List<String> observations, List<String> recommendations, String disclaimer, Boolean isRuleBased) {
        this.overallStatus = overallStatus;
        this.summary = summary;
        this.observations = observations;
        this.recommendations = recommendations;
        this.disclaimer = disclaimer;
        this.isRuleBased = isRuleBased;
    }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getObservations() { return observations; }
    public void setObservations(List<String> observations) { this.observations = observations; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public Boolean getIsRuleBased() { return isRuleBased; }
    public void setIsRuleBased(Boolean isRuleBased) { this.isRuleBased = isRuleBased; }
}
