package com.example.abalacticos.model.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
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

}

