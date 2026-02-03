package com.career.skillgapanalyser.controller;

import com.career.skillgapanalyser.dto.AnalysisResponse;
import com.career.skillgapanalyser.service.ResumeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*") // Allow frontend access
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "roleId", defaultValue = "backend") String roleId,
            @RequestHeader(value = "X-Gemini-API-Key", required = false) String apiKey) {

        try {
            AnalysisResponse response = resumeService.analyzeResume(file, roleId, apiKey);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
