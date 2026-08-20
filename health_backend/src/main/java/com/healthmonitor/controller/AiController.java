package com.healthmonitor.controller;

import com.healthmonitor.dto.AiAnalysisRequest;
import com.healthmonitor.dto.AiAnalysisResponse;
import com.healthmonitor.dto.AiChatRequest;
import com.healthmonitor.dto.AiChatResponse;
import com.healthmonitor.service.GeminiAiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiAiService geminiAiService;

    public AiController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyzeVitals(@RequestBody AiAnalysisRequest request) {
        AiAnalysisResponse response = geminiAiService.analyzeVitals(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chatAssistant(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = geminiAiService.chatAssistant(request);
        return ResponseEntity.ok(response);
    }
}
