package com.example.abalacticos.repository;

import com.example.abalacticos.model.TeamShirts;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TeamShirtsRepository extends MongoRepository<TeamShirts, String> {
    Optional<TeamShirts> findByColor(String color);

    // Custom method to check existence by color
    boolean existsByColor(String color);
}

