import { useState, useCallback, useEffect } from 'react'
import { searchPets } from '../services/catalogApi'

/**
 * usePetSearch Hook
 * 
 * Custom React hook managing pet search state, pagination,
 * filtering, and infinite scroll logic.
 */
export default function usePetSearch(initialFilters = {}) {
  const [pets, setPets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState({
    limit: 20,
    ...initialFilters,
  })

  /**
   * Fetch pets with current filters
   */
  const fetchPets = useCallback(async (append = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = {
        ...filters,
        offset: append ? offset : 0,
      }

      const result = await searchPets(params)

      if (append) {
        setPets(prev => [...prev, ...result.data])
      } else {
        setPets(result.data)
      }

      setHasMore(result.hasMore)
      setOffset((append ? offset : 0) + result.data.length)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching pets:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters, offset])

  /**
   * Load more pets (pagination)
   */
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPets(true)
    }
  }, [isLoading, hasMore, fetchPets])

  /**
   * Update search filters and reset pagination
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setOffset(0)
  }, [])

  /**
   * Update search term with debouncing effect
   */
  const setSearchTerm = useCallback((term) => {
    updateFilters({ search: term })
  }, [updateFilters])

  /**
   * Filter by pet type
   */
  const setType = useCallback((type) => {
    updateFilters({ type, search: undefined })
  }, [updateFilters])

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setPets([])
    setOffset(0)
    setFilters({ limit: 20 })
  }, [])

  return {
    pets,
    isLoading,
    error,
    hasMore,
    fetchPets,
    loadMore,
    updateFilters,
    setSearchTerm,
    setType,
    clearFilters,
    filters,
  }
}
