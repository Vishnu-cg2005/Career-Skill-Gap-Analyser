package com.career.skillgapanalyser.service;

import com.career.skillgapanalyser.dto.AnalysisResponse;
import com.career.skillgapanalyser.dto.SkillDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillExtractor {

    private SkillData skillData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("skills.json");
            skillData = objectMapper.readValue(resource.getInputStream(), SkillData.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load skills.json", e);
        }
    }

    /**
     * MODULE: Domain Skill Blueprint Loader
     * Retrieves the strict skill requirements for a specific domain.
     */
    public SkillData.RoleDef getRoleDefinition(String roleId) {
        if (roleId == null)
            return null;

        String normalizedInput = roleId.toLowerCase().replace(" ", "").replace("-", "").trim();

        // 1. Exact match
        SkillData.RoleDef targetRole = skillData.roles.get(normalizedInput);

        // 2. Fuzzy match
        if (targetRole == null) {
            for (String key : skillData.roles.keySet()) {
                String normalizedKey = key.toLowerCase().replace(" ", "").replace("-", "");
                if (normalizedInput.contains(normalizedKey) || normalizedKey.contains(normalizedInput)) {
                    targetRole = skillData.roles.get(key);
                    break;
                }
            }
        }
        return targetRole;
    }

    public AnalysisResponse analyze(String resumeText, String roleId) {
        String lowerDate = resumeText.toLowerCase();
        List<SkillDto> extractedSkills = new ArrayList<>();
        Set<String> foundSkillNames = new HashSet<>();

        // 1. Extract Skills (Keyword Matching Engine)
        for (SkillDef skill : skillData.skills) {
            for (String keyword : skill.keywords) {
                if (lowerDate.contains(keyword.toLowerCase())) {
                    if (!foundSkillNames.contains(skill.name)) {
                        extractedSkills.add(new SkillDto(skill.name, skill.type, "id_" + skill.name));
                        foundSkillNames.add(skill.name);
                    }
                    break;
                }
            }
        }

        // 2. Load Blueprint
        SkillData.RoleDef targetRole = getRoleDefinition(roleId);

        // 3. Gap Analysis
        List<SkillDto> missingSkills = new ArrayList<>();
        List<AnalysisResponse.CriticalGap> criticalGaps = new ArrayList<>();

        int totalReq = 0;
        long requiredFound = 0;

        if (targetRole != null) {
            checkGaps(targetRole.tech, foundSkillNames, missingSkills, criticalGaps, "technical");
            checkGaps(targetRole.soft, foundSkillNames, missingSkills, criticalGaps, "soft");
            checkGaps(targetRole.prof, foundSkillNames, missingSkills, criticalGaps, "professional");

            totalReq = (targetRole.tech != null ? targetRole.tech.size() : 0) +
                    (targetRole.soft != null ? targetRole.soft.size() : 0) +
                    (targetRole.prof != null ? targetRole.prof.size() : 0);

            requiredFound = foundSkillNames.stream()
                    .filter(n -> (targetRole.tech != null && targetRole.tech.contains(n)) ||
                            (targetRole.soft != null && targetRole.soft.contains(n)) ||
                            (targetRole.prof != null && targetRole.prof.contains(n)))
                    .count();
        }

        int score = totalReq == 0 ? 0 : (int) ((double) requiredFound / totalReq * 100);
        if (score > 100)
            score = 100;
        if (score < 40 && totalReq > 0)
            score = 40;

        String readiness = score > 80 ? "Senior" : score > 60 ? "Mid-Level" : "Junior";

        List<AnalysisResponse.RoadmapPhase> roadmap = new ArrayList<>();
        if (!criticalGaps.isEmpty()) {
            roadmap.add(new AnalysisResponse.RoadmapPhase(
                    "Phase 1: Immediate Gaps",
                    "2 Weeks",
                    criticalGaps.stream().limit(3).map(g -> "Learn " + g.getSkill()).collect(Collectors.toList())));
        }

        // Populate skillScores map for frontend compatibility
        Map<String, Integer> skillScoresMap = new HashMap<>();
        for (SkillDto skill : extractedSkills) {
            skill.setScore(100); // Static analysis assumes "Found" = 100% match
            skillScoresMap.put(skill.getName(), 100);
        }

        return AnalysisResponse.builder()
                .extracted(extractedSkills)
                .missing(missingSkills)
                .criticalGaps(criticalGaps)
                .readinessLevel(readiness)
                .gapSummary(criticalGaps.isEmpty() ? "Great match!" : "Missing critical skills: " + criticalGaps.size())
                .roadmap(roadmap)
                .overallScore(score) // Use calculated score
                .skillScores(skillScoresMap)
                .resumeFeedback(AnalysisResponse.ResumeFeedback.builder()
                        .score(score)
                        .strengths(
                                extractedSkills.stream().limit(3).map(SkillDto::getName).collect(Collectors.toList()))
                        .summary("Analysis based on extracted text.")
                        .missingKeywords(missingSkills.stream().map(SkillDto::getName).collect(Collectors.toList()))
                        .actionableFeedback(List.of(new AnalysisResponse.ActionableTip("content",
                                "Ensure keywords match standard terminology.")))
                        .build())
                .build();
    }

    private void checkGaps(List<String> required, Set<String> found,
            List<SkillDto> missingToList,
            List<AnalysisResponse.CriticalGap> gapsToList,
            String type) {
        if (required == null)
            return;
        for (String req : required) {
            if (!found.contains(req)) {
                missingToList.add(new SkillDto(req, type, "miss_" + req));
                gapsToList.add(new AnalysisResponse.CriticalGap(
                        req, "Required for this role but not found.", "https://google.com/search?q=" + req, "Docs"));
            }
        }
    }

    // Helper classes for JSON mapping
    public static class SkillData {
        public List<SkillDef> skills;
        public Map<String, RoleDef> roles;

        public static class RoleDef {
            public List<String> tech = new ArrayList<>();
            public List<String> soft = new ArrayList<>();
            public List<String> prof = new ArrayList<>();
        }
    }

    public static class SkillDef {
        public String name;
        public String type;
        public List<String> keywords;
    }
}
