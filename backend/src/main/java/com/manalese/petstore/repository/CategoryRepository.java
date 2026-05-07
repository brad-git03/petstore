package com.manalese.petstore.repository;

import com.manalese.petstore.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

/**
 * Category Repository
 * 
 * Provides database access for Category entities.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findBySlug(String slug);
    Optional<Category> findByName(String name);
}
