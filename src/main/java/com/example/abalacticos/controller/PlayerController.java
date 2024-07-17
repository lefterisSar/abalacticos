package com.example.abalacticos.controller;

import com.example.abalacticos.model.Player;
import com.example.abalacticos.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @PostMapping("/add")
    public Player addPlayer(@RequestBody Player player) {
        return playerService.savePlayer(player);
    }

    // Other CRUD operations if needed
}
