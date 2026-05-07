import React, { useState, useEffect } from 'react'
import { getCategories } from '../services/catalogApi'
import usePetSearch from '../hooks/usePetSearch'
import CategoryBrowser from '../components/CategoryBrowser'
import PetCard from '../components/PetCard'
import PaginationControl from '../components/PaginationControl'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import TrustElements from '../components/TrustElements'
import Footer from '../components/Footer'
import './CatalogPage.css'

/**
 * CatalogPage
 * 
 * Main browsing view for the pet catalog.
 */
export default function CatalogPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const petSearch = usePetSearch()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory && selectedCategory.slug) {
      const slug = selectedCategory.slug.toLowerCase();
      let petType;
      if (slug.includes('fish')) petType = 'FISH';
      else if (slug.includes('dog')) petType = 'DOG';
      else if (slug.includes('cat')) petType = 'CAT';
      else if (slug.includes('bird')) petType = 'BIRD';
      
      petSearch.setType(petType);
    } else {
      petSearch.clearFilters()
    }
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  useEffect(() => {
    petSearch.fetchPets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petSearch.filters])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        if (petSearch.hasMore && !petSearch.isLoading) {
          petSearch.loadMore()
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [petSearch.hasMore, petSearch.isLoading, petSearch.loadMore])

  return (
    <div className="catalog-page">
      <Navbar />
      <HeroSection />

      <main className="catalog-main" id="pets">
        <div className="container">
          
          <div className="section-header">
            <h2>Meet Our Pets</h2>
            <p>Find the perfect companion that fits your lifestyle.</p>
          </div>

          {!categoriesLoading && (
            <CategoryBrowser
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          )}

          {petSearch.isLoading && petSearch.pets.length === 0 && !petSearch.error ? (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Loading your future best friends...</p>
            </div>
          ) : petSearch.pets.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No pets found</h3>
              <p>Try adjusting your filters or search for something else.</p>
            </div>
          ) : (
            <>
              <div className="pets-grid">
                {petSearch.pets.map(pet => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>

              <PaginationControl
                hasMore={petSearch.hasMore}
                isLoading={petSearch.isLoading}
                onLoadMore={petSearch.loadMore}
              />
            </>
          )}

          {petSearch.error && (
            <div className="error-message">
              <p>Error: {petSearch.error}</p>
            </div>
          )}
        </div>
      </main>

      <TrustElements />
      <Footer />
    </div>
  )
}
