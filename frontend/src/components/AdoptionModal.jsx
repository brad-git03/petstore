import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AdoptionModal.css';

export default function AdoptionModal({ isOpen, onClose, pet }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !pet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, send API request here
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="adopt-modal-overlay" onClick={handleClose}>
      <div className="adopt-modal-content" onClick={e => e.stopPropagation()}>
        {isSubmitted ? (
          <div className="adopt-success-state">
            <div className="success-icon">🎉</div>
            <h2>Application Submitted!</h2>
            <p>Thank you for taking the first step to welcome <strong>{pet.name}</strong> into your home.</p>
            <p className="success-subtext">Our adoption team will review your application and contact you within 24-48 hours to discuss the next steps.</p>
            <button className="btn-close-success" onClick={handleClose}>Return to Catalog</button>
          </div>
        ) : (
          <>
            <button className="adopt-close-btn" onClick={handleClose}>&times;</button>
            <div className="adopt-modal-header">
              <img src={pet.photoUrl || 'https://via.placeholder.com/150'} alt={pet.name} className="adopt-pet-img" />
              <div className="adopt-header-text">
                <h2>Adopt {pet.name}</h2>
                <p className="adopt-breed">{pet.breed}</p>
                <p className="emotional-msg">You're one step away from giving this pet a loving forever home.</p>
              </div>
            </div>

            <form className="adopt-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" required placeholder="(555) 123-4567" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" required placeholder="123 Main St, City, ST" />
                </div>
              </div>

              <div className="form-group">
                <label>Why are you a good fit for {pet.name}? (Optional)</label>
                <textarea rows="3" placeholder="Tell us a little about your home environment..."></textarea>
              </div>

              <div className="adopt-modal-actions">
                <button type="button" className="btn-cancel" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn-submit">Submit Application</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
