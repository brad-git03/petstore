package com.manalese.petstore.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.UUID;

/**
 * Category DTO
 * 
 * Data transfer object for Category API responses.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryDto {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    
    // Constructors
    public CategoryDto() {}
    
    public CategoryDto(UUID id, String name, String slug, String description, String iconUrl) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.iconUrl = iconUrl;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
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
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getIconUrl() {
        return iconUrl;
    }
    
    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
