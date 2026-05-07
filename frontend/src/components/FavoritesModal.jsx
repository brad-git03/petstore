import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import './FavoritesModal.css';

export default function FavoritesModal({ isOpen, onClose }) {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Favorites</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {favorites.length === 0 ? (
            <div className="empty-favorites">
              <span className="empty-icon">💔</span>
              <h3>No favorites yet</h3>
              <p>Start adding some furry friends to your list!</p>
              <button className="btn-browse" onClick={onClose}>Browse Pets</button>
            </div>
          ) : (
            <div className="favorites-list">
              {favorites.map(pet => (
                <div key={pet.id} className="favorite-item">
                  <img src={pet.photoUrl || 'https://via.placeholder.com/150'} alt={pet.name} className="fav-pet-img" />
                  <div className="fav-pet-info">
                    <h4>{pet.name}</h4>
                    <p>{pet.breed}</p>
                    <span className="fav-price">${pet.priceUsd.toFixed(2)}</span>
                  </div>
                  <div className="fav-actions">
                    <Link to={`/pet/${pet.name ? pet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'pet'}-${pet.id}`} className="btn-view" onClick={onClose}>View</Link>
                    <button className="btn-remove" onClick={() => toggleFavorite(pet)} title="Remove from favorites">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {favorites.length > 0 && (
          <div className="modal-footer">
            <button className="btn-clear" onClick={clearFavorites}>Clear All</button>
            <button className="btn-checkout" onClick={onClose}>Continue Browsing</button>
          </div>
        )}
      </div>
    </div>
  );
}
