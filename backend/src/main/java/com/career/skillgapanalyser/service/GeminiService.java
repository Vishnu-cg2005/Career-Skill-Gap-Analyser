package com.career.skillgapanalyser.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class GeminiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();

    public String generateContent(String prompt, String apiKey) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + apiKey;

        // Construct Request Body
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);

        JsonArray parts = new JsonArray();
        parts.add(part);

        JsonObject content = new JsonObject();
        content.add("parts", parts);

        JsonArray contents = new JsonArray();
        contents.add(content);

        JsonObject requestBody = new JsonObject();
        requestBody.add("contents", contents);

        // Add Generation Config for Randomness
        JsonObject generationConfig = new JsonObject();
        generationConfig.addProperty("temperature", 1.5); // High creativity
        generationConfig.addProperty("maxOutputTokens", 2048);
        generationConfig.addProperty("topP", 0.95);
        generationConfig.addProperty("topK", 40);
        requestBody.add("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(gson.toJson(requestBody), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                return extractTextFromResponse(response.getBody());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String extractTextFromResponse(String responseBody) {
        try {
            JsonObject json = JsonParser.parseString(responseBody).getAsJsonObject();
            return json.getAsJsonArray("candidates")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0).getAsJsonObject()
                    .get("text").getAsString();
        } catch (Exception e) {
            return null;
        }
    }

    public String analyzeResumeWithGemini(String resumeText, String roleId, String blueprint, String apiKey) {
        String prompt = """
                                You are a Domain-Based Skill Gap Analysis Engine.

                                Inputs:
                                1. Resume text (raw text extracted from the uploaded resume)
                                2. Selected domain: "{{ROLE}}"
                                3. Domain skill blueprint containing ONLY the selected domain’s:
                {{BLUEPRINT}}

                                STRICT RULES (MANDATORY):
                                - Do NOT use any fake default skills.
                                - If a Blueprint is provided (listed above), compare STRICTLY against it.
                                - If the Blueprint is MISSING or marked [DYNAMIC MODE], you MUST:
                                   1. GENERATE a high-standard, modern skill list for the domain "{{ROLE}}" (e.g., if 'backend', include Java, Spring, SQL, Docker, AWS).
                                   2. Compare the resume against this generated list.
                                   3. "missingSkills" must ONLY contain skills that are CRITICAL for "{{ROLE}}" and are completely ABSENT from the resume.
                                   4. Do NOT list generic skills like "Communication" or "Teamwork" as missing unless explicitly requested by the domain logic. Focus on HARD SKILLS first.
                                - Infer soft skills ONLY if there is clear evidence in the resume.
                                - If the domain is unknown/random (e.g., "sdfdsf"), ONLY then return no missing skills.
                                - All decisions must be explainable.

                                PROCESS TO FOLLOW:
                                1. Parse the resume text.
                                2. Extract skills.
                                3. Load or Generate Domain Blueprint:
                                   - IF blueprint provided -> Use it.
                                   - IF no blueprint -> Generate standard requirements for "{{ROLE}}".
                                4. Perform Gap Analysis (Mathed vs Missing).
                                5. Build Result.

                                OUTPUT FORMAT (JSON ONLY):
                                {
                                  "domain": "{{ROLE}}",
                                  "overallScore": 80, // 0-100 based on fit
                                  "matchedSkills": {
                                    "technical": ["Skill1", "Skill2"],
                                    "soft": ["Communication"],
                                    "nonTechnical": []
                                  },
                                  "skillScores": {
                                    "Skill1": 85,
                                    "Skill2": 70,
                                    "Communication": 90
                                  },
                                  "missingSkills": {
                                    "technical": ["MissingCriticalSkill1", "MissingCriticalSkill2"],
                                    "soft": [],
                                    "nonTechnical": []
                                  },
                                  "extraSkills": ["ExtraSkill1", "ExtraSkill2"],
                                  "explanations": {
                                    "SkillName": "Short evidence-based reason"
                                  },
                                  "criticalGaps": [
                                     { "skill": "Skill Name", "reason": "Why it is critical", "learningUrl": "https://google.com/search?q=learn+Skill", "sourceName": "Google" }
                                  ],
                                  "roadmap": [
                                     { "title": "Phase 1: Basics", "duration": "2 Weeks", "tasks": ["Learn X"] }
                                  ],
                                  "resumeFeedback": {
                                     "score": 70,
                                     "strengths": ["List strengths"],
                                     "summary": "Summary...",
                                     "missingKeywords": ["List missing"],
                                     "actionableFeedback": [{ "type": "content", "tip": "tip" }]
                                  },
                                  "readinessLevel": "Junior | Mid | Senior",
                                  "gapSummary": "Summary string"
                                }

                                INPUT RESUME:
                                {{RESUME_TEXT}}
                                """;

        prompt = prompt
                .replace("{{ROLE}}", roleId)
                .replace("{{BLUEPRINT}}", blueprint)
                .replace("{{RESUME_TEXT}}", resumeText.substring(0, Math.min(resumeText.length(), 15000)));

        String jsonResponse = generateContent(prompt, apiKey);

        if (jsonResponse != null) {
            try {
                // Map the new JSON structure to the existing AnalysisResponse DTO for frontend
                // compatibility
                JsonObject root = JsonParser.parseString(jsonResponse.replace("```json", "").replace("```", "").trim())
                        .getAsJsonObject();

                com.career.skillgapanalyser.dto.AnalysisResponse.Builder builder = com.career.skillgapanalyser.dto.AnalysisResponse
                        .builder();

                // 0. Parse Overall Score and Skill Scores
                int overallScore = 0;
                if (root.has("overallScore")) {
                    overallScore = root.get("overallScore").getAsInt();
                    builder.overallScore(overallScore);
                }

                java.util.Map<String, Integer> skillScores = new java.util.HashMap<>();
                if (root.has("skillScores")) {
                    JsonObject scoresObj = root.getAsJsonObject("skillScores");
                    for (String key : scoresObj.keySet()) {
                        skillScores.put(key, scoresObj.get(key).getAsInt());
                    }
                    builder.skillScores(skillScores);
                }

                // 1. Flatten Matches + Extras -> Extracted
                java.util.List<com.career.skillgapanalyser.dto.SkillDto> extracted = new java.util.ArrayList<>();

                JsonObject matched = root.has("matchedSkills") ? root.getAsJsonObject("matchedSkills") : null;
                if (matched != null) {
                    if (matched.has("technical"))
                        addSkills(extracted, matched.getAsJsonArray("technical"), "technical", skillScores);
                    if (matched.has("soft"))
                        addSkills(extracted, matched.getAsJsonArray("soft"), "soft", skillScores);
                    if (matched.has("nonTechnical"))
                        addSkills(extracted, matched.getAsJsonArray("nonTechnical"), "professional", skillScores);
                }

                JsonArray extra = root.getAsJsonArray("extraSkills");
                if (extra != null) {
                    for (com.google.gson.JsonElement e : extra) {
                        String name = e.getAsString();
                        int score = skillScores.getOrDefault(name, 50); // Default 50 for extra
                        extracted.add(new com.career.skillgapanalyser.dto.SkillDto(name, "technical",
                                "extra_" + name, score));
                    }
                }
                builder.extracted(extracted);

                // 2. Map Missing
                java.util.List<com.career.skillgapanalyser.dto.SkillDto> missing = new java.util.ArrayList<>();
                if (root.has("missingSkills")) {
                    JsonObject missingObj = root.getAsJsonObject("missingSkills");
                    if (missingObj != null) {
                        if (missingObj.has("technical"))
                            addSkills(missing, missingObj.getAsJsonArray("technical"), "technical", null);
                        if (missingObj.has("soft"))
                            addSkills(missing, missingObj.getAsJsonArray("soft"), "soft", null);
                        if (missingObj.has("nonTechnical"))
                            addSkills(missing, missingObj.getAsJsonArray("nonTechnical"), "professional", null);
                    }
                }
                builder.missing(missing);

                // 3. Map Critical Gaps
                if (root.has("criticalGaps")) {
                    java.lang.reflect.Type listType = new com.google.gson.reflect.TypeToken<java.util.List<com.career.skillgapanalyser.dto.AnalysisResponse.CriticalGap>>() {
                    }.getType();
                    builder.criticalGaps(gson.fromJson(root.get("criticalGaps"), listType));
                }

                // 4. Map Roadmap
                if (root.has("roadmap")) {
                    java.lang.reflect.Type listType = new com.google.gson.reflect.TypeToken<java.util.List<com.career.skillgapanalyser.dto.AnalysisResponse.RoadmapPhase>>() {
                    }.getType();
                    builder.roadmap(gson.fromJson(root.get("roadmap"), listType));
                }

                // 5. Map Feedback
                if (root.has("resumeFeedback")) {
                    builder.resumeFeedback(gson.fromJson(root.get("resumeFeedback"),
                            com.career.skillgapanalyser.dto.AnalysisResponse.ResumeFeedback.class));
                }

                // 6. Others
                if (root.has("readinessLevel"))
                    builder.readinessLevel(root.get("readinessLevel").getAsString());
                if (root.has("gapSummary"))
                    builder.gapSummary(root.get("gapSummary").getAsString());

                // Serialize back to JSON string to match the return type expected by
                // ResumeService which deserializes it again
                // Ideally ResumeService should accept the object, but we are fixing
                // 'analyzeResumeWithGemini' which returns String in the interface (implied by
                // usage)
                // Wait, the original method returned String (JSON). ResumeService parses it.
                // So we must return the JSON string corresponding to ANALYSIS_RESPONSE
                // structure, NOT the user's strict structure.
                // So we re-serialize effectively translation: AI_JSON -> DTO -> CLIENT_JSON

                return gson.toJson(builder.build());

            } catch (Exception e) {
                System.err.println("Error mapping Gemini response: " + e.getMessage());
                e.printStackTrace();
                return null; // Force fallback to Static Analysis (SkillExtractor)
            }
        }
        return null;
    }

    private void addSkills(java.util.List<com.career.skillgapanalyser.dto.SkillDto> list, JsonArray array,
            String type, java.util.Map<String, Integer> scores) {
        if (array == null)
            return;
        for (com.google.gson.JsonElement e : array) {
            String name = e.getAsString();
            int score = (scores != null) ? scores.getOrDefault(name, 0) : 0;
            list.add(new com.career.skillgapanalyser.dto.SkillDto(name, type, "id_" + name, score));
        }
    }

    public String localizeContent(String content, String targetLanguage, String apiKey) {
        if ("English".equalsIgnoreCase(targetLanguage) || "en".equalsIgnoreCase(targetLanguage)
                || targetLanguage == null) {
            return content; // No op if English
        }
        String prompt = "Translate the following JSON or Text content to " + targetLanguage
                + ". Preserve the JSON structure EXACTLY if it is JSON. Only translate values, not keys:\n\n" + content;
        return generateContent(prompt, apiKey);
    }
}
