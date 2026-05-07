package com.manalese.petstore.dto;

import com.manalese.petstore.model.PetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.lang.NonNull;

public class PetInputDto {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Breed is required")
    private String breed;
    
    @NotNull(message = "Type is required")
    private PetType type;
    
    @NotNull(message = "Age is required")
    private BigDecimal ageYears;
    
    @NotNull(message = "Price is required")
    private Integer priceCents;
    
    private String description;
    
    private String photoUrl;
    
    @NotNull(message = "Category is required")
    private UUID categoryId;

    public PetInputDto() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this. breed = breed; }

    public PetType getType() { return type; }
    public void setType(PetType type) { this.type = type; }

    public BigDecimal getAgeYears() { return ageYears; }
    public void setAgeYears(BigDecimal ageYears) { this.ageYears = ageYears; }

    public Integer getPriceCents() { return priceCents; }
    public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    @NonNull
    public UUID getCategoryId() { return java.util.Objects.requireNonNull(categoryId); }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
}
