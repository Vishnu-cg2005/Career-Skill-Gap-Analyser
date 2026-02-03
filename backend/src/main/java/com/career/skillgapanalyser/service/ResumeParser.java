package com.career.skillgapanalyser.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class ResumeParser {

    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null)
            return "";

        String lowerCaseName = filename.toLowerCase();

        try (InputStream is = file.getInputStream()) {
            if (lowerCaseName.endsWith(".pdf")) {
                return parsePdf(is);
            } else if (lowerCaseName.endsWith(".docx")) {
                return parseDocx(is);
            } else if (lowerCaseName.endsWith(".txt")) {
                return new String(is.readAllBytes());
            }
        }
        return "";
    }

    private String parsePdf(InputStream is) throws IOException {
        try (PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String parseDocx(InputStream is) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(is)) {
            StringBuilder text = new StringBuilder();
            List<XWPFParagraph> paragraphs = doc.getParagraphs();
            for (XWPFParagraph para : paragraphs) {
                text.append(para.getText()).append("\n");
            }
            return text.toString();
        }
    }
}
