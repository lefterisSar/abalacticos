package com.example.abalacticos.model;

public class PlayerAssignment {
    private String type;    // "registered" or "unregistered"
    private String id;      // For registered players
    private String name;    // For unregistered players
    private String position; // New field for assigned position

    // Constructors
    public PlayerAssignment() {
    }

    public PlayerAssignment(String type, String idOrName, String position) {
        this.type = type;
        this.position = position;
        if ("registered".equals(type)) {
            this.id = idOrName;
        } else if ("unregistered".equals(type)) {
            this.name = idOrName;
        }
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}
