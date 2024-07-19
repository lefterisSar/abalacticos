package com.example.abalacticos.model;

import java.util.EnumMap;
import java.util.Map;

public class PositionPriority {
    private String playerId;
    private Map<Position, Integer> positionPriorities;

    public PositionPriority(String playerId) {
        this.playerId = playerId;
        this.positionPriorities = new EnumMap<>(Position.class);
        for (Position position : Position.values()) {
            this.positionPriorities.put(position, 8);
        }
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPositionPriority(Position position, int priority) {
        this.positionPriorities.put(position, priority);
    }

    public int getPositionPriority(Position position) {
        return this.positionPriorities.getOrDefault(position, 8);
    }


    public Map<Position, Integer> getPositionPriorities() {
        return positionPriorities;
    }

}