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

    // Constructors, Getters, and Setters
    public AbalacticosUser() {}

    public AbalacticosUser(String username, String password, String roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

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
}
