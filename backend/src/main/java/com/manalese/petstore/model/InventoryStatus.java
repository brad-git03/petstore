package com.manalese.petstore.model;

/**
 * Inventory Status Enum
 * 
 * Represents the availability status of a pet.
 */
public enum InventoryStatus {
    AVAILABLE("Available"),
    OUT_OF_STOCK("Out of Stock");
    
    private final String displayName;
    
    InventoryStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
