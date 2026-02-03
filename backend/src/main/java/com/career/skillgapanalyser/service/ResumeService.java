package com.career.skillgapanalyser.service;

import com.career.skillgapanalyser.dto.AnalysisResponse;
import com.google.gson.Gson;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeService {

    private final ResumeParser resumeParser;
    private final SkillExtractor skillExtractor;
    private final GeminiService geminiService;
    private final Gson gson = new Gson();

    public ResumeService(ResumeParser resumeParser, SkillExtractor skillExtractor, GeminiService geminiService) {
        this.resumeParser = resumeParser;
        this.skillExtractor = skillExtractor;
        this.geminiService = geminiService;
    }

    public AnalysisResponse analyzeResume(MultipartFile file, String roleId, String apiKey) throws IOException {
        // MODULE 1: Resume Ingestion Module
        // (Handled by Controller + MultipartFile input)

        // MODULE 2: Resume Parsing Engine
        String text = resumeParser.extractText(file);
        if (text == null || text.trim().isEmpty()) {
            return new AnalysisResponse(); // Return empty response instead of failing
        }

        // Clean API Key if it came as "null" string from frontend
        if ("null".equals(apiKey)) {
            apiKey = null;
        }

        // MODULE 3: Skill Normalization Engine (Pre-processing)
        if (apiKey != null && !apiKey.isEmpty()) {
            try {
                // Ensure text is English for consistent analysis
                String prompt = "Translate to English if needed. Return content as is if already English:\n" + text;
                String translated = geminiService.generateContent(prompt, apiKey);
                if (translated != null)
                    text = translated;
            } catch (Exception e) {
                // Ignore translation errors
            }
        }

        // MODULE 4: Domain Context Resolver
        // (Resolved via 'roleId' input and fuzzy matching in SkillExtractor)

        // MODULE 5: Domain Skill Blueprint Loader
        SkillExtractor.SkillData.RoleDef blueprint = skillExtractor.getRoleDefinition(roleId);

        // Prepare Blueprint String for AI
        String blueprintJson = "   [DYNAMIC MODE] Strict Blueprint not found in database. Please infer industry standards for this role.";
        if (blueprint != null) {
            blueprintJson = "   - Technical: " + gson.toJson(blueprint.tech) + "\n" +
                    "   - Soft: " + gson.toJson(blueprint.soft) + "\n" +
                    "   - Professional: " + gson.toJson(blueprint.prof);
        }

        // MODULE 6: Skill Extraction Engine
        // MODULE 7: Skill Matching Engine
        // MODULE 8: Skill Gap Analysis Engine
        // MODULE 9: Missing Skill Identifier
        // (All performed by the AI Engine with the Strict Blueprint)

        String aiErrorMsg = null;
        if (apiKey != null && !apiKey.isEmpty()) {
            try {
                String aiResponse = geminiService.analyzeResumeWithGemini(text, roleId, blueprintJson, apiKey);
                if (aiResponse != null) {
                    aiResponse = aiResponse.replace("```json", "").replace("```", "").trim();
                    AnalysisResponse response = gson.fromJson(aiResponse, AnalysisResponse.class);

                    // Localization Post-Processing
                    String language = org.springframework.context.i18n.LocaleContextHolder.getLocale().getLanguage();
                    if (!"en".equalsIgnoreCase(language)) {
                        String json = gson.toJson(response);
                        String localizedJson = geminiService.localizeContent(json, language, apiKey);
                        if (localizedJson != null) {
                            localizedJson = localizedJson.replace("```json", "").replace("```", "").trim();
                            return gson.fromJson(localizedJson, AnalysisResponse.class);
                        }
                    }
                    return response;
                }
            } catch (Exception e) {
                System.err.println("AI Engine Failed: " + e.getMessage());
                aiErrorMsg = "AI Engine Failed: " + e.getMessage();
            }
        }

        // Fallback: Static Analysis Logic
        AnalysisResponse staticResponse = skillExtractor.analyze(text, roleId);

        if (aiErrorMsg != null) {
            return AnalysisResponse.builder()
                    .extracted(staticResponse.getExtracted())
                    .missing(staticResponse.getMissing())
                    .criticalGaps(staticResponse.getCriticalGaps())
                    .roadmap(staticResponse.getRoadmap())
                    .resumeFeedback(staticResponse.getResumeFeedback())
                    .readinessLevel(staticResponse.getReadinessLevel())
                    .gapSummary(staticResponse.getGapSummary())
                    .overallScore(staticResponse.getOverallScore())
                    .skillScores(staticResponse.getSkillScores())
                    .aiError(aiErrorMsg)
                    .build();
        }
        return staticResponse;
    }
}
