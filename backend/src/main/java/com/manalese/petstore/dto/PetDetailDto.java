package com.manalese.petstore.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Pet Detail DTO
 * 
 * Data transfer object for detailed Pet information (detail page).
 * Includes all pet attributes and availability status.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PetDetailDto {
    private UUID id;
    private String name;
    private String breed;
    private String type;
    private BigDecimal ageYears;
    private Double priceUsd;
    private String description;
    private String photoUrl;
    private String availability;
    private CategoryDto category;
    
    // Constructors
    public PetDetailDto() {}
    
    public PetDetailDto(UUID id, String name, String breed, String type, BigDecimal ageYears,
                        Double priceUsd, String description, String photoUrl, String availability,
                        CategoryDto category) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.type = type;
        this.ageYears = ageYears;
        this.priceUsd = priceUsd;
        this.description = description;
        this.photoUrl = photoUrl;
        this.availability = availability;
        this.category = category;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getBreed() {
        return breed;
    }
    
    public void setBreed(String breed) {
        this.breed = breed;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public BigDecimal getAgeYears() {
        return ageYears;
    }
    
    public void setAgeYears(BigDecimal ageYears) {
        this.ageYears = ageYears;
    }
    
    public Double getPriceUsd() {
        return priceUsd;
    }
    
    public void setPriceUsd(Double priceUsd) {
        this.priceUsd = priceUsd;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPhotoUrl() {
        return photoUrl;
    }
    
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    
    public String getAvailability() {
        return availability;
    }
    
    public void setAvailability(String availability) {
        this.availability = availability;
    }
    
    public CategoryDto getCategory() {
        return category;
    }
    
    public void setCategory(CategoryDto category) {
        this.category = category;
    }
}
