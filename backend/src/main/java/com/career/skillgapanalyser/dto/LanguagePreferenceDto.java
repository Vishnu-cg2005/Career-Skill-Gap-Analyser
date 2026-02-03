package com.career.skillgapanalyser.dto;

public class LanguagePreferenceDto {
    private String language;

    public LanguagePreferenceDto() {
    }

    public LanguagePreferenceDto(String language) {
        this.language = language;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
