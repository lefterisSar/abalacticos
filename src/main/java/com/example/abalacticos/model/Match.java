// Match.java
package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "matches")
public class Match {
    @Id
    private String username;
    private String datePlayed;
    private List<String> teamA;
    private List<String> teamB;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
}
