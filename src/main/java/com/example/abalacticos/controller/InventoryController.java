package com.example.abalacticos.controller;

import com.example.abalacticos.model.Inventory;
import com.example.abalacticos.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Endpoint to add a new inventory item
    @PostMapping("/add")
    public ResponseEntity<Inventory> addItem(@RequestBody Inventory inventory) {
        Inventory newItem = inventoryService.addItem(inventory);
        return ResponseEntity.ok(newItem);
    }

    // Endpoint to get all inventory items
    @GetMapping("/all")
    public ResponseEntity<List<Inventory>> getAllItems() {
        List<Inventory> items = inventoryService.getAllItems();
        return ResponseEntity.ok(items);
    }

    // Endpoint to get a specific inventory item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getItemById(@PathVariable String id) {
        Optional<Inventory> item = inventoryService.getItemById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to update an inventory item by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Inventory> updateItem(@PathVariable String id, @RequestBody Inventory updatedItem) {
        Inventory updated = inventoryService.updateItem(id, updatedItem);
        return ResponseEntity.ok(updated);
    }

    // Endpoint to delete an inventory item by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully");
    }

    // New endpoint to assign an item to a user
    @PutMapping("/assign/{itemId}/{userId}")
    public ResponseEntity<String> assignItemToUser(@PathVariable String itemId, @PathVariable String userId) {
        inventoryService.assignItemToUser(itemId, userId);
        return ResponseEntity.ok("Item assigned to user successfully");
    }
}

