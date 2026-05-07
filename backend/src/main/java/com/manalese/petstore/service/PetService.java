package com.manalese.petstore.service;

import com.manalese.petstore.dto.CategoryDto;
import com.manalese.petstore.dto.PetDetailDto;
import com.manalese.petstore.dto.PetInputDto;
import com.manalese.petstore.dto.PetListItemDto;
import com.manalese.petstore.model.Category;
import com.manalese.petstore.model.Inventory;
import com.manalese.petstore.model.Pet;
import com.manalese.petstore.model.PetType;
import com.manalese.petstore.repository.CategoryRepository;
import com.manalese.petstore.repository.InventoryRepository;
import com.manalese.petstore.repository.PetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.UUID;

/**
 * Pet Service
 * 
 * Business logic for pet operations including filtering, searching,
 * and inventory status mapping.
 */
@Service
@Transactional(readOnly = true)
public class PetService {
    
    private final PetRepository petRepository;
    private final InventoryRepository inventoryRepository;
    private final CategoryRepository categoryRepository;
    
    public PetService(PetRepository petRepository, InventoryRepository inventoryRepository, CategoryRepository categoryRepository) {
        this.petRepository = petRepository;
        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
    }
    
    /**
     * Get pets by type with pagination
     */
    public Page<PetListItemDto> getPetsByType(@NonNull PetType type, @NonNull Pageable pageable) {
        return petRepository.findByType(type, pageable)
            .map(this::mapToPetListItemDto);
    }
    
    /**
     * Get pet by ID
     */
    public Optional<PetDetailDto> getPetById(@NonNull UUID id) {
        return petRepository.findById(id)
            .map(this::mapToPetDetailDto);
    }
    
    /**
     * Search pets by name
     */
    public Page<PetListItemDto> searchPets(@NonNull String searchTerm, @NonNull Pageable pageable) {
        return petRepository.findByNameContainingIgnoreCase(searchTerm, pageable)
            .map(this::mapToPetListItemDto);
    }
    
    /**
     * Get all pets with pagination
     */
    public Page<PetListItemDto> getAllPets(@NonNull Pageable pageable) {
        return petRepository.findAll(pageable)
            .map(this::mapToPetListItemDto);
    }
    
    @Transactional
    public PetDetailDto createPet(@NonNull PetInputDto inputDto) {
        Category category = categoryRepository.findById(inputDto.getCategoryId())
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            
        Pet pet = new Pet(
            inputDto.getName(),
            inputDto.getBreed(),
            inputDto.getType(),
            inputDto.getAgeYears(),
            inputDto.getPriceCents(),
            inputDto.getDescription(),
            inputDto.getPhotoUrl(),
            category
        );
        
        Pet savedPet = petRepository.save(pet);
        return mapToPetDetailDto(savedPet);
    }
    
    @Transactional
    public Optional<PetDetailDto> updatePet(@NonNull UUID id, @NonNull PetInputDto inputDto) {
        return petRepository.findById(id).map(pet -> {
            Category category = categoryRepository.findById(inputDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
                
            pet.setName(inputDto.getName());
            pet.setBreed(inputDto.getBreed());
            pet.setType(inputDto.getType());
            pet.setAgeYears(inputDto.getAgeYears());
            pet.setPriceCents(inputDto.getPriceCents());
            pet.setDescription(inputDto.getDescription());
            pet.setPhotoUrl(inputDto.getPhotoUrl());
            pet.setCategory(category);
            
            return mapToPetDetailDto(petRepository.save(pet));
        });
    }
    
    @Transactional
    public boolean deletePet(@NonNull UUID id) {
        if (petRepository.existsById(id)) {
            petRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Helper method to get availability status
     */
    private String getAvailabilityStatus(@NonNull UUID petId) {
        Optional<Inventory> inventory = inventoryRepository.findByPetId(petId);
        return inventory
            .map(inv -> inv.getStatus().getDisplayName())
            .orElse("Unknown");
    }
    
    /**
     * Helper method to map Pet entity to PetListItemDto
     */
    private PetListItemDto mapToPetListItemDto(Pet pet) {
        return new PetListItemDto(
            pet.getId(),
            pet.getName(),
            pet.getBreed(),
            pet.getType().getDisplayName(),
            pet.getAgeYears(),
            pet.getPriceCents() / 100.0,
            pet.getPhotoUrl(),
            getAvailabilityStatus(pet.getId()),
            pet.getCategory().getId()
        );
    }
    
    /**
     * Helper method to map Pet entity to PetDetailDto
     */
    private PetDetailDto mapToPetDetailDto(Pet pet) {
        CategoryDto categoryDto = new CategoryDto(
            pet.getCategory().getId(),
            pet.getCategory().getName(),
            pet.getCategory().getSlug(),
            pet.getCategory().getDescription(),
            pet.getCategory().getIconUrl()
        );
        
        return new PetDetailDto(
            pet.getId(),
            pet.getName(),
            pet.getBreed(),
            pet.getType().getDisplayName(),
            pet.getAgeYears(),
            pet.getPriceCents() / 100.0,
            pet.getDescription(),
            pet.getPhotoUrl(),
            getAvailabilityStatus(pet.getId()),
            categoryDto
        );
    }
}
