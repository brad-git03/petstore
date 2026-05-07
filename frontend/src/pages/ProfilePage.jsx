import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    homeType: 'House with Fenced Yard'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here we would typically send an API request to save
  };

  const { favorites } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="tab-pane active fade-in">
            <h2 className="pane-title">Profile Information</h2>
            <div className="profile-info-card">
              <div className="profile-header">
                <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="profile-avatar-large" />
                <div className="profile-name-group">
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleInputChange} 
                      className="edit-input edit-input-title"
                    />
                  ) : (
                    <h3>{profileData.name}</h3>
                  )}
                  <p className="profile-member-since">Member since Jan 2024</p>
                </div>
                {isEditing ? (
                  <button className="btn-edit-profile save" onClick={handleSaveProfile}>Save Changes</button>
                ) : (
                  <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
              </div>
              
              <div className="profile-details-grid">
                <div className="detail-group">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="edit-input" />
                  ) : (
                    <p>{profileData.email}</p>
                  )}
                </div>
                <div className="detail-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input type="text" name="phone" value={profileData.phone} onChange={handleInputChange} className="edit-input" />
                  ) : (
                    <p>{profileData.phone}</p>
                  )}
                </div>
                <div className="detail-group">
                  <label>Location</label>
                  {isEditing ? (
                    <input type="text" name="location" value={profileData.location} onChange={handleInputChange} className="edit-input" />
                  ) : (
                    <p>{profileData.location}</p>
                  )}
                </div>
                <div className="detail-group">
                  <label>Home Type</label>
                  {isEditing ? (
                    <select name="homeType" value={profileData.homeType} onChange={handleInputChange} className="edit-input">
                      <option value="House with Fenced Yard">House with Fenced Yard</option>
                      <option value="House without Yard">House without Yard</option>
                      <option value="Apartment / Condo">Apartment / Condo</option>
                      <option value="Townhouse">Townhouse</option>
                    </select>
                  ) : (
                    <p>{profileData.homeType}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'adopted':
        return (
          <div className="tab-pane active fade-in">
            <h2 className="pane-title">Adopted Pets & Orders</h2>
            <div className="empty-state">
              <span className="empty-icon">🏠</span>
              <h3>No adopted pets yet</h3>
              <p>You haven't completed any adoptions. When you do, they will appear here along with your order history.</p>
              <Link to="/" className="btn-primary-small">Browse Pets</Link>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="tab-pane active fade-in">
            <h2 className="pane-title">Adoption Application Status</h2>
            <div className="application-tracker">
              <div className="tracker-card">
                <div className="tracker-header">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&q=80" alt="Pet" className="tracker-pet-img" />
                  <div className="tracker-pet-info">
                    <h4>Application for Buddy</h4>
                    <p>Submitted on Oct 15, 2024</p>
                  </div>
                  <span className="status-badge in-progress">Under Review</span>
                </div>
                
                <div className="progress-bar-container">
                  <div className="progress-step completed">
                    <div className="step-circle">✓</div>
                    <span>Submitted</span>
                  </div>
                  <div className="progress-step active">
                    <div className="step-circle">2</div>
                    <span>Under Review</span>
                  </div>
                  <div className="progress-step">
                    <div className="step-circle">3</div>
                    <span>Interview</span>
                  </div>
                  <div className="progress-step">
                    <div className="step-circle">4</div>
                    <span>Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'wishlist':
        return (
          <div className="tab-pane active fade-in">
            <h2 className="pane-title">Your Wishlist</h2>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">❤️</span>
                <h3>Your wishlist is empty</h3>
                <p>Save pets you're interested in by clicking the heart icon on their cards.</p>
                <Link to="/" className="btn-primary-small">Discover Pets</Link>
              </div>
            ) : (
              <div className="wishlist-grid">
                {favorites.map(pet => (
                  <div key={pet.id} className="wishlist-card">
                    <img src={pet.photoUrl || 'https://via.placeholder.com/150'} alt={pet.name} />
                    <div className="wishlist-card-info">
                      <h4>{pet.name}</h4>
                      <p>{pet.breed}</p>
                      <Link to={`/pet/${pet.name ? pet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'pet'}-${pet.id}`} className="btn-view-small">View Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="tab-pane active fade-in">
            <h2 className="pane-title">Reviews & Ratings</h2>
            <div className="empty-state">
              <span className="empty-icon">⭐</span>
              <h3>No reviews yet</h3>
              <p>After you adopt a pet or visit a partner shelter, you can leave a review here.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-pane active fade-in">
            <h2 className="pane-title">Account Settings</h2>
            
            <div className="settings-section">
              <h3>Security</h3>
              <div className="setting-row">
                <div>
                  <h4>Change Password</h4>
                  <p>Update your password to keep your account secure.</p>
                </div>
                <button className="btn-secondary-small">Update</button>
              </div>
              <div className="setting-row">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="setting-row">
                <div>
                  <h4>Email Alerts</h4>
                  <p>Get notified when a pet matching your preferences is added.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-row">
                <div>
                  <h4>Application Updates</h4>
                  <p>Receive SMS updates about your adoption applications.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            <div className="settings-section danger-zone">
              <h3>Danger Zone</h3>
              <div className="setting-row">
                <div>
                  <h4 className="text-danger">Delete Account</h4>
                  <p>Permanently delete your account and all data.</p>
                </div>
                <button className="btn-danger-small">Delete Account</button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="sidebar-user-brief">
            <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="brief-avatar" />
            <div>
              <h4 className="brief-name">{profileData.name}</h4>
              <p className="brief-email">{profileData.email}</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span> Profile Info
            </button>
            <button 
              className={`nav-item ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              <span className="nav-icon">📋</span> Application Status
            </button>
            <button 
              className={`nav-item ${activeTab === 'adopted' ? 'active' : ''}`}
              onClick={() => setActiveTab('adopted')}
            >
              <span className="nav-icon">🐾</span> Adopted Pets
            </button>
            <button 
              className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <span className="nav-icon">❤️</span> Wishlist
            </button>
            <button 
              className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <span className="nav-icon">⭐</span> Reviews & Ratings
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">⚙️</span> Settings
            </button>
          </nav>
          
          <div className="sidebar-logout">
            <button className="btn-logout"><span className="nav-icon">🚪</span> Log Out</button>
          </div>
        </div>
        
        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
