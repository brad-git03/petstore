package com.manalese.petstore.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/**
 * Paginated Response DTO
 * 
 * Wrapper for paginated list responses with metadata.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaginatedResponseDto<T> {
    private List<T> data;
    private Integer limit;
    private Integer offset;
    private Long total;
    private Boolean hasMore;
    
    // Constructors
    public PaginatedResponseDto() {}
    
    public PaginatedResponseDto(List<T> data, Integer limit, Integer offset, Long total) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
        this.hasMore = (offset + limit) < total;
    }
    
    // Getters and Setters
    public List<T> getData() {
        return data;
    }
    
    public void setData(List<T> data) {
        this.data = data;
    }
    
    public Integer getLimit() {
        return limit;
    }
    
    public void setLimit(Integer limit) {
        this.limit = limit;
    }
    
    public Integer getOffset() {
        return offset;
    }
    
    public void setOffset(Integer offset) {
        this.offset = offset;
    }
    
    public Long getTotal() {
        return total;
    }
    
    public void setTotal(Long total) {
        this.total = total;
    }
    
    public Boolean getHasMore() {
        return hasMore;
    }
    
    public void setHasMore(Boolean hasMore) {
        this.hasMore = hasMore;
    }
}
