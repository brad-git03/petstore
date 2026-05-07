import React from 'react';
import './TrustElements.css';

export default function TrustElements() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Adopted Bella (Golden Retriever)",
      text: "Lumina Pets made the adoption process so easy and emotional. The health guarantee gave us peace of mind, and Bella is the perfect addition to our family."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=11",
      role: "Adopted Oliver (Maine Coon)",
      text: "The verified shelters feature is incredible. I knew exactly where Oliver was coming from, and the support from the team was outstanding."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "Adopted Charlie (Beagle)",
      text: "Not just a pet store, but a community that truly cares about animal welfare. The UI is stunning, but their dedication to healthy pets is what won me over."
    }
  ];

  return (
    <section className="trust-section">
      <div className="container">
        
        <div className="trust-badges-container">
          <div className="trust-badge-card">
            <div className="trust-icon-wrapper">
              <span className="trust-icon">🛡️</span>
            </div>
            <h3>Verified Partners</h3>
            <p>All our breeders and shelters are thoroughly vetted for ethical practices and animal welfare.</p>
          </div>
          
          <div className="trust-badge-card">
            <div className="trust-icon-wrapper">
              <span className="trust-icon">❤️</span>
            </div>
            <h3>Health Guarantee</h3>
            <p>Every pet comes with a comprehensive health check, vaccinations, and a 30-day health guarantee.</p>
          </div>
          
          <div className="trust-badge-card">
            <div className="trust-icon-wrapper">
              <span className="trust-icon">🤝</span>
            </div>
            <h3>Lifetime Support</h3>
            <p>We're here for you and your pet with ongoing advice, resources, and community support.</p>
          </div>
        </div>

        <div className="testimonials-section">
          <h2 className="section-title">Happy Families</h2>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <h4 className="testimonial-name">{t.name}</h4>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
                <div className="testimonial-stars">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
