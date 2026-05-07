# Quick Start: Product Catalog Feature

**Date**: 2026-04-30  
**For**: Developers implementing the product catalog feature  
**Time to setup**: ~15 minutes

---

## Overview

This document provides a quick reference for developers implementing the Product Catalog feature. See [plan.md](plan.md) for full technical context and [data-model.md](data-model.md) for schema details.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (React + Tailwind + MUI)                       │
│ Components: PetCard, FilterPanel, SearchBar, etc.       │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP GET
                   ▼
┌──────────────────────────────────────────────────────────┐
│ Backend (Spring Boot REST API) - Render Web Service      │
│ Endpoints: GET /api/pets, /api/pets/{id}, /categories   │
└──────────────────┬──────────────────────────────────────┘
                   │ JDBC
                   ▼
┌──────────────────────────────────────────────────────────┐
│ PostgreSQL Database - Render Postgres                    │
│ Tables: pets, categories, inventory                      │
└──────────────────────────────────────────────────────────┘
```

**Principle**: Layered architecture - strict separation of concerns. Backend = data + business logic. Frontend = UI only.

---

## Getting Started - Backend (Java Spring Boot)

### Prerequisites
- JDK 17+
- Maven 3.8+
- PostgreSQL 15+ (local dev or Render instance)
- Git

### Step 1: Backend Project Structure
```bash
cd backend/
├── pom.xml                    # Maven dependencies
├── src/main/java/com/petstore/
│   ├── controller/
│   │   ├── PetController.java      # REST endpoints
│   │   └── CategoryController.java
│   ├── service/
│   │   ├── PetService.java         # Business logic
│   │   └── SearchService.java
│   ├── repository/
│   │   └── PetRepository.java      # Spring Data JPA
│   ├── model/
│   │   ├── Pet.java                # JPA entities
│   │   ├── Category.java
│   │   └── Inventory.java
│   └── Application.java            # Main entry point
├── src/main/resources/
│   ├── application.properties      # Database config
│   └── db/migration/
│       └── V1__Create_pet_schema.sql  # Flyway migrations
└── src/test/java/                 # Unit + integration tests
```

### Step 2: Database Configuration

**File**: `backend/src/main/resources/application.properties`

```properties
# Local Development
spring.datasource.url=jdbc:postgresql://localhost:5432/petstore_dev
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQL15Dialect

# Flyway migrations
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

**File**: `backend/src/main/resources/application-render.properties` (Production)

```properties
# Render Production
spring.datasource.url=${DATABASE_URL}
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=1
spring.jpa.properties.hibernate.jdbc.batch_size=10
```

### Step 3: Create Database Schema

**File**: `backend/src/main/resources/db/migration/V1__Create_pet_schema.sql`

```sql
-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(500),
  icon_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('DOG', 'CAT', 'BIRD', 'FISH')),
  age_years DECIMAL(3,1) NOT NULL CHECK (age_years > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  description TEXT,
  photo_url VARCHAR(500),
  category_id UUID NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, category_id)
);

-- Inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL UNIQUE REFERENCES pets(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OUT_OF_STOCK')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  last_restocked_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_pet_type ON pets(type);
CREATE INDEX idx_pet_price ON pets(price_cents);
CREATE INDEX idx_pet_created_at ON pets(created_at);
CREATE INDEX idx_pet_name ON pets(name);
CREATE INDEX idx_pet_category ON pets(category_id);
CREATE INDEX idx_inventory_status ON inventory(status);
```

### Step 4: Create JPA Entities

**File**: `backend/src/main/java/com/petstore/model/Pet.java`

```java
@Entity
@Table(name = "pets", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "category_id"}))
public class Pet {
    @Id
    private UUID id = UUID.randomUUID();
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 100)
    private String breed;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PetType type;
    
    @Column(nullable = false, name = "age_years")
    private BigDecimal age;
    
    @Column(nullable = false, name = "price_cents")
    private Integer price;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "photo_url", length = 500)
    private String photoUrl;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @OneToOne(mappedBy = "pet", cascade = CascadeType.ALL)
    private Inventory inventory;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Getters & Setters
}

enum PetType {
    DOG, CAT, BIRD, FISH
}
```

