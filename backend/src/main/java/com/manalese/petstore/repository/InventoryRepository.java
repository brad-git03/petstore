package com.manalese.petstore.repository;

import com.manalese.petstore.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

/**
 * Inventory Repository
 * 
 * Provides database access for Inventory entities.
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByPetId(UUID petId);
}
