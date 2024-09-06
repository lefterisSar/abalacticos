package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "savings")
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

    public Savings(float teamSavings, List<AdminSavings> adminSavings) {
        this.teamSavings = teamSavings;
        this.adminSavings = adminSavings;
        this.savingsHistory = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public float getTeamSavings() {
        return teamSavings;
    }

    public void setTeamSavings(float teamSavings) {
        this.teamSavings = teamSavings;
    }

    public List<AdminSavings> getAdminSavings() {
        return adminSavings;
    }

    public void setAdminSavings(List<AdminSavings> adminSavings) {
        this.adminSavings = adminSavings;
    }

    public List<SavingsHistory> getSavingsHistory() {
        return savingsHistory;
    }

    public void setSavingsHistory(List<SavingsHistory> savingsHistory) {
        this.savingsHistory = savingsHistory;
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



    public static class AdminSavings {
        private String userId;
        private String userName;
        private float savings;

        // Constructors
        public AdminSavings(String userId, String userName, float savings) {
            this.userId = userId;
            this.userName = userName;
            this.savings = savings;
        }

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public float getSavings() {
            return savings;
        }

        public void setSavings(float savings) {
            this.savings = savings;
        }
    }

    public static class SavingsHistory {
        private String userName;
        private float amount;
        private Date date;

        public SavingsHistory(String userName, float amount, Date date) {
            this.userName = userName;
            this.amount = amount;
            this.date = date;
        }

        // Getters
        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public float getAmount() {
            return amount;
        }

        public void setAmount(float amount) {
            this.amount = amount;
        }

        public Date getDate() {
            return date;
        }

        public void setDate(Date date) {
            this.date = date;
        }
    }
}


