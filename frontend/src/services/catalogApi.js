import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Catalog API Service
 * 
 * Axios client for communicating with the backend API.
 */

/**
 * Get all pet categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Search/filter pets
 */
export const searchPets = async (params = {}) => {
  try {
    const response = await api.get('/pets', { params })
    return response.data.data
  } catch (error) {
    console.error('Error searching pets:', error)
    throw error
  }
}

/**
 * Get pets with optional filters
 */
export const getPets = async (filters = {}) => {
  return searchPets(filters)
}

/**
 * Get pet details by ID
 */
export const getPetDetail = async (petId) => {
  try {
    const response = await api.get(`/pets/${petId}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching pet ${petId}:`, error)
    throw error
  }
}

/**
 * Create a new pet
 */
export const createPet = async (petData) => {
  try {
    const response = await api.post('/pets', petData)
    return response.data.data
  } catch (error) {
    console.error('Error creating pet:', error)
    throw error
  }
}

/**
 * Update an existing pet
 */
export const updatePet = async (petId, petData) => {
  try {
    const response = await api.put(`/pets/${petId}`, petData)
    return response.data.data
  } catch (error) {
    console.error(`Error updating pet ${petId}:`, error)
    throw error
  }
}

/**
 * Delete a pet
 */
export const deletePet = async (petId) => {
  try {
    const response = await api.delete(`/pets/${petId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting pet ${petId}:`, error)
    throw error
  }
}

export default api
