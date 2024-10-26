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

    // Fetch Available Players by Day (not injured, not absent, not banned)
    @Query("{ 'injured': false, 'isBanned': false, 'absent': false, 'availability': { $in: [ { $regex: ?0, $options: 'i' } ] } }")
    List<AbalacticosUser> findAvailablePlayersByDay(String dayName);

    // Fetch Players Explicitly Marked as Available
    @Query("{ 'availability': { $regex: ?0, $options: 'i' }, 'available': true }")
    List<AbalacticosUser> findOverrideAvailablePlayersByDayAndNotAbsent(String dayName, String date);

    // Fetch Absent Players by Day and Date
    @Query("{ 'absent': true, 'availability': { $in: [ { $regex: ?0, $options: 'i' } ] }, 'absentDates': ?1 }")
    List<AbalacticosUser> findAbsentPlayersByDayAndDate(String dayName, String date);

    // Fetch Injured Players by Day (na diowrthwthei auto gia na min isxyei -> and Date (not absent))
    @Query("{ 'injured': true, 'availability': { $in: [ { $regex: ?0, $options: 'i' } ] } }")
    List<AbalacticosUser> findInjuredPlayersByDayAndNotAbsent(String dayName);

    // Fetch Banned Players by Day and Date (not absent)
    @Query("{ 'availability': { $regex: ?0, $options: 'i' }, 'isBanned': true }")
    List<AbalacticosUser> findBannedPlayersByDayAndNotAbsent(String dayName, String date);

    @Query("{ 'availability': { $regex: ?0, $options: 'i' }, 'available': true, 'injured': false, 'absent': false, 'isBanned': false }")
    List<AbalacticosUser> findNonExcludedAvailablePlayersByDayAndNotAbsent(String dayName, String date);

    // Fetch All Players
    List<AbalacticosUser> findAll();
}


