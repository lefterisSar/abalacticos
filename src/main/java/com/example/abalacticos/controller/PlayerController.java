package com.example.abalacticos.controller;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Player;
import com.example.abalacticos.model.RegistrationDto;
import com.example.abalacticos.repository.PlayerRepository;
import com.example.abalacticos.repository.UserRepository;
import com.example.abalacticos.service.PlayerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

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


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid RegistrationDto registrationDto) {
        AbalacticosUser newUser = new AbalacticosUser();
        newUser.setUsername(registrationDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        newUser.setRoles("USER");  // Default to 'USER' role, modify as necessary
        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully");
    }


    // Other CRUD operations if needed
}
