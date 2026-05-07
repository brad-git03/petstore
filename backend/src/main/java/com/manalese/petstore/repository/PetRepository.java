package com.manalese.petstore.repository;

import com.manalese.petstore.model.Pet;
import com.manalese.petstore.model.PetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Pet Repository
 * 
 * Provides database access for Pet entities with custom queries
 * for filtering, searching, and pagination.
 */
@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {
    
    /**
     * Find pets by type
     */
    Page<Pet> findByType(PetType type, Pageable pageable);
    
    /**
     * Search pets by name (case-insensitive)
     */
    Page<Pet> findByNameContainingIgnoreCase(String searchTerm, Pageable pageable);
    
    /**
     * Find pets by type and filter by price range
     */
    @Query("SELECT p FROM Pet p WHERE p.type = :type AND p.priceCents >= :minPrice AND p.priceCents <= :maxPrice ORDER BY p.createdAt DESC")
    Page<Pet> findByTypeAndPriceRange(PetType type, Integer minPrice, Integer maxPrice, Pageable pageable);
    
    /**
     * Search pets by name within price range
     */
    @Query("SELECT p FROM Pet p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND p.priceCents >= :minPrice AND p.priceCents <= :maxPrice ORDER BY p.createdAt DESC")
    Page<Pet> searchByNameAndPrice(String searchTerm, Integer minPrice, Integer maxPrice, Pageable pageable);
}
