package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "fidelityRatings")
public class FidelityRating {
    @Id
    private String id;
    private String userId;
    private int semester; // 1, 2, 3, 4
    private int year;
    private double semesterRating;
    private double yearlyRating;

    // **Constructors**
    public FidelityRating() {}

    public FidelityRating(String userId, int semester, int year, double semesterRating, double yearlyRating) {
        this.userId = userId;
        this.semester = semester;
        this.year = year;
        this.semesterRating = semesterRating;
        this.yearlyRating = yearlyRating;
    }

    // **Getters and Setters**
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public int getSemester() {
        return semester;
    }

    public int getYear() {
        return year;
    }

    public double getSemesterRating() {
        return semesterRating;
    }

    public double getYearlyRating() {
        return yearlyRating;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setSemesterRating(double semesterRating) {
        this.semesterRating = semesterRating;
    }

    public void setYearlyRating(double yearlyRating) {
        this.yearlyRating = yearlyRating;
    }
}
