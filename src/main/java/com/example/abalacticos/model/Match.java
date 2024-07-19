package com.example.abalacticos.model;

import jakarta.persistence.criteria.ListJoin;

import java.util.Date;
import java.util.List;

public class Match {
    private String matchId;
    private Date date;
    private List<String> teamA;
    private List<String> teamB;
    private int goalsTeamA;
    private int goalsTeamB;
    private List<PlayerPerformance> playerStats;
    private DayDifficulty dayDifficulty;

    public Match(String matchId, Date date, List<String> teamA, List<String> teamB, int goalsTeamA, int goalsTeamB, List<PlayerPerformance> playerStats, DayDifficulty dayDifficulty){
        this.matchId = matchId;
        this.date = date;
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsTeamA = 0;
        this.goalsTeamB = 0;
        this.playerStats = playerStats;
        this.dayDifficulty = dayDifficulty;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public DayDifficulty getDayDifficulty() {
        return dayDifficulty;
    }

    public void setDayDifficulty(DayDifficulty dayDifficulty) {
        this.dayDifficulty = dayDifficulty;
    }

    public int getGoalsTeamA() {
        return goalsTeamA;
    }

    public void setGoalsTeamA(int goalsTeamA) {
        this.goalsTeamA = goalsTeamA;
    }

    public int getGoalsTeamB() {
        return goalsTeamB;
    }

    public void setGoalsTeamB(int goalsTeamB) {
        this.goalsTeamB = goalsTeamB;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public List<PlayerPerformance> getPlayerStats() {
        return playerStats;
    }

    public void setPlayerStats(List<PlayerPerformance> playerStats) {
        this.playerStats = playerStats;
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

    //Update the score
    public void updateScore(int goalsTeamA, int goalsTeamB) {
        this.goalsTeamA = goalsTeamA;
        this.goalsTeamB = goalsTeamB;
    }

    //input PlayerPerformance
    public void addPlayerPerformance(PlayerPerformance performance){
        for (int i=0; i < playerStats.size(); i++) {
            if (playerStats.get(i).getPlayerId().equals(performance.getPlayerId())) {
                playerStats.set(i, performance);
                return;
            }
        }
        playerStats.add(performance);
    }

    /* gia to validation tou teamA, teamB, twn statistikwn, tis dyskolias
    public boolean validate
    */


}
