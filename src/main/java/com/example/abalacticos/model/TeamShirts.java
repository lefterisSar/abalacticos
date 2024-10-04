package com.example.abalacticos.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeamShirts {
    private final String color;
    private int wins;
    private int draws;
    private int losses;
    private int totalAppearances;

    // Constructor
    public TeamShirts(String color) {
        this.color = color;
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

