package com.example.abalacticos.model.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class BanRequestDto {
    private LocalDateTime banStartDate;
    private LocalDateTime banEndDate;
    private String banReason;
}

