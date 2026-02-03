package com.career.skillgapanalyser.controller;

import com.career.skillgapanalyser.dto.AssessmentRequest;
import com.career.skillgapanalyser.dto.AssessmentResponse;
import com.career.skillgapanalyser.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessment")
@CrossOrigin(origins = "*")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @org.springframework.beans.factory.annotation.Value("${gemini.api.key}")
    private String configuredApiKey;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/generate")
    public ResponseEntity<AssessmentResponse> generateAssessment(
            @RequestBody AssessmentRequest request,
            @RequestHeader(value = "X-Gemini-API-Key", required = false) String apiKey) {

        String effectiveKey = (apiKey != null && !apiKey.isEmpty()) ? apiKey : configuredApiKey;

        if (effectiveKey == null || effectiveKey.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AssessmentResponse response = assessmentService.generateAssessment(request, effectiveKey);
        return ResponseEntity.ok(response);
    }
}
