package com.example.abalacticos.controller;

import com.example.abalacticos.model.Position;
import com.example.abalacticos.model.PositionPriority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

public class PositionPriorityController {

    private Map<String, PositionPriority> playerPositionPriorities = new HashMap<>();

    @PostMapping("/set")
    public void setPositionPriority(@RequestParam String playerId, @RequestParam Position position, @RequestParam int priority) {
        PositionPriority positionPriority = playerPositionPriorities.computeIfAbsent(playerId, PositionPriority::new);
        positionPriority.setPositionPriority(position, priority);
    }

    @GetMapping("/get")
    public PositionPriority getPositionPriority(@RequestParam String playerId) {
        return playerPositionPriorities.getOrDefault(playerId, new PositionPriority(playerId));
    }
}