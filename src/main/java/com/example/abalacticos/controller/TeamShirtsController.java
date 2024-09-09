package com.example.abalacticos.controller;

import com.example.abalacticos.model.TeamShirts;
import com.example.abalacticos.service.TeamShirtsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-shirts")
public class TeamShirtsController {

    @Autowired
    private TeamShirtsService teamShirtsService;

    // Endpoint to get all available shirts
    @GetMapping("/all")
    public ResponseEntity<List<TeamShirts>> getAllShirts() {
        List<TeamShirts> shirts = teamShirtsService.getAllShirts();
        return ResponseEntity.ok(shirts);
    }

    // Endpoint to add a new shirt color
    @PostMapping("/add")
    public ResponseEntity<String> addShirtColor(@RequestBody String newColor) {
        teamShirtsService.addShirt(newColor);
        return ResponseEntity.ok("Shirt color added: " + newColor);
    }

    // Endpoint to get stats for a specific shirt color
    @GetMapping("/{color}")
    public ResponseEntity<TeamShirts> getShirtStats(@PathVariable String color) {
        TeamShirts shirt = teamShirtsService.getShirt(color);
        if (shirt != null) {
            return ResponseEntity.ok(shirt);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to update the stats for a shirt color
    @PutMapping("/{color}/update-stats")
    public ResponseEntity<String> updateShirtStats(@PathVariable String color,
                                                   @RequestParam boolean isWin,
                                                   @RequestParam boolean isDraw) {
        if (!teamShirtsService.existsByColor(color)) {
            return ResponseEntity.badRequest().body("Shirt color does not exist.");
        }
        teamShirtsService.updateStats(color, isWin, isDraw);
        return ResponseEntity.ok("Stats updated for shirt color: " + color);
    }
}

