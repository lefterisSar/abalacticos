package com.example.abalacticos.model;

import jakarta.persistence.ElementCollection;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;

@Document(collection = "abalacticos_users")
public class AbalacticosUser {
    @Id
    private String id;
    private String username;
    private String password;
    private String roles; // For simplicity, assume single role

    // Player attributes
    private String name;
    private String surname;
    private int wins;
    private int losses;
    private int draws;
    //
    private String debutDate;
    private String lastGK;

    private int overallApps;

    private String invitationFriend;
    private String favClub;
    private String sn;
    private String birthday;
    private CommunicationDetails communicationDetails;
    private List<String> availability;
    private int tuesdayAppearances;
    private int wednesdayAppearances;
    private int fridayAppearances;
    private String discordID;

    @ElementCollection
    private List<String> absentDates = new ArrayList<>();


    public AbalacticosUser() {}

    // Constructors, Getters, and Setters
    public AbalacticosUser(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public AbalacticosUser(String username, String password, String roles)
    {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

    public AbalacticosUser(String username, String password, String roles, int wins, int draws, int losses) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
    }

    public AbalacticosUser(String username, String password, String name, String surname,  String roles, int wins, int draws, int losses) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.surname =surname;
        this.name = name;

    }




    // Getters and Setters for all fields

    public String getDiscordID() {
        return discordID;
    }

    public void setDiscordID(String discordID) {
        this.discordID = discordID;
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


    // Getters and setters for all fields
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
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


    //absentDates apo Gianni
    public void setAbsentDates(List<String> absentDates) {
        this.absentDates = absentDates;
    }
    public List<String> getAbsentDates(){
        return absentDates;
    }
}
