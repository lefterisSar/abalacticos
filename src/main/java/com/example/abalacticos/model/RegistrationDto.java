package com.example.abalacticos.model;


import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class RegistrationDto {

        @NotEmpty
        private String username;
        @NotEmpty
        private String password;
        @NotEmpty
        private String email;
        private String role;
        // Player attributes
        private String name;
        private String surname;
        private int age;
        private String debutDate;
        private String lastGK;
        private int wins;
        private int losses;
        private int draws;
        private String invitationFriend;
        private String favClub;
        private String sn;
        private String birthday;
        private int overallApps;
        private List<String> availability;

    public int getOverallApps() {
        return overallApps;
    }

    public void setOverallApps(int overallApps) {
        this.overallApps = overallApps;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDebutDate() {
        return debutDate;
    }

    public void setDebutDate(String debutDate) {
        this.debutDate = debutDate;
    }

    public String getLastGK() {
        return lastGK;
    }

    public void setLastGK(String lastGK) {
        this.lastGK = lastGK;
    }

    public String getInvitationFriend() {
        return invitationFriend;
    }

    public void setInvitationFriend(String invitationFriend) {
        this.invitationFriend = invitationFriend;
    }

    public String getFavClub() {
        return favClub;
    }

    public void setFavClub(String favClub) {
        this.favClub = favClub;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public CommunicationDetails getCommunicationDetails() {
        return communicationDetails;
    }

    public void setCommunicationDetails(CommunicationDetails communicationDetails) {
        this.communicationDetails = communicationDetails;
    }

    private CommunicationDetails communicationDetails;

        // Getters and Setters


    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public List<String> getAvailability() {
        return availability;
    }

    public void setAvailability(List<String> availability) {
        this.availability = availability;
    }
}
