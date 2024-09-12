package com.example.abalacticos.controller;

import com.example.abalacticos.model.Savings;
import com.example.abalacticos.service.SavingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savings")
public class SavingsController {

    private final SavingsService savingsService;

    @Autowired
    public SavingsController(SavingsService savingsService) {
        this.savingsService = savingsService;
    }

    // Endpoint to update savings for an admin
    @PutMapping("/update/{userId}")
    public ResponseEntity<Savings> updateAdminSavings(
            @PathVariable String userId,
            @RequestBody Map<String, Object> request) {
        float amount = Float.parseFloat(request.get("adminsSavings").toString());
        String userName = request.get("userName").toString(); // Assume frontend sends userName
        Savings updatedSavings = savingsService.addOrUpdateAdminSavings(userId, userName, amount);
        return ResponseEntity.ok(updatedSavings);
    }

    // Endpoint to get total team savings
    @GetMapping("/teamSavings")
    public ResponseEntity<Float> getTeamSavings() {
        float teamSavings = savingsService.getTeamSavings();
        return ResponseEntity.ok(teamSavings);
    }

    // Endpoint to get savings for a specific admin
    @GetMapping("/adminSavings/{userId}")
    public ResponseEntity<Float> getAdminSavings(@PathVariable String userId) {
        float adminSavings = savingsService.getAdminSavings(userId);
        return ResponseEntity.ok(adminSavings);
    }

    // Endpoint to get all admin savings
    @GetMapping("/adminSavings")
    public ResponseEntity<List<Map<String, Object>>> getAllAdminSavings() {
        Savings savings = savingsService.getTeamSavingsObject(); // Fetch the team savings object

        List<Map<String, Object>> adminSavingsList = new ArrayList<>();

        // Convert the List of AdminSavings to a list of maps for the frontend
        savings.getAdminSavings().forEach(admin -> {
            Map<String, Object> adminData = new HashMap<>();
            adminData.put("currentHolderId", admin.getUserId());
            adminData.put("adminSavings", admin.getSavings());
            adminData.put("userName", admin.getUserName());
            adminSavingsList.add(adminData);
        });

        return ResponseEntity.ok(adminSavingsList);
    }

    @GetMapping("/savingsHistory")
    public ResponseEntity<List<Savings.SavingsHistory>> getSavingsHistory() {
        Savings savings = savingsService.getTeamSavingsObject();
        return ResponseEntity.ok(savings.getSavingsHistory());
    }


}


