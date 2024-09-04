package com.example.abalacticos.service;

import com.example.abalacticos.model.Inventory;
import com.example.abalacticos.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Autowired
    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
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
}
