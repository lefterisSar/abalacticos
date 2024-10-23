package com.example.abalacticos.model.FormationDTOS;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class FormationRequest {

    @NotNull(message = "Date and time are required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dateTime;

    private LocalTime time;

    @Positive(message = "Number of players must be positive")
    private int numberOfPlayers;

    @PositiveOrZero(message = "Auto-fill players count must be positive")
    private int autoFillPlayersCount;

    @PositiveOrZero(message = "Manual-fill players count must be positive")
    private int manualFillPlayersCount;

    private List<String> manualPlayerIds;
    private List<String> autoFillPlayerIds; // Newly added field

    // New field for unregistered player names
    private List<String> unregisteredPlayerNames;

    // Optional: Field to track missing slots
    private int missingSlots;

    //creator
    String createdBy;
    LocalDateTime createdAt;

    // Constructors
    public FormationRequest() {
    }

    public FormationRequest(LocalDateTime dateTime, int numberOfPlayers, int autoFillPlayersCount, int manualFillPlayersCount, List<String> manualPlayerIds, List<String> autoFillPlayerIds, List<String> unregisteredPlayerNames, int missingSlots) {
        this.dateTime = dateTime;
        this.numberOfPlayers = numberOfPlayers;
        this.autoFillPlayersCount = autoFillPlayersCount;
        this.manualFillPlayersCount = manualFillPlayersCount;
        this.manualPlayerIds = manualPlayerIds;
        this.autoFillPlayerIds = autoFillPlayerIds;


        // New field for unregistered player names
        this.unregisteredPlayerNames = unregisteredPlayerNames;

        // Optional: Field to track missing slots
        this.missingSlots = missingSlots;
    }

    // Getters and Setters
    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    /*
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
    */

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
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

    public List<String> getManualPlayerIds() {
        return manualPlayerIds;
    }

    public void setManualPlayerIds(List<String> manualPlayerIds) {
        this.manualPlayerIds = manualPlayerIds;
    }

    public List<String> getAutoFillPlayerIds() {
        return autoFillPlayerIds;
    }

    public void setAutoFillPlayerIds(List<String> autoFillPlayersIds) {
        this.autoFillPlayerIds = autoFillPlayersIds;
    }

    public int getMissingSlots() {
        return missingSlots;
    }

    public void setMissingSlots(int missingSlots) {
        this.missingSlots = missingSlots;
    }

    public List<String> getUnregisteredPlayerNames() {
        return unregisteredPlayerNames;
    }

    public void setUnregisteredPlayerNames(List<String> unregisteredPlayerNames) {
        this.unregisteredPlayerNames = unregisteredPlayerNames;
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
