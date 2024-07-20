package com.example.abalacticos.repository;

import com.example.abalacticos.model.AbalacticosUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AbalacticosUserRepository extends MongoRepository<AbalacticosUser, String> {
    Optional<AbalacticosUser> findByUsername(String username);
}
