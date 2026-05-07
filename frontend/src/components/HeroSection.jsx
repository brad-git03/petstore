import React from 'react';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      
      <div className="hero-content">
        <div className="hero-text-container">
          <h1 className="hero-headline">Find Your Perfect Companion</h1>
          <p className="hero-subtext">
            Every pet deserves a loving home. Discover a wide variety of animals waiting to become a part of your family. Experience the joy of unconditional love today.
          </p>
          <div className="hero-cta-group">
            <a href="#pets" className="btn btn-primary">Adopt Now</a>
            <a href="#pets" className="btn btn-secondary">Browse Pets</a>
          </div>
        </div>
      </div>
      
      {/* Decorative floating elements */}
      <div className="floating-blob blob-1"></div>
      <div className="floating-blob blob-2"></div>
    </section>
  );
}
