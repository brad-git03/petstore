import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🐾</span>
              <span className="logo-text">Lumina Pets</span>
            </Link>
            <p className="footer-desc">
              Connecting loving families with their perfect companions. Dedicated to ethical practices and happy tails since 2026.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📱</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="YouTube">🎥</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><a href="#pets">Browse Pets</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link to="/admin">Admin Login</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Policies</h4>
            <ul className="footer-list">
              <li><a href="#">Adoption Policy</a></li>
              <li><a href="#">Health Guarantee</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact-info">
              <li>
                <span className="contact-icon">📍</span>
                <span>123 Pet Avenue, Suite 400<br/>San Francisco, CA 94105</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>(555) 123-4567</span>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <span>hello@luminapets.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lumina Pets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
