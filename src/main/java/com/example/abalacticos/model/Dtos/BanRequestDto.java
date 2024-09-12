package com.example.abalacticos.model.Dtos;

import java.time.LocalDateTime;

public class BanRequestDto {
    private LocalDateTime banStartDate;
    private LocalDateTime banEndDate;
    private String banReason;

    // Getters and setters
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

    public String getBanReason() {
        return banReason;
    }

    public void setBanReason(String banReason) {
        this.banReason = banReason;
    }
}