### Step 5: Create Repository

**File**: `backend/src/main/java/com/petstore/repository/PetRepository.java`

```java
@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {
    List<Pet> findByType(PetType type, Pageable pageable);
    List<Pet> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Pet> findByTypeBetweenPrices(PetType type, Integer minPrice, Integer maxPrice, Pageable pageable);
    List<Pet> findByPriceCentsBetween(Integer minPrice, Integer maxPrice, Pageable pageable);
}
```

### Step 6: Create Controller

**File**: `backend/src/main/java/com/petstore/controller/PetController.java`

```java
@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = {"http://localhost:3000", "https://*.onrender.com"})
public class PetController {
    
    @Autowired
    private PetService petService;
    
    @GetMapping
    public ResponseEntity<?> searchPets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") Integer priceMin,
            @RequestParam(required = false) Integer priceMax,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "20") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset) {
        
        try {
            var results = petService.searchPets(type, search, priceMin, priceMax, sortBy, limit, offset);
            return ResponseEntity.ok(ApiResponse.success(results));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPetDetail(@PathVariable UUID id) {
        try {
            var pet = petService.getPetDetail(id);
            return ResponseEntity.ok(ApiResponse.success(pet));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Pet not found"));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(ApiResponse.health());
    }
}
```

### Step 7: Build & Run

```bash
# Install dependencies
mvn clean install

# Run locally
mvn spring-boot:run

# Test endpoint
curl http://localhost:8080/api/pets?type=DOG&limit=5
```

---

## Getting Started - Frontend (React)

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Step 1: Frontend Project Structure
```bash
cd frontend/
├── src/
│   ├── components/
│   │   ├── PetCard.jsx           # Pet grid item
│   │   ├── PetDetailView.jsx     # Detail page view
│   │   ├── SearchBar.jsx         # Search input
│   │   ├── FilterPanel.jsx       # Filter controls
│   │   └── PaginationControl.jsx # Load more button
│   ├── pages/
│   │   ├── CatalogPage.jsx       # Main catalog
│   │   └── PetDetailPage.jsx     # Detail page
│   ├── services/
│   │   └── catalogApi.js         # API client (Axios)
│   ├── hooks/
│   │   └── usePetSearch.js       # Custom search hook
│   ├── App.jsx
│   └── index.css                 # Tailwind config
└── package.json
```

### Step 2: Install Dependencies

```bash
npm install
npm install axios react-router-dom @mui/material @mui/icons-material
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: API Service

**File**: `frontend/src/services/catalogApi.js`

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const catalogApi = {
  // Fetch all categories
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data;
  },

  // Search and filter pets
  searchPets: async (params) => {
    const response = await axios.get(`${API_URL}/pets`, { params });
    return response.data;
  },

  // Get pet detail
  getPetDetail: async (petId) => {
    const response = await axios.get(`${API_URL}/pets/${petId}`);
    return response.data.data;
  }
};
```

### Step 4: Pet Card Component

**File**: `frontend/src/components/PetCard.jsx`

```jsx
import { Card, CardMedia, CardContent, Button } from '@mui/material';

export default function PetCard({ pet, onSelect }) {
  return (
    <Card className="w-full h-full hover:shadow-lg transition-shadow">
      <CardMedia
        component="img"
        height="200"
        image={pet.photoUrl}
        alt={pet.name}
        className="object-cover"
      />
      <CardContent>
        <h3 className="text-lg font-bold">{pet.name}</h3>
        <p className="text-sm text-gray-600">{pet.breed}</p>
        <p className="text-lg font-bold mt-2">${(pet.price / 100).toFixed(2)}</p>
        <span className={`badge ${pet.availability === 'AVAILABLE' ? 'badge-success' : 'badge-error'}`}>
          {pet.availability}
        </span>
        <Button 
          variant="contained" 
          fullWidth 
          className="mt-4"
          onClick={() => onSelect(pet.id)}
          disabled={pet.availability !== 'AVAILABLE'}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Step 5: Catalog Page

**File**: `frontend/src/pages/CatalogPage.jsx`

```jsx
import { useState, useEffect } from 'react';
import { catalogApi } from '../services/catalogApi';
import PetCard from '../components/PetCard';
import FilterPanel from '../components/FilterPanel';

