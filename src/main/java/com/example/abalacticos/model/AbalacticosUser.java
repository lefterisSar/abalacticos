package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "abalacticos_users")
public class AbalacticosUser {
    @Id
    private String id;
    private String username;
    private String password;
    private String roles; // For simplicity, assume single role

    private int wins;
    private int draws;
    private int losses;

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
}
