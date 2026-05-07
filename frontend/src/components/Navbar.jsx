import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import FavoritesModal from './FavoritesModal';
import CartModal from './CartModal';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { favorites } = useFavorites();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">Lumina Pets</span>
        </Link>

        {/* Center Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="/#pets" className="nav-link">Pets</a>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Right Icons */}
        <div className="navbar-icons">
          <button className="icon-btn cart-btn" aria-label="Wishlist" onClick={() => setIsModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {favorites.length > 0 && <span className="cart-badge">{favorites.length}</span>}
          </button>
          <button className="icon-btn cart-btn" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
          <Link to="/profile" className="icon-btn profile-btn" aria-label="Profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
          <Link to="/admin" className="nav-admin-btn">Admin Dashboard</Link>
        </div>
      </div>
      
      <FavoritesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
