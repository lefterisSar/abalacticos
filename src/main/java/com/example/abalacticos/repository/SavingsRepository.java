package com.example.abalacticos.repository;

import com.example.abalacticos.model.Savings;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SavingsRepository extends MongoRepository<Savings, String> {
    Optional<Savings> findById(String id);
}

