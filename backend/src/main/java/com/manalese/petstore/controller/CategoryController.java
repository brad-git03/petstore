package com.manalese.petstore.controller;

import com.manalese.petstore.dto.ApiResponse;
import com.manalese.petstore.dto.CategoryDto;
import com.manalese.petstore.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Category Controller
 * 
 * REST endpoints for category operations.
 */
@RestController
@RequestMapping("/categories")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    
    /**
     * Get all categories
     * 
     * @return List of all categories with icons
     */
    @GetMapping
    public ApiResponse<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ApiResponse.success(categories, "Categories retrieved successfully");
    }
}
