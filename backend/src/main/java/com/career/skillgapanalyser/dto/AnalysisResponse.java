package com.career.skillgapanalyser.dto;

import java.util.List;

public class AnalysisResponse {
    private List<SkillDto> extracted;
    private List<SkillDto> missing;
    private List<CriticalGap> criticalGaps;
    private List<RoadmapPhase> roadmap;
    private ResumeFeedback resumeFeedback;
    private String readinessLevel;
    private String gapSummary;
    private int overallScore; // 0-100
    private java.util.Map<String, Integer> skillScores; // Explicit map for frontend
    private String aiError; // New field for error reporting

    public AnalysisResponse() {
    }

    public AnalysisResponse(List<SkillDto> extracted, List<SkillDto> missing, List<CriticalGap> criticalGaps,
            List<RoadmapPhase> roadmap, ResumeFeedback resumeFeedback, String readinessLevel, String gapSummary,
            int overallScore, java.util.Map<String, Integer> skillScores, String aiError) {
        this.extracted = extracted;
        this.missing = missing;
        this.criticalGaps = criticalGaps;
        this.roadmap = roadmap;
        this.resumeFeedback = resumeFeedback;
        this.readinessLevel = readinessLevel;
        this.gapSummary = gapSummary;
        this.overallScore = overallScore;
        this.skillScores = skillScores;
        this.aiError = aiError;
    }

    public static Builder builder() {
        return new Builder();
    }

    public List<SkillDto> getExtracted() {
        return extracted;
    }

    public List<SkillDto> getMissing() {
        return missing;
    }

    public List<CriticalGap> getCriticalGaps() {
        return criticalGaps;
    }

    public List<RoadmapPhase> getRoadmap() {
        return roadmap;
    }

    public ResumeFeedback getResumeFeedback() {
        return resumeFeedback;
    }

    public String getReadinessLevel() {
        return readinessLevel;
    }

