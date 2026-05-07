package com.manalese.petstore.controller;

import com.manalese.petstore.dto.ApiResponse;
import com.manalese.petstore.dto.PaginatedResponseDto;
import com.manalese.petstore.dto.PetDetailDto;
import com.manalese.petstore.dto.PetListItemDto;
import com.manalese.petstore.dto.PetInputDto;
import com.manalese.petstore.model.PetType;
import com.manalese.petstore.service.PetService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.UUID;

/**
 * Pet Controller
 * 
 * REST endpoints for pet catalog operations including browsing,
 * filtering, searching, and detailed pet information.
 */
@RestController
@RequestMapping("/pets")
public class PetController {
    
    private final PetService petService;
    
    private static final int MAX_LIMIT = 100;
    
    public PetController(PetService petService) {
        this.petService = petService;
    }
    
    /**
     * Get pets with optional filtering by type
     * 
     * @param type Pet type filter (DOG, CAT, BIRD, FISH)
     * @param search Search term for pet name
     * @param priceMin Minimum price in USD
     * @param priceMax Maximum price in USD
     * @param sortBy Sort parameter (newest, price_asc, price_desc)
     * @param limit Results per page (default 20, max 100)
     * @param offset Pagination offset (default 0)
     * @return Paginated list of pets
     */
    @GetMapping
    public ApiResponse<PaginatedResponseDto<PetListItemDto>> getPets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "20") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset) {
        
        // Validate limit
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        
        // Create sort order
        Sort.Order order;
        if ("price_asc".equals(sortBy)) {
            order = new Sort.Order(Sort.Direction.ASC, "priceCents");
        } else if ("price_desc".equals(sortBy)) {
            order = new Sort.Order(Sort.Direction.DESC, "priceCents");
        } else {
            order = new Sort.Order(Sort.Direction.DESC, "createdAt");
        }
        
        Pageable pageable = PageRequest.of(offset / limit, limit, Sort.by(order));
        
        Page<PetListItemDto> page;
        
        if (search != null && !search.isEmpty()) {
            // Search by name
            page = petService.searchPets(search, pageable);
        } else if (type != null && !type.isEmpty()) {
            // Filter by type
            try {
                PetType petType = PetType.valueOf(type.toUpperCase());
                page = petService.getPetsByType(petType, pageable);
            } catch (IllegalArgumentException e) {
                return ApiResponse.error("Invalid pet type: " + type, "Valid types are: DOG, CAT, BIRD, FISH");
            }
        } else {
            // Get all pets
            page = petService.getAllPets(pageable);
        }
        
        PaginatedResponseDto<PetListItemDto> response = new PaginatedResponseDto<>(
            page.getContent(),
            limit,
            offset,
            page.getTotalElements()
        );
        
        return ApiResponse.success(response, "Pets retrieved successfully");
    }
    
    /**
     * Get pet details by ID
     * 
     * @param id Pet UUID
     * @return Detailed pet information
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDetailDto>> getPetById(@PathVariable @NonNull UUID id) {
        return petService.getPetById(id)
            .map(pet -> ResponseEntity.ok(ApiResponse.success(pet, "Pet retrieved successfully")))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Pet not found", "No pet found with ID: " + id)));
    }
    
    /**
     * Create a new pet
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PetDetailDto>> createPet(@Valid @RequestBody @NonNull PetInputDto inputDto) {
        try {
            PetDetailDto createdPet = petService.createPet(inputDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdPet, "Pet created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid input", e.getMessage()));
        }
    }
    
    /**
     * Update an existing pet
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDetailDto>> updatePet(
            @PathVariable @NonNull UUID id, 
            @Valid @RequestBody @NonNull PetInputDto inputDto) {
        try {
            return petService.updatePet(id, inputDto)
                .map(pet -> ResponseEntity.ok(ApiResponse.success(pet, "Pet updated successfully")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Pet not found", "No pet found with ID: " + id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid input", e.getMessage()));
        }
    }
    
    /**
     * Delete a pet
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePet(@PathVariable @NonNull UUID id) {
        boolean deleted = petService.deletePet(id);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success(null, "Pet deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Pet not found", "No pet found with ID: " + id));
        }
    }
}
