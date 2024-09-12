package com.example.abalacticos.repository;

import com.example.abalacticos.model.Club;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubRepository extends MongoRepository<Club, String> {
    // Custom query methods (if any) can be added here
}