    public String getGapSummary() {
        return gapSummary;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public java.util.Map<String, Integer> getSkillScores() {
        return skillScores;
    }

    public String getAiError() {
        return aiError;
    }

    @Override
    public String toString() {
        return "AnalysisResponse{" +
                "extracted=" + extracted +
                ", missing=" + missing +
                ", criticalGaps=" + criticalGaps +
                ", roadmap=" + roadmap +
                ", resumeFeedback=" + resumeFeedback +
                ", readinessLevel='" + readinessLevel + '\'' +
                ", gapSummary='" + gapSummary + '\'' +
                '}';
    }

    public static class Builder {
        private List<SkillDto> extracted;
        private List<SkillDto> missing;
        private List<CriticalGap> criticalGaps;
        private List<RoadmapPhase> roadmap;
        private ResumeFeedback resumeFeedback;
        private String readinessLevel;
        private String gapSummary;
        private int overallScore;
        private java.util.Map<String, Integer> skillScores;
        private String aiError;

        public Builder extracted(List<SkillDto> extracted) {
            this.extracted = extracted;
            return this;
        }

        // ... (Skipping middle methods for brevity if they match context, but here I
        // must match context strictly.
        // Since I can't jump lines in ReplacementContent easily without context, I will
        // just add the setter and update build())

        // Wait, I need to match the whole block or insert carefully.
        // I'll insert variables at top of Builder.

        public Builder missing(List<SkillDto> missing) {
            this.missing = missing;
            return this;
        }

        public Builder criticalGaps(List<CriticalGap> criticalGaps) {
            this.criticalGaps = criticalGaps;
            return this;
        }

        public Builder roadmap(List<RoadmapPhase> roadmap) {
            this.roadmap = roadmap;
            return this;
        }

        public Builder resumeFeedback(ResumeFeedback resumeFeedback) {
            this.resumeFeedback = resumeFeedback;
            return this;
        }

        public Builder readinessLevel(String readinessLevel) {
            this.readinessLevel = readinessLevel;
            return this;
        }

        public Builder gapSummary(String gapSummary) {
            this.gapSummary = gapSummary;
            return this;
        }

        public Builder overallScore(int overallScore) {
            this.overallScore = overallScore;
            return this;
        }

        public Builder skillScores(java.util.Map<String, Integer> skillScores) {
            this.skillScores = skillScores;
            return this;
        }

        public Builder aiError(String aiError) {
            this.aiError = aiError;
            return this;
        }

        public AnalysisResponse build() {
            return new AnalysisResponse(extracted, missing, criticalGaps, roadmap, resumeFeedback, readinessLevel,
                    gapSummary, overallScore, skillScores, aiError);
        }
    }

    public static class CriticalGap {
        private String skill;
        private String reason;
        private String learningUrl;
        private String sourceName;

        public CriticalGap() {
        }

        public CriticalGap(String skill, String reason, String learningUrl, String sourceName) {
            this.skill = skill;
            this.reason = reason;
            this.learningUrl = learningUrl;
            this.sourceName = sourceName;
        }

        public String getSkill() {
            return skill;
        }

        public String getReason() {
            return reason;
        }

        public String getLearningUrl() {
            return learningUrl;
        }

        public String getSourceName() {
            return sourceName;
        }

        @Override
        public String toString() {
            return "CriticalGap{" +
                    "skill='" + skill + '\'' +
                    ", reason='" + reason + '\'' +
                    ", learningUrl='" + learningUrl + '\'' +
                    ", sourceName='" + sourceName + '\'' +
                    '}';
        }
    }

    public static class RoadmapPhase {
        private String title;
        private String duration;
        private List<String> tasks;

        public RoadmapPhase() {
        }

        public RoadmapPhase(String title, String duration, List<String> tasks) {
            this.title = title;
            this.duration = duration;
            this.tasks = tasks;
        }

        public String getTitle() {
            return title;
        }

        public String getDuration() {
            return duration;
        }

        public List<String> getTasks() {
            return tasks;
        }

        @Override
        public String toString() {
            return "RoadmapPhase{" +
                    "title='" + title + '\'' +
                    ", duration='" + duration + '\'' +
                    ", tasks=" + tasks +
                    '}';
        }
    }

    public static class ResumeFeedback {
        private int score;
        private List<String> strengths;
        private String summary;
        private List<String> missingKeywords;
        private List<ActionableTip> actionableFeedback;

        public ResumeFeedback() {
        }

        public ResumeFeedback(int score, List<String> strengths, String summary, List<String> missingKeywords,
                List<ActionableTip> actionableFeedback) {
            this.score = score;
            this.strengths = strengths;
            this.summary = summary;
            this.missingKeywords = missingKeywords;
            this.actionableFeedback = actionableFeedback;
        }

        public static Builder builder() {
            return new Builder();
        }

        public int getScore() {
            return score;
        }

        public List<String> getStrengths() {
            return strengths;
        }

        public String getSummary() {
            return summary;
        }

        public List<String> getMissingKeywords() {
            return missingKeywords;
        }

        public List<ActionableTip> getActionableFeedback() {
            return actionableFeedback;
        }

        @Override
        public String toString() {
            return "ResumeFeedback{" +
                    "score=" + score +
                    ", strengths=" + strengths +
                    ", summary='" + summary + '\'' +
                    ", missingKeywords=" + missingKeywords +
                    ", actionableFeedback=" + actionableFeedback +
                    '}';
        }

        public static class Builder {
            private int score;
            private List<String> strengths;
            private String summary;
            private List<String> missingKeywords;
            private List<ActionableTip> actionableFeedback;

            public Builder score(int score) {
                this.score = score;
                return this;
            }

            public Builder strengths(List<String> strengths) {
                this.strengths = strengths;
                return this;
            }

            public Builder summary(String summary) {
                this.summary = summary;
                return this;
            }

            public Builder missingKeywords(List<String> missingKeywords) {
                this.missingKeywords = missingKeywords;
                return this;
            }

            public Builder actionableFeedback(List<ActionableTip> actionableFeedback) {
                this.actionableFeedback = actionableFeedback;
                return this;
            }

            public ResumeFeedback build() {
                return new ResumeFeedback(score, strengths, summary, missingKeywords, actionableFeedback);
            }
        }
    }

    public static class ActionableTip {
        private String type;
        private String tip;

        public ActionableTip() {
        }

        public ActionableTip(String type, String tip) {
            this.type = type;
            this.tip = tip;
        }

        public String getType() {
            return type;
        }

        public String getTip() {
            return tip;
        }

        @Override
        public String toString() {
            return "ActionableTip{" +
                    "type='" + type + '\'' +
                    ", tip='" + tip + '\'' +
                    '}';
        }
    }
}
