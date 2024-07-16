package com.example.abalacticos;

import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MongoDBConnectionTest implements CommandLineRunner {

    @Value("${spring.data.mongodb.uri}")
    private String mongoURI;

    @Override
    public void run(String... args) throws Exception {
        try (MongoClient mongoClient = MongoClients.create(mongoURI)) {
            System.out.println("Connected successfully to MongoDB");
            // Additional code to perform database operations can be added here
        } catch (MongoException e) {
            System.err.println("MongoDB connection error: " + e.getMessage());
            // Handle connection error
        }
    }
}