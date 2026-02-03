package com.career.skillgapanalyser.controller;

import com.career.skillgapanalyser.dto.LanguagePreferenceDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LanguageController {

    private static final String COOKIE_NAME = "app_language";

    @GetMapping("/language")
    public LanguagePreferenceDto getLanguage(@CookieValue(value = COOKIE_NAME, defaultValue = "en") String language) {
        // Basic validation
        if (language == null || language.isEmpty()) {
            language = "en";
        }
        return new LanguagePreferenceDto(language);
    }

    @PostMapping("/language")
    public LanguagePreferenceDto setLanguage(@RequestBody LanguagePreferenceDto request, HttpServletResponse response) {
        String lang = request.getLanguage();

        if (lang == null || !lang.matches("^[a-z]{2,5}$")) {
            throw new IllegalArgumentException("Invalid language code: " + lang);
        }

        Cookie cookie = new Cookie(COOKIE_NAME, lang);
        cookie.setPath("/");
        cookie.setHttpOnly(false); // Accessible to JS if needed, though we use API
        cookie.setMaxAge(60 * 60 * 24 * 365); // 1 year
        // cookie.setSecure(true); // Enable in production with HTTPS

        response.addCookie(cookie);

        return new LanguagePreferenceDto(lang);
    }
}
