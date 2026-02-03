package com.career.skillgapanalyser.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssessmentRequest {
    private List<String> skills;
    private String role;
}
