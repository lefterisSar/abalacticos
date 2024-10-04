package com.example.abalacticos.model.Dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdatePasswordDto {
    private String currentPassword;
    private String newPassword;
    private String confirmNewPassword;
}

