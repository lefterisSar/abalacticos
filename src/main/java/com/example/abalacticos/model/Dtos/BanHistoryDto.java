package com.example.abalacticos.model.Dtos;

import java.time.LocalDateTime;

public class BanHistoryDto {
    private String username;
    private LocalDateTime banStartDate;
    private LocalDateTime banEndDate;
    private long duration;  // in days
    private String banReason;
    private int banCount;

    // Constructor, Getters, and Setters
    public BanHistoryDto(String username, LocalDateTime banStartDate, LocalDateTime banEndDate, long duration, String banReason, int banCount) {
        this.username = username;
        this.banStartDate = banStartDate;
        this.banEndDate = banEndDate;
        this.duration = duration;
        this.banReason = banReason;
        this.banCount = banCount;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getBanStartDate() {
        return banStartDate;
    }

    public void setBanStartDate(LocalDateTime banStartDate) {
        this.banStartDate = banStartDate;
    }

    public LocalDateTime getBanEndDate() {
        return banEndDate;
    }

    public void setBanEndDate(LocalDateTime banEndDate) {
        this.banEndDate = banEndDate;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public String getBanReason() {
        return banReason;
    }

    public void setBanReason(String banReason) {
        this.banReason = banReason;
    }

    public int getBanCount() {
        return banCount;
    }

    public void setBanCount(int banCount) {
        this.banCount = banCount;
    }
}

