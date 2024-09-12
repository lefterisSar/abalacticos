package com.example.abalacticos.model;



public class TeamShirts {
    private String color;  // The shirt color (e.g., "red", "light_blue")
    private int wins;
    private int draws;
    private int losses;
    private int totalAppearances;

    // Constructor
    public TeamShirts(String color) {
        this.color = color;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.totalAppearances = 0;
    }

    // Getters and setters
    public String getColor() {
        return color;
    }

    public int getWins() {
        return wins;
    }

    public int getDraws() {
        return draws;
    }

    public int getLosses() {
        return losses;
    }

    public int getTotalAppearances() {
        return totalAppearances;
    }

    // Methods to increment stats
    public void incrementWins() {
        this.wins++;
    }

    public void incrementDraws() {
        this.draws++;
    }

    public void incrementLosses() {
        this.losses++;
    }

    public void incrementAppearances() {
        this.totalAppearances++;
    }
}

