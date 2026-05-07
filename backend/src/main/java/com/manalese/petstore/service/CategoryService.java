package com.manalese.petstore.service;

import com.manalese.petstore.dto.CategoryDto;
import com.manalese.petstore.model.Category;
import com.manalese.petstore.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Category Service
 * 
 * Business logic for category operations.
 */
@Service
@Transactional(readOnly = true)
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
    /**
     * Get all categories
     */
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(this::mapToCategoryDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Helper method to map Category entity to DTO
     */
    private CategoryDto mapToCategoryDto(Category category) {
        return new CategoryDto(
            category.getId(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getIconUrl()
        );
    }
}
