package com.example.abalacticos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "inventory")
public class Inventory {

    @Id
    private String id;

    private String itemName;      // Name of the item, e.g., "Nike Match Ball"
    private String itemType;      // Type of item, e.g., "ball", "gloves", "shirt"
    private String iconUrl;       // URL for the icon/image of the item

    private String currentHolderId;  // ID of the AbalacticosUser who holds the item, null if not assigned


    // Constructors, Getters, and Setters

    public Inventory(String itemName, String itemType, String iconUrl) {
        this.itemName = itemName;
        this.itemType = itemType;
        this.iconUrl = iconUrl;
        this.currentHolderId = null;  // Initially no one owns it
    }



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getCurrentHolderId() {
        return currentHolderId;
    }

    public void setCurrentHolderId(String currentHolderId) {
        this.currentHolderId = currentHolderId;
    }

}
