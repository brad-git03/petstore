package com.manalese.petstore.model;

/**
 * Pet Type Enum
 * 
 * Represents the types of pets available in the catalog.
 */
public enum PetType {
    DOG("Dog"),
    CAT("Cat"),
    BIRD("Bird"),
    FISH("Fish");
    
    private final String displayName;
    
    PetType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
