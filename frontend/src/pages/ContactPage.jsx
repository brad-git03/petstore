import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Adoption',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Submit to API logic here
  };

  const faqs = [
    {
      q: "How long does the adoption process take?",
      a: "Typically 3-5 business days. Once your application is reviewed, we'll schedule a meet-and-greet before finalizing the adoption."
    },
    {
      q: "Can I adopt if I live out of state?",
      a: "Yes! However, you must be able to travel to our facility for the final meet-and-greet to ensure a good match."
    },
    {
      q: "What is included in the adoption fee?",
      a: "All pets come spayed/neutered, up-to-date on vaccinations, microchipped, and with a comprehensive health check."
    }
  ];

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our friendly team is always here to chat.</p>
        </div>
      </div>
      
      <div className="contact-main-container">
        <div className="contact-grid">
          
          {/* Contact Information */}
          <div className="contact-info-panel fade-in">
            <h2>Contact Information</h2>
            <p className="contact-subtitle">Fill out the form and our team will get back to you within 24 hours.</p>
            
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h4>Email Us</h4>
                  <p>hello@luminapets.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Location</h4>
                  <p>123 Pet Avenue<br/>San Francisco, CA 94107</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">🕒</div>
                <div>
                  <h4>Business Hours</h4>
                  <p><strong>Mon - Fri:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Sat - Sun:</strong> 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="contact-form-panel fade-in delay-1">
            {isSubmitted ? (
              <div className="contact-success">
                <div className="success-icon">✨</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We have received your message and will get back to you shortly.</p>
                <button className="btn-send" onClick={() => setIsSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send a Message</h2>
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formState.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Jane Doe" 
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formState.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="jane@example.com" 
                  />
                </div>
                
                <div className="form-group">
                  <label>Subject</label>
                  <div className="select-wrapper">
                    <select name="subject" value={formState.subject} onChange={handleChange} required>
                      <option value="Adoption">Adoption Process</option>
                      <option value="Inquiry">General Inquiry</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    name="message" 
                    value={formState.message} 
                    onChange={handleChange} 
                    required 
                    rows="5" 
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>
                
                <p className="contact-note">We usually respond within 24 hours.</p>
                <button type="submit" className="btn-send">Send Message</button>
              </form>
            )}
          </div>
          
        </div>
        
        {/* FAQ Section */}
        <div className="faq-section fade-in delay-2">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about adopting and our shelter.</p>
          </div>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
