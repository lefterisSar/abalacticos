package com.example.abalacticos.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "savings")
@Getter
@Setter
public class Savings {

    @Id
    private String id;
    private float teamSavings; // Total team savings
    private List<AdminSavings> adminSavings;
    private List<SavingsHistory> savingsHistory;

    // Constructors, Getters, and Setters
    public Savings() {
        this.adminSavings = new ArrayList<>();
        this.savingsHistory = new ArrayList<>();
    }
    // Method to add or update an admin's savings
    public void addOrUpdateAdminSavings(String userId, String userName, float amount) {
        boolean found = false;
        for (AdminSavings admin : this.adminSavings) {
            if (admin.getUserId().equals(userId)) {
                admin.setSavings(admin.getSavings() + amount);
                found = true;
                break;
            }
        }
        if (!found) {
            this.adminSavings.add(new AdminSavings(userId, userName, amount));
        }
        recalculateTeamSavings();

        savingsHistory.add(new SavingsHistory(userName, amount, new Date()));
    }

    // Method to recalculate the total team savings
    public void recalculateTeamSavings() {
        this.teamSavings = adminSavings.stream().map(AdminSavings::getSavings).reduce(0f, Float::sum);
    }

    // Add method to append to history
    public void addSavingsHistory(String userName, float amountAdded) {
        SavingsHistory history = new SavingsHistory(userName, amountAdded, new Date());
        this.savingsHistory.add(history);
    }



    @Setter
    @Getter
    public static class AdminSavings {
        private String userId;
        private String userName;
        private float savings;

        public AdminSavings(String userId, String userName, float savings) {
            this.userId = userId;
            this.userName = userName;
            this.savings = savings;
        }

    }

    @Getter
    @Setter
    public static class SavingsHistory {
        private String userName;
        private float amount;
        private Date date;

        public SavingsHistory(String userName, float amount, Date date) {
            this.userName = userName;
            this.amount = amount;
            this.date = date;
        }
    }
}


