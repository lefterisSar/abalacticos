package com.example.abalacticos.repository;

import com.example.abalacticos.model.AbalacticosUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<AbalacticosUser, String> {
    AbalacticosUser findByUsername(String username);
}


