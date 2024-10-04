package com.example.abalacticos.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "inventory")
@Getter
@Setter
public class Inventory {

    @Id
    private String id;
    private String itemName;      // Name of the item, e.g., "Nike Match Ball"
    private String itemType;      // Type of item, e.g., "ball", "gloves", "shirt"
    private String iconUrl;       // URL for the icon/image of the item
    private String currentHolderId;  // ID of the AbalacticosUser who holds the item, null if not assigned
}
