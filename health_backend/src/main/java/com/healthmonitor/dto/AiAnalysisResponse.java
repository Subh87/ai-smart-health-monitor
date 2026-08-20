package com.healthmonitor.dto;

import java.util.List;

public class AiAnalysisResponse {

    private String overallStatus;
    private String summary;
    private List<String> observations;
    private List<String> recommendations;
    private List<String> explanations;
    private List<String> questionsForDoctor;
    private String safetyGuidance;
    private Boolean recheckRecommended;
    private String disclaimer;
    private Boolean isRuleBased;

    public AiAnalysisResponse() {}

    public AiAnalysisResponse(String overallStatus, String summary, List<String> observations, List<String> recommendations,
                              List<String> explanations, List<String> questionsForDoctor, String safetyGuidance,
                              Boolean recheckRecommended, String disclaimer, Boolean isRuleBased) {
        this.overallStatus = overallStatus;
        this.summary = summary;
        this.observations = observations;
        this.recommendations = recommendations;
        this.explanations = explanations != null ? explanations : observations;
        this.questionsForDoctor = questionsForDoctor != null ? questionsForDoctor : recommendations;
        this.safetyGuidance = safetyGuidance;
        this.recheckRecommended = recheckRecommended;
        this.disclaimer = disclaimer;
        this.isRuleBased = isRuleBased;
    }

    public AiAnalysisResponse(String overallStatus, String summary, List<String> observations, List<String> recommendations, String disclaimer, Boolean isRuleBased) {
        this(overallStatus, summary, observations, recommendations, observations, recommendations,
             "Re-check readings after 5 minutes of rest if values deviate from expected ranges.",
             "ATTENTION".equalsIgnoreCase(overallStatus) || "URGENT".equalsIgnoreCase(overallStatus),
             disclaimer, isRuleBased);
    }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getObservations() { return observations; }
    public void setObservations(List<String> observations) { this.observations = observations; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public List<String> getExplanations() {
        return explanations != null ? explanations : observations;
    }
    public void setExplanations(List<String> explanations) { this.explanations = explanations; }

    public List<String> getQuestionsForDoctor() {
        return questionsForDoctor != null ? questionsForDoctor : recommendations;
    }
    public void setQuestionsForDoctor(List<String> questionsForDoctor) { this.questionsForDoctor = questionsForDoctor; }

    public String getSafetyGuidance() { return safetyGuidance; }
    public void setSafetyGuidance(String safetyGuidance) { this.safetyGuidance = safetyGuidance; }

    public Boolean getRecheckRecommended() { return recheckRecommended; }
    public void setRecheckRecommended(Boolean recheckRecommended) { this.recheckRecommended = recheckRecommended; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public Boolean getIsRuleBased() { return isRuleBased; }
    public void setIsRuleBased(Boolean isRuleBased) { this.isRuleBased = isRuleBased; }
}

