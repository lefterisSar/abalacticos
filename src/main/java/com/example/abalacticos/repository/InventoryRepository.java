package com.example.abalacticos.repository;

import com.example.abalacticos.model.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface InventoryRepository extends MongoRepository<Inventory, String> {

    Optional<Inventory> findByCurrentHolderId(String userId);

    // Return multiple items
    List<Inventory> findListByCurrentHolderId(String userId);
}