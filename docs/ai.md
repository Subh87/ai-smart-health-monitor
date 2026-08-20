# AI & Gemini Integration Guidelines - AI Smart Health Monitor

## Overview

The AI Smart Health Monitor leverages **Google Gemini API** (`gemini-2.5-flash` / `gemini-1.5-flash`) to convert raw physiological sensor measurements into understandable educational health explanations.

> **CRITICAL MEDICAL DISCLAIMER**: The AI assistant MUST NOT diagnose medical conditions, prescribe treatments, adjust medication dosages, or replace professional healthcare consultations.

---

## AI Prompt Design & Guardrails

### 1. System Prompt Constraints
All requests to Gemini include system instructions specifying safety boundary conditions:
- **Role**: Educational Health Information Assistant.
- **Tone**: Empathetic, clear, objective, non-alarmist.
- **Constraints**:
  - Never say "You have [Condition X]".
  - Always emphasize that sensor values are subject to motion artifacts or improper finger placement.
  - Suggest simple recheck protocols (rest 5 minutes, keep finger stationary, re-measure).
  - Include specific non-diagnostic explanations (e.g., room temperature, anxiety, recent physical exertion).
  - Provide actionable questions for the user to present to a medical doctor.

---

## Example Prompt Template (Backend API)

```json
{
  "systemInstruction": "You are an educational health assistant for an IoT prototype project. You provide non-diagnostic interpretations of heart rate, SpO2, and body temperature. Never diagnose disease, prescribe drugs, or pretend to be a medical practitioner. Always include safety disclaimers.",
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Analyze the following readings:\n- Heart Rate: 92 BPM\n- SpO2: 96%\n- Temperature: 37.4°C\nUser Symptoms: 'Feeling slightly fatigued after walking up stairs'\n\nProvide response in JSON format with fields: summary, explanations, recheckRecommended, safetyGuidance, questionsForDoctor."
        }
      ]
    }
  ]
}
```

---

## Fallback Engine (No API Key Mode)

If `GEMINI_API_KEY` is absent or the external API call encounters rate limits, the backend gracefully falls back to an **Algorithmic Rule-based Analyzer Service**. This ensures the application remains 100% functional during offline offline demos or viva presentations.
