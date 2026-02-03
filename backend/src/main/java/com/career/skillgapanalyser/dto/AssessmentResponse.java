package com.career.skillgapanalyser.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssessmentResponse {
    private String difficulty;
    private List<Question> questions;

    @Data
    public static class Question {
        private String id;
        private String type; // MCQ | SCENARIO
        private String question;
        private String codeSnippet; // For programming questions
        private List<String> options;
        private Integer correctAnswerIndex;
        private String skill;
    }
}
