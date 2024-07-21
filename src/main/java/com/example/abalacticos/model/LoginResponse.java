package com.example.abalacticos.model;

public class LoginResponse {
    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }

    // Getter

    public String getToken() {
        return token;
    }

    // Setter (if needed)

    public void setToken(String token) {
        this.token = token;
    }
}
