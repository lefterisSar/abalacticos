package com.example.abalacticos.repository;

import com.example.abalacticos.model.FidelityRating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FidelityRatingRepository extends MongoRepository<FidelityRating, String> {
    Optional<FidelityRating> findByUserIdAndSemesterAndYear(String userId, int semester, int year);
    List<FidelityRating> findByUserIdAndYear(String userId, int year);
}

