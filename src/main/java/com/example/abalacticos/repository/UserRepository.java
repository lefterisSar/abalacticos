package com.example.abalacticos.repository;

import com.example.abalacticos.model.AbalacticosUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<AbalacticosUser, String> {

    AbalacticosUser findByUsername(String username);
}