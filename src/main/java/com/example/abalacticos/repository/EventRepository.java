package com.example.abalacticos.repository;

import com.example.abalacticos.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    // Custom query methods if needed
}
