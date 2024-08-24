package com.example.abalacticos.repository;

import com.example.abalacticos.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {
    Optional<Match> findByDayAndDatePlayed(String day, LocalDate datePlayed);

}
