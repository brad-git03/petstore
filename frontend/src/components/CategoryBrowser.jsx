import React, { useState } from 'react'
import './CategoryBrowser.css'

/**
 * CategoryBrowser & Filters Component
 */
const getCategoryIcon = (name) => {
  if (!name) return '🐾';
  const map = {
    'DOGS': '🐕',
    'CATS': '🐈',
    'BIRDS': '🦜',
    'FISHES': '🐠'
  };
  return map[name.toUpperCase()] || '🐾';
};

export default function CategoryBrowser({ categories, selectedCategory, onCategorySelect }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="filter-section-container" id="pets">
      <div className="category-browser">
        <div className="category-tabs">
          <button 
            className={`category-tab ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategorySelect(null)}
          >
            <span className="category-icon" style={{ fontSize: '1.25rem' }}>🐾</span>
            <span>All Pets</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory?.id === category.id ? 'active' : ''}`}
              onClick={() => onCategorySelect(category)}
              title={category.description}
            >
              <span className="category-icon" style={{ fontSize: '1.25rem' }}>
                {getCategoryIcon(category.name)}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <button 
          className={`toggle-filters-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="advanced-filters panel-open">
          <div className="filter-group">
            <label>Price Range</label>
            <input type="range" min="0" max="2000" defaultValue="1000" className="range-slider" />
            <div className="range-labels">
              <span>$0</span>
              <span>$2000+</span>
            </div>
          </div>
          
          <div className="filter-group">
            <label>Age</label>
            <select className="filter-select">
              <option value="">Any Age</option>
              <option value="baby">Baby (0-1 yrs)</option>
              <option value="young">Young (1-3 yrs)</option>
              <option value="adult">Adult (3-7 yrs)</option>
              <option value="senior">Senior (7+ yrs)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Breed</label>
            <select className="filter-select">
              <option value="">Any Breed</option>
              <option value="golden">Golden Retriever</option>
              <option value="persian">Persian Cat</option>
              <option value="beagle">Beagle</option>
              <option value="mixed">Mixed Breed</option>
            </select>
          </div>
          
          <div className="filter-group toggle-group">
            <label className="toggle-label">
              <span>Available Only</span>
              <div className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
