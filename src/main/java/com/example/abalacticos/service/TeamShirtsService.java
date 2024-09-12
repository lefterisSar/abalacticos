package com.example.abalacticos.service;

import com.example.abalacticos.model.TeamShirts;
import com.example.abalacticos.repository.TeamShirtsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamShirtsService {

    @Autowired
    private TeamShirtsRepository teamShirtsRepository;

    // Add a new shirt color
    public void addShirt(String color) {
        if (!teamShirtsRepository.existsByColor(color)) {
            TeamShirts newShirt = new TeamShirts(color);
            teamShirtsRepository.save(newShirt);
        }
    }

    // Get a shirt by color
    public TeamShirts getShirt(String color) {
        Optional<TeamShirts> shirt = teamShirtsRepository.findByColor(color);
        return shirt.orElse(null);
    }

    // Update stats for a shirt color
    public void updateStats(String color, boolean isWin, boolean isDraw) {
        Optional<TeamShirts> optionalShirt = teamShirtsRepository.findByColor(color);
        if (optionalShirt.isPresent()) {
            TeamShirts shirt = optionalShirt.get();
            shirt.incrementAppearances();
            if (isWin) {
                shirt.incrementWins();
            } else if (isDraw) {
                shirt.incrementDraws();
            } else {
                shirt.incrementLosses();
            }
            teamShirtsRepository.save(shirt);
        }
    }

    // Get all available shirts
    public List<TeamShirts> getAllShirts() {
        return teamShirtsRepository.findAll();
    }

    // Add this method to check if a shirt color exists
    public boolean existsByColor(String color) {
        return teamShirtsRepository.existsByColor(color);
    }

}

