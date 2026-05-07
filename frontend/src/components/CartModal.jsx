import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartModal.css';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`cart-panel ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <div className="cart-count">{cart.length}</div>
          <button className="cart-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🐾</span>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any pets to your cart yet.</p>
              <button className="btn-browse-cart" onClick={onClose}>Browse Pets</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(pet => (
                <div key={pet.id} className="cart-item">
                  <img src={pet.photoUrl || 'https://via.placeholder.com/150'} alt={pet.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4>{pet.name}</h4>
                    <p className="cart-item-breed">{pet.breed}</p>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">${(pet.priceUsd ? pet.priceUsd : (pet.priceCents / 100)).toFixed(2)}</span>
                      <button className="btn-remove-cart" onClick={() => removeFromCart(pet.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Adoption Fee</span>
              <span>$50.00</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span className="total-price">${(cartTotal + 50).toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button className="btn-checkout-primary">Proceed to Adoption</button>
              <button className="btn-checkout-secondary" onClick={onClose}>Continue Browsing</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
