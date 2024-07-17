package com.example.abalacticos.controller;

import com.example.abalacticos.model.Player;
import com.example.abalacticos.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @PostMapping("/add")
    public Player addPlayer(@RequestBody Player player) {
        // Set default values or perform validations if necessary
        return playerRepository.save(player);
    }
}
