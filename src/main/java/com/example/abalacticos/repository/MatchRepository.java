package com.example.abalacticos.repository;

import com.example.abalacticos.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {
}
