package com.healthmonitor.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthmonitor.dto.AiAnalysisRequest;
import com.healthmonitor.dto.AiAnalysisResponse;
import com.healthmonitor.dto.AiChatRequest;
import com.healthmonitor.dto.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-1.5-flash}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String MEDICAL_DISCLAIMER =
            "⚠️ EDUCATIONAL & PROTOTYPE DISCLAIMER: This AI analysis is generated automatically for educational demonstration purposes only. " +
            "It is NOT a medical diagnostic tool and does NOT provide clinical diagnosis or treatment. Consult a licensed physician for any medical concerns.";

    public AiAnalysisResponse analyzeVitals(AiAnalysisRequest request) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callGeminiApi(request);
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to rule-based engine: " + e.getMessage());
            }
        }
        return generateRuleBasedAnalysis(request);
    }

    public AiChatResponse chatAssistant(AiChatRequest request) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callGeminiChatApi(request.getMessage());
            } catch (Exception e) {
                System.err.println("Gemini Chat API call failed, falling back: " + e.getMessage());
            }
        }
        return generateRuleBasedChatResponse(request.getMessage());
    }

    private AiAnalysisResponse callGeminiApi(AiAnalysisRequest request) throws Exception {
        double hr = request.getHeartRate() != null ? request.getHeartRate() : 75.0;
        double spo2 = request.getSpo2() != null ? request.getSpo2() : 98.0;
        double temp = request.getTemperature() != null ? request.getTemperature() : 36.6;

        String prompt = String.format(
                "You are an educational IoT Health Monitor Assistant. Analyze the following vitals:\n" +
                "- Heart Rate: %.1f BPM\n" +
                "- Oxygen Saturation (SpO2): %.1f%%\n" +
                "- Body Temperature: %.1f°C\n" +
                "- Reported Symptoms: %s\n\n" +
                "Respond in valid JSON format with keys: \"overallStatus\" (\"NORMAL\", \"ATTENTION\", or \"URGENT\"), " +
                "\"summary\" (string), \"observations\" (array of strings), \"recommendations\" (array of strings).",
                hr, spo2, temp,
                (request.getSymptoms() != null ? request.getSymptoms() : "None reported")
        );

        String responseText = queryGeminiModel(prompt);
        String jsonText = extractJson(responseText);

        JsonNode root = objectMapper.readTree(jsonText);
        String overallStatus = root.path("overallStatus").asText("ATTENTION");
        String summary = root.path("summary").asText("Vitals analyzed by Gemini AI.");

        List<String> observations = new ArrayList<>();
        if (root.has("observations") && root.get("observations").isArray()) {
            root.get("observations").forEach(node -> observations.add(node.asText()));
        }

        List<String> recommendations = new ArrayList<>();
        if (root.has("recommendations") && root.get("recommendations").isArray()) {
            root.get("recommendations").forEach(node -> recommendations.add(node.asText()));
        }

        return new AiAnalysisResponse(overallStatus, summary, observations, recommendations, MEDICAL_DISCLAIMER, false);
    }

    private AiChatResponse callGeminiChatApi(String message) throws Exception {
        String prompt = "You are an intelligent educational Health AI Assistant for an IoT vital signs monitor.\n" +
                "Provide helpful, scientifically grounded information to the user's question, while emphasizing non-diagnostic disclaimers.\n" +
                "User message: " + message;

        String replyText = queryGeminiModel(prompt);
        return new AiChatResponse(replyText, MEDICAL_DISCLAIMER);
    }

    private String queryGeminiModel(String promptText) throws Exception {
        String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey);

        Map<String, Object> textPart = Map.of("text", promptText);
        Map<String, Object> contentsPart = Map.of("parts", List.of(textPart));
        Map<String, Object> body = Map.of("contents", List.of(contentsPart));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        JsonNode rootNode = objectMapper.readTree(response.getBody());

        return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    }

    private AiAnalysisResponse generateRuleBasedAnalysis(AiAnalysisRequest req) {
        double hr = req.getHeartRate() != null ? req.getHeartRate() : 75.0;
        double spo2 = req.getSpo2() != null ? req.getSpo2() : 98.0;
        double temp = req.getTemperature() != null ? req.getTemperature() : 36.6;

        List<String> obs = new ArrayList<>();
        List<String> recs = new ArrayList<>();
        String status = "NORMAL";
        String summary;

        if (spo2 < 92.0) {
            status = "URGENT";
            obs.add(String.format("SpO2 of %.1f%% is below recommended physiological threshold (95-100%%).", spo2));
            recs.add("Ensure proper pulse oximeter probe placement and rest quietly.");
            recs.add("If low oxygen saturation persists or shortness of breath occurs, seek immediate clinical evaluation.");
        } else if (spo2 < 95.0) {
            status = "ATTENTION";
            obs.add(String.format("SpO2 of %.1f%% is slightly lower than optimal.", spo2));
            recs.add("Take slow, deep breaths and re-test measurement.");
        } else {
            obs.add(String.format("Oxygen Saturation (SpO2) at %.1f%% is within optimal physiological limits.", spo2));
        }

        if (hr > 100.0) {
            if (!"URGENT".equals(status)) status = "ATTENTION";
            obs.add(String.format("Heart rate of %.1f BPM indicates elevated pulse (Tachycardia range).", hr));
            recs.add("Stay hydrated, minimize stress and caffeine intake, and rest.");
        } else if (hr < 60.0) {
            if (!"URGENT".equals(status)) status = "ATTENTION";
            obs.add(String.format("Heart rate of %.1f BPM is lower than average (Bradycardia range).", hr));
            recs.add("Monitor for dizziness or fatigue if not an athletic baseline.");
        } else {
            obs.add(String.format("Heart rate of %.1f BPM is within resting adult range (60-100 BPM).", hr));
        }

        if (temp > 38.0) {
            if (!"URGENT".equals(status)) status = "ATTENTION";
            obs.add(String.format("Body temperature of %.1f°C indicates fever condition.", temp));
            recs.add("Maintain hydration and monitor thermal trends.");
        } else if (temp < 35.5) {
            if (!"URGENT".equals(status)) status = "ATTENTION";
            obs.add(String.format("Body temperature of %.1f°C is below normal range.", temp));
            recs.add("Warm up gradually and verify thermometer placement.");
        } else {
            obs.add(String.format("Body temperature of %.1f°C is within normal range (36.1 - 37.2°C).", temp));
        }

        if ("NORMAL".equals(status)) {
            summary = "All monitored physiological parameters are within standard baseline ranges.";
            recs.add("Maintain regular physical activity, healthy hydration, and routine checkups.");
        } else if ("ATTENTION".equals(status)) {
            summary = "One or more telemetry vitals require observation or re-measurement.";
        } else {
            summary = "Low oxygen saturation or extreme vital signs detected; immediate attention suggested.";
        }

        return new AiAnalysisResponse(status, summary, obs, recs, MEDICAL_DISCLAIMER, true);
    }

    private AiChatResponse generateRuleBasedChatResponse(String message) {
        String msgLower = message.toLowerCase();
        String reply;

        if (msgLower.contains("spo2") || msgLower.contains("oxygen")) {
            reply = "Oxygen Saturation (SpO2) measures the percentage of oxygen-saturated hemoglobin relative to total hemoglobin in the blood. Normal baseline for healthy adults at sea level is typically 95% to 100%. Values consistently below 90% may indicate hypoxemia.";
        } else if (msgLower.contains("heart") || msgLower.contains("bpm") || msgLower.contains("pulse")) {
            reply = "A normal resting heart rate for adults ranges from 60 to 100 beats per minute (BPM). Factors such as exercise, anxiety, fever, and medications can alter pulse rates. Sustained resting heart rates over 100 BPM or under 50 BPM should be evaluated with a medical professional.";
        } else if (msgLower.contains("temp") || msgLower.contains("fever")) {
            reply = "Standard body temperature is approximately 36.5°C to 37.5°C (97.7°F - 99.5°F). A reading above 38.0°C (100.4°F) typically signifies a fever, often body's immune response to infection.";
        } else {
            reply = "I am your AI Smart Health Assistant. You can ask me questions regarding vital sign metrics (SpO2, Heart Rate, Temperature), ESP32 sensor telemetry, or threshold guidance!";
        }

        return new AiChatResponse(reply, MEDICAL_DISCLAIMER);
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        if (text.contains("```json")) {
            int start = text.indexOf("```json") + 7;
            int end = text.indexOf("```", start);
            if (end == -1) end = text.length();
            return text.substring(start, end).trim();
        } else if (text.contains("```")) {
            int start = text.indexOf("```") + 3;
            int end = text.indexOf("```", start);
            if (end == -1) end = text.length();
            return text.substring(start, end).trim();
        }
        return text.trim();
    }
}
