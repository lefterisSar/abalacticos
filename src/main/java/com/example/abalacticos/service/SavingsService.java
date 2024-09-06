package com.example.abalacticos.service;

import com.example.abalacticos.model.Savings;
import com.example.abalacticos.model.Savings.AdminSavings;
import com.example.abalacticos.repository.SavingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SavingsService {

    private final SavingsRepository savingsRepository;

    @Autowired
    public SavingsService(SavingsRepository savingsRepository) {
        this.savingsRepository = savingsRepository;
    }

    // Method to add or update savings for an admin and recalculate team savings
    // Method to add or update savings for an admin and recalculate team savings
    public Savings addOrUpdateAdminSavings(String userId, String userName, float amount) {
        // Use a constant ID for team savings document
        String teamSavingsId = "teamSavings";

        // Fetch the existing savings document
        Optional<Savings> existingSavings = savingsRepository.findById(teamSavingsId);

        Savings savings;
        if (existingSavings.isPresent()) {
            // If exists, update the admin's savings and recalculate
            savings = existingSavings.get();

            // Find or create the AdminSavings for this user
            Savings.AdminSavings adminSavings = savings.getAdminSavings().stream()
                    .filter(admin -> admin.getUserId().equals(userId))
                    .findFirst()
                    .orElse(new AdminSavings(userId, userName, amount)); // If not found, create a new one

            // Update the admin's savings amount
            adminSavings.setSavings(adminSavings.getSavings() + amount); // Add new amount to existing savings

            // Ensure the AdminSavings object is stored in the savings list
            if (!savings.getAdminSavings().contains(adminSavings)) {
                savings.getAdminSavings().add(adminSavings);
            }

        } else {
            // If no teamSavings record exists, create a new one
            savings = new Savings();
            savings.setId(teamSavingsId);

            // Create and add the new adminSavings entry
            Savings.AdminSavings adminSavings = new AdminSavings(userId, userName, amount);
            savings.getAdminSavings().add(adminSavings);
        }

        // Recalculate total team savings
        savings.recalculateTeamSavings();

        // Save the updated or new savings record
        return savingsRepository.save(savings);
    }

    // Method to get the total team savings
    public float getTeamSavings() {
        return savingsRepository.findById("teamSavings")
                .map(Savings::getTeamSavings)
                .orElse(0f);
    }

    // Method to get savings for a specific user
    public float getAdminSavings(String userId) {
        return savingsRepository.findById("teamSavings")
                .map(savings -> savings.getAdminSavings().stream()
                        .filter(admin -> admin.getUserId().equals(userId))
                        .map(AdminSavings::getSavings)
                        .findFirst()
                        .orElse(0f))
                .orElse(0f);
    }

    // Method to get the full Savings object
    public Savings getTeamSavingsObject() {
        return savingsRepository.findById("teamSavings")
                .orElseThrow(() -> new RuntimeException("Team savings record not found"));
    }
}

