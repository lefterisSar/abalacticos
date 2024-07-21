package com.example.abalacticos.model;

public class PlayerPerformance {
    private String playerId;
    private Match match;
    private double peerEvaluation;
    private String positionPlayed;
    private double positionFactor;
    private double calculatedPerformanceScore;

    public PlayerPerformance(String playerId, Match match, double peerEvaluation, String positionPlayed, double positionFactor) {
        this.playerId = playerId;
        this.match = match;
        this.peerEvaluation = peerEvaluation;
        this.positionPlayed = positionPlayed;
        this.positionFactor = positionFactor;
        this.calculatedPerformanceScore = calculatePerformanceScore(); // Correct method call
    }

    private double calculatePerformanceScore() {
        return peerEvaluation * positionFactor;
    }

    public void applyDecayingFactor(double decayRate, int timeElapsed) {
        this.calculatedPerformanceScore *= Math.pow(1 - decayRate, timeElapsed);
    }

    // Getters for all fields
    public String getPlayerId() {
        return playerId;
    }

    public Match getMatch() {
        return match;
    }

    public double getPeerEvaluation() {
        return peerEvaluation;
    }

    public String getPositionPlayed() {
        return positionPlayed;
    }

    public double getPositionFactor() {
        return positionFactor;
    }

    public double getCalculatedPerformanceScore() {
        return calculatedPerformanceScore;
    }
}