export default function CatalogPage() {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    priceMin: 0,
    priceMax: 100000,
    sortBy: 'newest'
  });
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Load categories
    catalogApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    // Load pets with current filters
    setLoading(true);
    catalogApi.searchPets({ ...filters, offset, limit: 20 })
      .then(response => {
        if (offset === 0) {
          setPets(response.data);
        } else {
          setPets([...pets, ...response.data]);
        }
      })
      .finally(() => setLoading(false));
  }, [filters, offset]);

  return (
    <div className="grid grid-cols-4 gap-4">
      <FilterPanel 
        categories={categories} 
        filters={filters} 
        onFilterChange={setFilters}
      />
      <div className="col-span-3">
        <div className="grid grid-cols-3 gap-4">
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} onSelect={(id) => window.location.href = `/pet/${id}`} />
          ))}
        </div>
        <button onClick={() => setOffset(offset + 20)} className="mt-4 btn">
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
}
```

### Step 6: Build & Run

```bash
# Set API URL for development
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env.local

# Start development server
npm start

# Build for production
npm run build
```

---

## Testing Checklist

### Backend Tests
- [ ] `GET /categories` returns all 4 categories
- [ ] `GET /pets?type=DOG` filters by pet type
- [ ] `GET /pets?search=buddy` searches by name
- [ ] `GET /pets?priceMin=100&priceMax=200` filters by price
- [ ] `GET /pets/{id}` returns pet details
- [ ] `GET /health` returns UP status

### Frontend Tests
- [ ] Catalog page loads and displays pets
- [ ] Category filter works
- [ ] Search input filters results
- [ ] Price range slider works
- [ ] Sort dropdown changes order
- [ ] Infinite scroll loads more pets
- [ ] Pet card click navigates to detail page
- [ ] Out-of-stock items show disabled button
- [ ] Responsive layout on mobile (320px), tablet (768px), desktop (1024px)

---

## Deployment Checklist

### Backend (Spring Boot → Render)
- [ ] Database URL configured in environment variables
- [ ] HikariCP connection pool sized for Render (max 5)
- [ ] Health check endpoint working
- [ ] Migrations run automatically on startup
- [ ] Logging configured (structured logs to stdout)
- [ ] Build and deploy to Render Web Service

### Frontend (React → Render Static Site)
- [ ] API URL configured for production environment
- [ ] Build artifacts created (`npm run build`)
- [ ] Deploy `build/` folder to Render Static Site
- [ ] Verify CORS configuration allows requests from frontend domain

---

## Next Steps

1. **Start with backend**: Create Spring Boot project and set up database
2. **Create API contract**: Reference [catalog-api.md](contracts/catalog-api.md)
3. **Build React components**: Follow Material-UI + Tailwind patterns
4. **Integrate and test**: End-to-end testing with both services running
5. **Deploy**: Follow deployment checklist for Render

---

## Common Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors on frontend | Add frontend URL to Spring `@CrossOrigin` annotation |
| Slow queries | Check indexes on `type`, `price_cents`, `created_at` columns |
| Out of memory on Render | Reduce `limit` parameter (max 20-50 pets per request) |
| Database connection pool exhausted | Configure HikariCP `maximum-pool-size=5` for Render free tier |

---

## Documentation References

- [Full Technical Plan](plan.md)
- [Data Model & Schema](data-model.md)
- [API Contracts](contracts/catalog-api.md)
- [Feature Specification](spec.md)
