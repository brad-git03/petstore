import React from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import AdoptionModal from './AdoptionModal'
import './PetCard.css'

/**
 * PetCard Component
 * 
 * Reusable card component displaying pet information.
 * Shows name, breed, price, photo, and availability status.
 */
export default function PetCard({ pet }) {
  const isAvailable = pet.availability === 'Available'
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart, cart } = useCart()
  const favorited = isFavorite(pet.id)
  const inCart = cart.some(p => p.id === pet.id)
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = React.useState(false)
  
  // Generating some mock data for UI enhancements if they don't exist
  const { rating, personality, gender } = React.useMemo(() => {
    return {
      rating: pet.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
      personality: pet.personality || ['Playful', 'Calm', 'Energetic', 'Affectionate', 'Curious'][Math.floor(Math.random() * 5)],
      gender: pet.gender || (Math.random() > 0.5 ? 'Male' : 'Female')
    };
  }, [pet.id, pet.rating, pet.personality, pet.gender]);

  const slug = pet.name ? pet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'pet';
  const petUrl = `/pet/${slug}-${pet.id}`;

  return (
    <div className="pet-card">
      <Link to={petUrl} className="pet-image-container">
        <img 
          src={pet.photoUrl || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80'} 
          alt={pet.name}
          className="pet-image"
        />
        <div className="pet-image-overlay"></div>
        <span className={`status-badge ${isAvailable ? 'available' : 'out-of-stock'}`}>
          {pet.availability}
        </span>
        <button 
          className={`wishlist-btn ${favorited ? 'active' : ''}`} 
          aria-label="Add to wishlist" 
          onClick={(e) => { 
            e.preventDefault(); 
            toggleFavorite(pet); 
          }}
        >
          <svg viewBox="0 0 24 24" fill={favorited ? "#ec4899" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <button 
          className={`cart-add-btn ${inCart ? 'active' : ''}`} 
          aria-label="Add to cart" 
          onClick={(e) => { 
            e.preventDefault(); 
            addToCart(pet); 
          }}
        >
          <svg viewBox="0 0 24 24" fill={inCart ? "#a855f7" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </button>
      </Link>
      
      <div className="pet-card-body">
        <div className="pet-header">
          <h3 className="pet-name">{pet.name}</h3>
          <div className="pet-rating">
            <span className="star">⭐</span> {rating}
          </div>
        </div>
        
        <p className="pet-breed">{pet.breed}</p>
        
        <div className="pet-tags">
          <span className="tag personality-tag">{personality}</span>
          <span className="tag type-tag">{pet.type}</span>
        </div>
        
        <div className="pet-details">
          <span>{pet.ageYears} yrs</span>
          <span className="dot">•</span>
          <span>{gender}</span>
        </div>
        
        <div className="pet-footer">
          <div className="pet-price">
            <span className="currency">$</span>{pet.priceUsd.toFixed(2)}
          </div>
          <div className="pet-actions">
            <Link to={petUrl} className="btn-view-details">Details</Link>
            <button 
              className="btn-adopt" 
              disabled={!isAvailable}
              onClick={() => setIsAdoptionModalOpen(true)}
            >
              {isAvailable ? 'Adopt' : 'Adopted'}
            </button>
          </div>
        </div>
      </div>
      <AdoptionModal isOpen={isAdoptionModalOpen} onClose={() => setIsAdoptionModalOpen(false)} pet={pet} />
    </div>
  )
}
