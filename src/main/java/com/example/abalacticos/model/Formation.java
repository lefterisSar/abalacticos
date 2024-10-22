package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Document(collection = "formations")
public class Formation {
    @Id
    private String id;
    private LocalDateTime dateTime;
    //private LocalDate date;
    private LocalTime time;
    private String dayOfWeek;
    private int numberOfPlayers;
    private int autoFillPlayersCount;
    private int manualFillPlayersCount;

    // New field for unregistered player names
    private List<String> unregisteredPlayerNames;

    // Optional: Field to track missing slots
    private int missingSlots;

    private List<String> playerIds = new ArrayList<>(); // Store the IDs of selected players
    private List<String> queueList = new ArrayList<>(); // Store the IDs of players in the queue
    private List<String> absentPlayers = new ArrayList<>(); // Track players who marked themselves absent

    private String status; // e.g., "Scheduled", "Completed", "Canceled"

    private Map<String, List<String>> teams = new HashMap<>(); // teamColor -> List of playerIds
    private List<String> availableColors = new ArrayList<>(Arrays.asList("Red", "Blue", "Black", "Gray", "Green"));

    private String createdBy; // New field
    private LocalDateTime createdAt; // New field


    // Constructors
    public Formation() {}

    public Formation(LocalDateTime dateTime, int numberOfPlayers, int autoFillPlayersCount, int manualFillPlayersCount) {
        //this.date = date;
        this.dayOfWeek = dateTime.getDayOfWeek().toString();
        this.dateTime = dateTime;
        this.numberOfPlayers = numberOfPlayers;
        this.autoFillPlayersCount = autoFillPlayersCount;
        this.manualFillPlayersCount = manualFillPlayersCount;
        this.status = "Scheduled";
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    /*
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
        this.dayOfWeek = date.getDayOfWeek().toString();
    }
     */

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }


    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(int numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    public int getAutoFillPlayersCount() {
        return autoFillPlayersCount;
    }

    public void setAutoFillPlayersCount(int autoFillPlayersCount) {
        this.autoFillPlayersCount = autoFillPlayersCount;
    }

    public int getManualFillPlayersCount() {
        return manualFillPlayersCount;
    }

    public void setManualFillPlayersCount(int manualFillPlayersCount) {
        this.manualFillPlayersCount = manualFillPlayersCount;
    }

    public List<String> getPlayerIds() {
        return playerIds;
    }

    public void setPlayerIds(List<String> playerIds) {
        this.playerIds = playerIds;
    }

    public List<String> getQueueList() {
        return queueList;
    }

    public void setQueueList(List<String> queueList) {
        this.queueList = queueList;
    }

    public List<String> getAbsentPlayers() {
        return absentPlayers;
    }

    public void setAbsentPlayers(List<String> absentPlayers) {
        this.absentPlayers = absentPlayers;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, List<String>> getTeams() {
        return teams;
    }

    public void setTeams(Map<String, List<String>> teams) {
        this.teams = teams;
    }

    public List<String> getAvailableColors() {
        return availableColors;
    }

    public void setAvailableColors(List<String> availableColors) {
        this.availableColors = availableColors;
    }

    // **Method to Assign Teams and Colors**
    public void assignTeams(Map<String, List<String>> teamAssignments, List<String> colorsAssigned) {
        this.teams = teamAssignments;
        this.availableColors.removeAll(colorsAssigned);
    }

    public List<String> getUnregisteredPlayerNames() {
        return unregisteredPlayerNames;
    }

    public void setUnregisteredPlayerNames(List<String> unregisteredPlayerNames) {
        this.unregisteredPlayerNames = unregisteredPlayerNames;
    }

    public int getMissingSlots() {
        return missingSlots;
    }

    public void setMissingSlots(int missingSlots) {
        this.missingSlots = missingSlots;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
