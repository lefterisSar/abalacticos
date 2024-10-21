package com.example.abalacticos.repository;

import com.example.abalacticos.model.AbalacticosUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<AbalacticosUser, String> {
    AbalacticosUser findByUsername(String username);

    Optional<AbalacticosUser> findOptionalByUsername(String username);



    List<AbalacticosUser> findByUsernameContainingIgnoreCase(String query);

    // New method to check if a username exists
    boolean existsByUsername(String username);

    //List with the Banned users
    List<AbalacticosUser> findAllByIsBannedTrue();

    // Custom query to find players based on availability and status
    List<AbalacticosUser> findByAvailabilityContainingAndInjuredFalseAndAbsentFalseAndIsBannedFalse(String dayName);

    @Query("{ 'availability': { $regex: ?0, $options: 'i' } }")
    List<AbalacticosUser> findByAvailabilityIgnoreCase(String dayName);
}


