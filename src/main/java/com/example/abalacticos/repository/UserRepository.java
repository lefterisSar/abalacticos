package com.example.abalacticos.repository;

import com.example.abalacticos.model.AbalacticosUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<AbalacticosUser, String> {
    AbalacticosUser findByUsername(String username);


    List<AbalacticosUser> findByUsernameContainingIgnoreCase(String query);

}


