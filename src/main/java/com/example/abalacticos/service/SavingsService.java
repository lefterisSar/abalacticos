package com.example.abalacticos.service;

import com.example.abalacticos.model.Savings;
import com.example.abalacticos.model.Savings.AdminSavings;
import com.example.abalacticos.model.Savings.SavingsHistory;
import com.example.abalacticos.repository.SavingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class SavingsService {

    private final SavingsRepository savingsRepository;

    @Autowired
    public SavingsService(SavingsRepository savingsRepository) {
        this.savingsRepository = savingsRepository;
    }

    // Method to add or update savings for an admin and recalculate team savings
    public Savings addOrUpdateAdminSavings(String userId, String userName, float amount) {
        Optional<Savings> existingSavings = savingsRepository.findById("teamSavings");

        Savings savings;
        if (existingSavings.isPresent()) {
            savings = existingSavings.get();
            Savings.AdminSavings adminSavings = savings.getAdminSavings().stream()
                    .filter(admin -> admin.getUserId().equals(userId))
                    .findFirst()
                    .orElse(new AdminSavings(userId, userName, amount));

            adminSavings.setSavings(adminSavings.getSavings() + amount);

            if (!savings.getAdminSavings().contains(adminSavings)) {
                savings.getAdminSavings().add(adminSavings);
            }

        } else {
            savings = new Savings();
            savings.setId("teamSavings");
            Savings.AdminSavings adminSavings = new AdminSavings(userId, userName, amount);
            savings.getAdminSavings().add(adminSavings);
        }

        savings.recalculateTeamSavings();

        // Add to history
        savings.addSavingsHistory(userName, amount);

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

