package com.career.skillgapanalyser.dto;

public class SkillDto {
    private String name;
    private String type; // technical, soft, professional
    private String id;
    private int score; // 0-100

    public SkillDto() {
    }

    public SkillDto(String name, String type, String id, int score) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.score = score;
    }

    // Legacy constructor compatibility
    public SkillDto(String name, String type, String id) {
        this(name, type, id, 0); // Default score 0
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "SkillDto{" +
                "name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", id='" + id + '\'' +
                ", score=" + score +
                '}';
    }
}
