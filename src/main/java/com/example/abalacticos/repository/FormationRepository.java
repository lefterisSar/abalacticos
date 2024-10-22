package com.example.abalacticos.repository;

import com.example.abalacticos.model.Formation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationRepository extends MongoRepository<Formation, String> {
}
