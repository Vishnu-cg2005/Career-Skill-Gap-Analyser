package com.career.skillgapanalyser.service;

import com.career.skillgapanalyser.dto.AssessmentRequest;
import com.career.skillgapanalyser.dto.AssessmentResponse;
import com.google.gson.Gson;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AssessmentService {

  private final GeminiService geminiService;
  private final Gson gson = new Gson();

  // Helper to get current language
  private String getLanguage() {
    try {
      if (org.springframework.context.i18n.LocaleContextHolder.getLocale() != null) {
        return org.springframework.context.i18n.LocaleContextHolder.getLocale().getDisplayName();
      }
    } catch (Exception e) {
      System.err.println("Locale context missing, defaulting to English");
    }
    return "English";
  }

  public AssessmentService(GeminiService geminiService) {
    this.geminiService = geminiService;
  }

  public AssessmentResponse generateAssessment(AssessmentRequest request, String apiKey) {
    String skills = String.join(", ", request.getSkills());

    String uniqueSeed = UUID.randomUUID().toString() + "-" + System.currentTimeMillis();

    String prompt = """
        You are an expert Technical Interviewer & Assessment Generator.

        OBJECTIVE:
        Generate a personalized, high-quality technical assessment for the following candidate skills:
        {{SKILLS_FROM_RESUME}}

        STRICT REQUIREMENTS:
        1. **NO REPETITION**: Questions must be 100% unique. Do NOT use generic "What is X?" questions.
        2. **CORE TOPICS ONLY**: Focus on the *most important* concepts for each skill.
        3. **MIX OF TYPES**:
           - **MCQ**: Multiple Choice Questions (Theoretical or Code Analysis).
           - **CODING**: Short coding challenges where the user must write/fix code.
        4. **INCLUDE CODE**: At least 50% of content must involve code snippets.
        5. **DIFFICULTY**: {{LEVEL}}.
        6. **LANGUAGE**: Output everything in {{LANGUAGE}}.

        OUTPUT FORMAT (Valid JSON Only):
        {
          "questions": [
            {
              "id": "uuid",
              "skill": "Exact Skill Name",
              "type": "MCQ", // or "CODING"
              "question": "The question text or problem statement...",
              "codeSnippet": "class Test { ... }",  // Code to analyze (MCQ) or Starter code (CODING)
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Required for MCQ, Empty for CODING
              "correctAnswerIndex": 0 // 0-3 for MCQ, null for CODING
            }
          ]
        }

        CONFIGURATION:
        - Count: {{COUNT_PER_SKILL}} questions per skill (Mix of MCQ & CODING).
        - Seed: {{SEED}} (Ensure randomness).
        """;

    prompt = prompt
        .replace("{{SKILLS_FROM_RESUME}}", skills)
        .replace("{{LEVEL}}", "Intermediate to Advanced")
        .replace("{{COUNT_PER_SKILL}}", "4") // Increased count to ensure mix
        .replace("{{LANGUAGE}}", getLanguage())
        .replace("{{SEED}}", uniqueSeed);

    String jsonResponse = geminiService.generateContent(prompt, apiKey);

    if (jsonResponse != null) {
      // Clean up potentially accidentally included markdown
      jsonResponse = jsonResponse.replace("```json", "").replace("```", "").trim();
      try {
        return gson.fromJson(jsonResponse, AssessmentResponse.class);
      } catch (Exception e) {
        System.err.println("Failed to parse Gemini response: " + jsonResponse);
        throw new RuntimeException("Gemini Response Parse Failed", e);
      }
    }

    throw new RuntimeException("Gemini Generation Failed or Returned Empty");
  }
}
