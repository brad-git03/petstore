package com.manalese.petstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Inventory Entity
 * 
 * Tracks availability and stock status for each pet.
 */
@Entity
@Table(name = "inventory", indexes = {
    @Index(name = "idx_inventory_status", columnList = "status"),
    @Index(name = "idx_inventory_pet", columnList = "pet_id")
})
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false, unique = true)
    private Pet pet;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InventoryStatus status;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "last_restocked_at")
    private LocalDateTime lastRestockedAt;
    
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
    public Inventory() {}
    
    public Inventory(Pet pet, InventoryStatus status, Integer quantity) {
        this.pet = pet;
        this.status = status;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public Pet getPet() {
        return pet;
    }
    
    public void setPet(Pet pet) {
        this.pet = pet;
    }
    
    public InventoryStatus getStatus() {
        return status;
    }
    
    public void setStatus(InventoryStatus status) {
        this.status = status;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public LocalDateTime getLastRestockedAt() {
        return lastRestockedAt;
    }
    
    public void setLastRestockedAt(LocalDateTime lastRestockedAt) {
        this.lastRestockedAt = lastRestockedAt;
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
