// Match.java
package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "matches")
public class Match {
    @Id
    private String id;
    private String datePlayed;
    private List<String> teamA;
    private List<String> teamB;
    private String day;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDatePlayed() {
        return datePlayed;
    }

    public void setDatePlayed(String datePlayed) {
        this.datePlayed = datePlayed;
    }

    public List<String> getTeamA() {
        return teamA;
    }

    public void setTeamA(List<String> teamA) {
        this.teamA = teamA;
    }

    public List<String> getTeamB() {
        return teamB;
    }

    public void setTeamB(List<String> teamB) {
        this.teamB = teamB;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }
}
