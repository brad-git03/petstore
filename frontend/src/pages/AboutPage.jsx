import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrustElements from '../components/TrustElements';
import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    { name: "Dr. Elena Vance", role: "Head Veterinarian", photo: "https://i.pravatar.cc/300?img=47" },
    { name: "Marcus Johnson", role: "Shelter Coordinator", photo: "https://i.pravatar.cc/300?img=12" },
    { name: "Sophia Martinez", role: "Adoption Specialist", photo: "https://i.pravatar.cc/300?img=5" },
    { name: "David Chen", role: "Animal Behaviorist", photo: "https://i.pravatar.cc/300?img=11" }
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>Connecting Hearts, One Paw at a Time</h1>
          <p>We believe every animal deserves a loving home and every home deserves the unconditional love of a pet.</p>
        </div>
      </div>

      <div className="about-container">
        <section className="our-story-section">
          <div className="story-image">
            <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80" alt="Happy dog with owner" />
          </div>
          <div className="story-text">
            <h2 className="section-title">Our Story</h2>
            <p>Founded in 2024, Lumina Pets began with a simple but powerful mission: to revolutionize the pet adoption process. We noticed that traditional shelters were often overwhelmed and potential pet parents found the adoption process stressful and confusing.</p>
            <p>We set out to create a transparent, joyful, and supportive platform that connects ethical breeders and verified shelters directly with loving families. Every pet you see on our platform isn't just an entry in a database; they are a living being waiting for their forever home.</p>
          </div>
        </section>

        <section className="mission-vision-section">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To eliminate animal homelessness by making the adoption process accessible, transparent, and joyful for everyone involved.</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>A world where every born pet is guaranteed a safe, loving, and permanent home, supported by a caring community.</p>
          </div>
        </section>

        <div className="why-choose-us-wrapper">
          <h2 className="section-title text-center">Why Choose Lumina Pets</h2>
          <TrustElements />
        </div>

        <section className="team-section">
          <h2 className="section-title text-center">Meet Our Dedicated Team</h2>
          <p className="team-subtitle">The passionate animal lovers working behind the scenes.</p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.photo} alt={member.name} className="team-photo" />
                <h4 className="team-name">{member.name}</h4>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-cta-section">
          <div className="cta-content">
            <h2>Ready to find your new best friend?</h2>
            <p>Join thousands of happy families who found their perfect companion through Lumina Pets.</p>
            <Link to="/" className="btn-adopt-cta">Browse Pets Now</Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
