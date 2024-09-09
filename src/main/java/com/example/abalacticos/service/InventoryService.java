package com.example.abalacticos.service;

import com.example.abalacticos.model.AbalacticosUser;
import com.example.abalacticos.model.Inventory;
import com.example.abalacticos.repository.InventoryRepository;
import com.example.abalacticos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public InventoryService(InventoryRepository inventoryRepository, UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    // Method to add a new inventory item
    public Inventory addItem(Inventory item) {
        return inventoryRepository.save(item);
    }

    // Method to get all inventory items
    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    // Method to get an inventory item by ID
    public Optional<Inventory> getItemById(String id) {
        return inventoryRepository.findById(id);
    }

    // Method to update an inventory item
    public Inventory updateItem(String id, Inventory updatedItem) {
        Inventory existingItem = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setItemType(updatedItem.getItemType());
        existingItem.setIconUrl(updatedItem.getIconUrl());
        existingItem.setCurrentHolderId(updatedItem.getCurrentHolderId());

        return inventoryRepository.save(existingItem);
    }

    // Method to delete an inventory item by ID
    public void deleteItem(String id) {
        inventoryRepository.deleteById(id);
    }

    // New method to assign an item to a user
    public void assignItemToUser(String itemId, String userId) {
        // Find the item
        Inventory item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Find the user
        AbalacticosUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the currentHolderId in the inventory item
        item.setCurrentHolderId(userId);
        inventoryRepository.save(item); // Save the item with updated holder

        // Add the item to the user's ownedItems list
        user.addOwnedItem(item);
        userRepository.save(user); // Save the user with updated items
    }


}


