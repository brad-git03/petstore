package com.manalese.petstore.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.lang.NonNull;

/**
 * Pet Entity
 * 
 * Represents a pet in the catalog with attributes and relationships
 * to categories and inventory records.
 */
@Entity
@Table(name = "pets", indexes = {
    @Index(name = "idx_pet_type", columnList = "type"),
    @Index(name = "idx_pet_price", columnList = "price_cents"),
    @Index(name = "idx_pet_created_at", columnList = "created_at DESC"),
    @Index(name = "idx_pet_name", columnList = "name"),
    @Index(name = "idx_pet_category", columnList = "category_id")
})
public class Pet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "breed", nullable = false, length = 100)
    private String breed;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private PetType type;
    
    @Column(name = "age_years", nullable = false)
    private BigDecimal ageYears;
    
    @Column(name = "price_cents", nullable = false)
    private Integer priceCents;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "photo_url", length = 500)
    private String photoUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Pet() {}
    
    public Pet(String name, String breed, PetType type, BigDecimal ageYears, Integer priceCents, 
               String description, String photoUrl, Category category) {
        this.name = name;
        this.breed = breed;
        this.type = type;
        this.ageYears = ageYears;
        this.priceCents = priceCents;
        this.description = description;
        this.photoUrl = photoUrl;
        this.category = category;
    }
    
    // Getters and Setters
    @NonNull
    public UUID getId() {
        return java.util.Objects.requireNonNull(id);
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
    
    public PetType getType() {
        return type;
    }
    
    public void setType(PetType type) {
        this.type = type;
    }
    
    public BigDecimal getAgeYears() {
        return ageYears;
    }
    
    public void setAgeYears(BigDecimal ageYears) {
        this.ageYears = ageYears;
    }
    
    public Integer getPriceCents() {
        return priceCents;
    }
    
    public void setPriceCents(Integer priceCents) {
        this.priceCents = priceCents;
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
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
