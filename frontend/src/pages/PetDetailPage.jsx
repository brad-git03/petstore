import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetDetail } from '../services/catalogApi';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import AdoptionModal from '../components/AdoptionModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PetDetailPage.css';

const PetDetailPage = () => {
  const { id } = useParams();
  
  // Extract UUID from the end of the slug if it exists. 
  // UUID length is 36. Example: buddy-golden-retriever-12345678-1234...
  const petId = id && id.length >= 36 ? id.slice(-36) : id;
  
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, cart } = useCart();
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  
  const favorited = pet ? isFavorite(pet.id) : false;
  const inCart = pet ? cart.some(p => p.id === pet.id) : false;

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const data = await getPetDetail(petId);
        setPet(data);
        setActiveImage(data.photoUrl || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80');
        setError(null);
      } catch (err) {
        setError('Failed to load pet details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  if (loading) {
    return (
      <div className="pet-detail-page">
        <Navbar />
        <div className="detail-container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Fetching pet details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="pet-detail-page">
        <Navbar />
        <div className="detail-container">
          <div className="error-state">
            <h2>Oops!</h2>
            <p>{error || 'Pet not found'}</p>
            <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  // Mocking multiple images for the gallery
  const galleryImages = [
    pet.photoUrl || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    'https://images.unsplash.com/photo-1537151608804-ea6f23b20757?w=800&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80'
  ];

  return (
    <div className="pet-detail-page">
      <Navbar />
      
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-link">
          <span className="back-icon">&larr;</span> Back to Catalog
        </button>
        
        <div className="pet-detail-card">
          <div className="pet-gallery-section">
            <div className="pet-detail-image-wrapper">
              <img 
                src={activeImage} 
                alt={pet.name} 
                className="pet-detail-image" 
              />
              {pet.availability && (
                <span className={`detail-availability ${pet.availability === 'Available' ? 'available' : 'out-of-stock'}`}>
                  {pet.availability}
                </span>
              )}
            </div>
            
            <div className="image-thumbnails">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="pet-detail-info">
            <div className="pet-detail-header">
              <div className="title-wrapper">
                <h1 className="pet-detail-name">{pet.name}</h1>
                <p className="pet-detail-breed">{pet.breed}</p>
              </div>
              <span className="pet-detail-price">${pet.priceUsd ? pet.priceUsd.toFixed(2) : (pet.priceCents / 100).toFixed(2)}</span>
            </div>
            
            <div className="pet-detail-stats">
              <div className="stat-item">
                <span className="stat-label">Type</span>
                <span className="stat-value">{pet.type}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Age</span>
                <span className="stat-value">{pet.ageYears} {pet.ageYears === 1 ? 'year' : 'years'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Gender</span>
                <span className="stat-value">Male</span> {/* Mock data */}
              </div>
              <div className="stat-item">
                <span className="stat-label">Weight</span>
                <span className="stat-value">12 lbs</span> {/* Mock data */}
              </div>
            </div>
            
            <div className="pet-detail-description">
              <h3>About {pet.name}</h3>
              <p>{pet.description || `${pet.name} is a wonderful ${pet.breed} looking for a loving forever home. They are well-behaved, friendly, and ready to become your new best friend. Contact us to learn more!`}</p>
            </div>

            <div className="health-info-section">
              <h3>Health & Care</h3>
              <ul className="health-list">
                <li><span className="icon">✓</span> Vaccinations up to date</li>
                <li><span className="icon">✓</span> Spayed / Neutered</li>
                <li><span className="icon">✓</span> Microchipped</li>
                <li><span className="icon">✓</span> Health check completed</li>
              </ul>
            </div>

            <div className="shelter-info">
              <div className="shelter-icon">🏠</div>
              <div className="shelter-details">
                <h4>Lumina Main Shelter</h4>
                <p>123 Pet Avenue, San Francisco, CA</p>
                <a href="#" className="contact-shelter">View Map & Details</a>
              </div>
            </div>
            
            <div className="pet-detail-actions">
              <button 
                className="btn-adopt" 
                disabled={pet.availability !== 'Available'}
                onClick={() => setIsAdoptionModalOpen(true)}
              >
                {pet.availability === 'Available' ? 'Adopt Now' : 'Currently Unavailable'}
              </button>
              <button 
                className={`btn-cart ${inCart ? 'active' : ''}`}
                onClick={() => addToCart(pet)}
              >
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
              <button 
                className={`btn-favorite ${favorited ? 'active' : ''}`} 
                aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggleFavorite(pet)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={favorited ? "#ec4899" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Recently Viewed Pets Mock Carousel */}
        <div className="recently-viewed-section">
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>Recently Viewed</h2>
          <div className="recently-viewed-carousel">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="recent-pet-card">
                <img src={`https://images.unsplash.com/photo-1543466835-00a7907e9de${item}?w=300&q=80`} alt="Recent Pet" className="recent-pet-img" />
                <div className="recent-pet-info">
                  <h4>Playful Buddy {item}</h4>
                  <p>Dog • 2 yrs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AdoptionModal isOpen={isAdoptionModalOpen} onClose={() => setIsAdoptionModalOpen(false)} pet={pet} />
      <Footer />
    </div>
  );
};

export default PetDetailPage;
