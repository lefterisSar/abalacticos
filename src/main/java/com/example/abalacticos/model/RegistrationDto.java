package com.example.abalacticos.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class RegistrationDto {
    @NotEmpty(message = "Username is required")
    private String username;

    @NotEmpty(message = "Password is required")
    private String password;

    @Email(message = "Invalid email address")
    private String email;

    // Getters and setters
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
