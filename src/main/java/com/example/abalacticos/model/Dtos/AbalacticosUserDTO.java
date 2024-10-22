package com.example.abalacticos.model.Dtos;

import java.time.LocalDateTime;
import java.util.List;

public class AbalacticosUserDTO {
    private String id;
    private String username;
    private List<String> unavailableDates;
    private String name;
    private String surname;
    private String lastGK;
    private int overallApps;
    private List<String> availability;
    private int tuesdayAppearances;
    private int wednesdayAppearances;
    private int fridayAppearances;
    private boolean absent;
    private boolean injured;
    private boolean available;
    private boolean isBanned;

    private List<MatchParticipation> matchParticipations;



    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getUnavailableDates() {
        return unavailableDates;
    }

    public void setUnavailableDates(List<String> unavailableDates) {
        this.unavailableDates = unavailableDates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getLastGK() {
        return lastGK;
    }

    public void setLastGK(String lastGK) {
        this.lastGK = lastGK;
    }

    public int getOverallApps() {
        return overallApps;
    }

    public void setOverallApps(int overallApps) {
        this.overallApps = overallApps;
    }

    public List<String> getAvailability() {
        return availability;
    }

    public void setAvailability(List<String> availability) {
        this.availability = availability;
    }

    public int getTuesdayAppearances() {
        return tuesdayAppearances;
    }

    public void setTuesdayAppearances(int tuesdayAppearances) {
        this.tuesdayAppearances = tuesdayAppearances;
    }

    public int getWednesdayAppearances() {
        return wednesdayAppearances;
    }

    public void setWednesdayAppearances(int wednesdayAppearances) {
        this.wednesdayAppearances = wednesdayAppearances;
    }

    public int getFridayAppearances() {
        return fridayAppearances;
    }

    public void setFridayAppearances(int fridayAppearances) {
        this.fridayAppearances = fridayAppearances;
    }

    public boolean isAbsent() {
        return absent;
    }

    public void setAbsent(boolean absent) {
        this.absent = absent;
    }

    public boolean isInjured() {
        return injured;
    }

    public void setInjured(boolean injured) {
        this.injured = injured;
    }


    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public boolean isBanned() {
        return isBanned;
    }

    public void setBanned(boolean isBanned) {
        this.isBanned = isBanned;
    }

    public static class MatchParticipation {
        private String matchId;
        private String status; // "waiting", "confirmed", "absent", "declined"
        private LocalDateTime invitationSentTime;
        private LocalDateTime responseTime;

        // **Constructors**
        public MatchParticipation() {}

        public MatchParticipation(String matchId, String status, LocalDateTime invitationSentTime) {
            this.matchId = matchId;
            this.status = status;
            this.invitationSentTime = invitationSentTime;
        }

        public String getMatchId() {
            return matchId;
        }

        public void setMatchId(String matchId) {
            this.matchId = matchId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getInvitationSentTime() {
            return invitationSentTime;
        }

        public void setInvitationSentTime(LocalDateTime invitationSentTime) {
            this.invitationSentTime = invitationSentTime;
        }

        public LocalDateTime getResponseTime() {
            return responseTime;
        }

        public void setResponseTime(LocalDateTime responseTime) {
            this.responseTime = responseTime;
        }
    }

    // **Getters and Setters for `matchParticipations`**
    public List<MatchParticipation> getMatchParticipations() {
    return matchParticipations;
    }

    public void setMatchParticipations(List<MatchParticipation> matchParticipations) {
    this.matchParticipations = matchParticipations;
    }
}

