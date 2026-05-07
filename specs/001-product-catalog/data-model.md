# Data Model: Product Catalog

**Date**: 2026-04-30  
**Phase**: 1 - Design & Contracts  
**Status**: Complete

---

## Entity Overview

The product catalog data model consists of three core entities with clear relationships enforcing data integrity at the database level.

---

## Entity Definitions

### Entity 1: Pet

**Purpose**: Represents a pet product available for purchase in the catalog

**Table**: `pets`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE per category | Pet's name (e.g., "Buddy", "Whiskers") |
| `breed` | VARCHAR(100) | NOT NULL | Breed (e.g., "Golden Retriever", "Persian Cat") |
| `type` | ENUM('DOG','CAT','BIRD','FISH') | NOT NULL, INDEX | Pet category for filtering |
| `age_years` | DECIMAL(3,1) | NOT NULL, CHECK age_years > 0 | Age in years (e.g., 2.5) |
| `price_cents` | INTEGER | NOT NULL, CHECK price_cents > 0 | Price in cents (e.g., 15000 = $150.00) |
| `description` | TEXT | NULL | Long-form product description |
| `photo_url` | VARCHAR(500) | NULL | Cloud storage URL for pet image |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, INDEX | Insertion timestamp (for "newest first" sorting) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification timestamp |
| `category_id` | UUID | NOT NULL, FOREIGN KEY → categories(id) | Reference to pet category |

**Indexes**:
- `idx_pet_type`: On `type` column (filter by pet category)
- `idx_pet_price`: On `price_cents` column (range queries for price filtering)
- `idx_pet_created_at`: On `created_at` column (sorting by newest)
- `idx_pet_name`: On `name` column (text search optimization)
- `idx_pet_category`: On `category_id` column (foreign key lookup)

**Validation Rules**:
- Name: Required, max 100 characters, unique within category (database constraint)
- Breed: Required, max 100 characters
- Type: Required, one of {DOG, CAT, BIRD, FISH}
- Age: Required, must be > 0, precision to 1 decimal place
- Price: Required, must be > 0 (in cents to avoid floating-point issues)
- Description: Optional, max 2000 characters
- Photo URL: Optional, must be valid URL format if provided

**Relationships**:
- **Has One**: Inventory (tracks availability status via inventory_id FK)
- **Belongs To**: Category (organization/grouping)

---

### Entity 2: Category

**Purpose**: Organizes pets into browsable categories (Dogs, Cats, Birds, Fishes)

**Table**: `categories`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Category name (e.g., "Dogs", "Cats") |
| `slug` | VARCHAR(50) | NOT NULL, UNIQUE | URL-friendly slug (e.g., "dogs", "cats") |
| `description` | VARCHAR(500) | NULL | Category description for marketing |
| `icon_url` | VARCHAR(500) | NULL | Category icon for UI display |

**Indexes**:
- `idx_category_slug`: On `slug` column (URL lookups)

**Validation Rules**:
- Name: Required, max 50 characters, unique
- Slug: Required, max 50 characters, lowercase alphanumeric with hyphens, unique
- Description: Optional, max 500 characters
- Icon URL: Optional, must be valid URL if provided

**Relationships**:
- **Has Many**: Pets (one category contains many pets)

**Seed Data**:
```sql
INSERT INTO categories (id, name, slug, description) VALUES
  (uuid_generate_v4(), 'Dogs', 'dogs', 'Canine companions of various breeds'),
  (uuid_generate_v4(), 'Cats', 'cats', 'Feline friends in different sizes'),
  (uuid_generate_v4(), 'Birds', 'birds', 'Feathered pets and avian varieties'),
  (uuid_generate_v4(), 'Fishes', 'fishes', 'Aquatic and freshwater fish species');
```

---

### Entity 3: Inventory

**Purpose**: Tracks pet availability status and stock levels

**Table**: `inventory`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `pet_id` | UUID | NOT NULL, UNIQUE, FOREIGN KEY → pets(id) | Reference to pet (one-to-one) |
| `status` | ENUM('AVAILABLE','OUT_OF_STOCK') | NOT NULL, DEFAULT 'AVAILABLE' | Current availability |
| `quantity` | INTEGER | NOT NULL, DEFAULT 1, CHECK quantity >= 0 | Number of units in stock |
| `last_restocked_at` | TIMESTAMP | NULL | When stock was last updated |

**Indexes**:
- `idx_inventory_status`: On `status` column (filter available/unavailable)
- `idx_inventory_pet`: On `pet_id` column (lookup inventory for pet)

**Validation Rules**:
- Pet ID: Required, must exist in pets table, one inventory per pet
- Status: Required, one of {AVAILABLE, OUT_OF_STOCK}
- Quantity: Required, must be ≥ 0 (0 = out of stock)
- Last restocked: Optional, indicates manual/automated inventory update timestamp

**Relationships**:
- **Belongs To**: Pet (one-to-one)

**Business Logic**:
- Status is automatically AVAILABLE when quantity > 0
- Status is automatically OUT_OF_STOCK when quantity = 0
- (Future): Status can be manually overridden (e.g., "Reserved", "Back-ordered")

---

## Relationships Diagram

```
┌─────────────────┐
│   Category      │
│   (Dogs,Cats,   │
│   Birds,Fish)   │
└────────┬────────┘
         │
         │ 1:N (Pet.category_id)
         │
         ▼
┌─────────────────┐        ┌──────────────────┐
│      Pet        │◄──────►│    Inventory     │
│  (name, breed,  │ 1:1    │  (status, qty)   │
│   price, type)  │        │                  │
└─────────────────┘        └──────────────────┘
```

---

## Query Patterns (Performance Considerations)

### Browse Catalog by Category
```sql
SELECT p.* FROM pets p
WHERE p.type = 'DOG'
ORDER BY p.created_at DESC
LIMIT 20 OFFSET 0;
```
**Index Used**: `idx_pet_type`, `idx_pet_created_at`  
**Expected**: <100ms with 1000 pets

### Search by Name
```sql
SELECT p.* FROM pets p
WHERE LOWER(p.name) LIKE LOWER('%buddy%')
ORDER BY p.created_at DESC
LIMIT 20;
```
**Index Used**: `idx_pet_name`  
**Note**: Full-text search (FTS) can be added if search becomes bottleneck

### Filter by Type and Price
```sql
SELECT p.* FROM pets p
WHERE p.type = 'DOG' 
  AND p.price_cents BETWEEN 10000 AND 50000
ORDER BY p.price_cents ASC
LIMIT 20;
```
**Indexes Used**: `idx_pet_type`, `idx_pet_price`  
**Expected**: <100ms with proper index coverage

### Get Pet Detail with Availability
```sql
SELECT p.*, i.status, i.quantity 
FROM pets p
LEFT JOIN inventory i ON p.id = i.pet_id
WHERE p.id = ?;
```
**Index Used**: `idx_inventory_pet`  
**Expected**: <20ms single-row lookup

---

## State Transitions

### Pet Lifecycle

```
ACTIVE → (out of stock temporarily) → ACTIVE
   ↓
DISCONTINUED (future state)
```

**Current MVP**: Pets are always "ACTIVE" until manually marked unavailable via Inventory status

### Inventory Status Transitions

```
AVAILABLE ──(quantity becomes 0)──→ OUT_OF_STOCK
     ↑                                    │
     └──────(quantity added)──────────────┘
```

---

## Migration Strategy

### V1 - Initial Schema Creation
- Create `categories` table with 4 seed records
- Create `pets` table with all indexes and constraints
- Create `inventory` table with one-to-one relationship

### V2 - Add Sample Data
- Insert 50-100 sample pets across categories for testing/demo

### V3 - Future: Full-Text Search
- Add PostgreSQL full-text search columns and indexes if needed

---

## Database Constraints & Integrity

| Constraint | Type | Enforced | Rationale |
|-----------|------|----------|-----------|
| Pet.price > 0 | CHECK | DB Level | Prevents invalid negative prices |
| Pet.age > 0 | CHECK | DB Level | Ensures realistic pet ages |
| Inventory.quantity >= 0 | CHECK | DB Level | Quantity cannot be negative |
| Pet name unique per category | UNIQUE | DB Level | No duplicate pet names in same category |
| Category name unique | UNIQUE | DB Level | Each category appears once |
| Pet.category_id NOT NULL | FK | DB Level | Every pet must belong to a category |
| Inventory.pet_id UNIQUE | UNIQUE | DB Level | Each pet has exactly one inventory record |

---

## API DTOs (Data Transfer Objects)

These are used when transferring data between backend and frontend (not stored in DB).

### PetListItemDto
Used for catalog browse/search/filter results:
```json
{
  "id": "uuid",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "type": "DOG",
  "price": 15000,
  "photoUrl": "https://...",
  "availability": "AVAILABLE"
}
```

### PetDetailDto
Used for detail page view:
```json
{
  "id": "uuid",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "type": "DOG",
  "age": 2.5,
  "price": 15000,
  "description": "Beautiful golden retriever...",
  "photoUrl": "https://...",
  "availability": "AVAILABLE",
  "quantity": 1
}
```

### CategoryDto
Used for category listing:
```json
{
  "id": "uuid",
  "name": "Dogs",
  "slug": "dogs",
  "description": "Canine companions...",
  "iconUrl": "https://..."
}
```

---

### Entity 4: User

**Purpose**: Stores user profile information for authentication, profile management, and associating user data.

**Table**: `users`

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL | User's full name |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | User's email address |
| `phone` | VARCHAR(20) | NULL | User's phone number |
| `location` | VARCHAR(255) | NULL | User's physical location |
| `home_type` | VARCHAR(50) | NULL | e.g. "House with Fenced Yard" |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Registration date |

**Relationships**:
- **Has Many**: Favorites, CartItems, AdoptionApplications

---

### Entity 5: Favorite (Wishlist)

**Purpose**: Tracks which pets a user has favorited (added to their wishlist).

**Table**: `favorites`

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `user_id` | UUID | PRIMARY KEY, FOREIGN KEY → users(id) | Associated user |
| `pet_id` | UUID | PRIMARY KEY, FOREIGN KEY → pets(id) | Favorited pet |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date added to wishlist |

**Indexes**:
- `idx_favorites_user`: On `user_id`
- `idx_favorites_pet`: On `pet_id`

---

### Entity 6: CartItem

**Purpose**: Tracks pets that the user has added to their shopping cart.

**Table**: `cart_items`

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | NOT NULL, FOREIGN KEY → users(id) | Associated user |
| `pet_id` | UUID | NOT NULL, FOREIGN KEY → pets(id) | Associated pet |
| `quantity` | INTEGER | NOT NULL, DEFAULT 1 | Number of items |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date added to cart |

**Indexes**:
- `idx_cart_user`: On `user_id`

---

### Entity 7: AdoptionApplication

**Purpose**: Tracks applications submitted by users to adopt a pet.

**Table**: `adoption_applications`

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | NULL, FOREIGN KEY → users(id) | Associated user (optional if guest) |
| `pet_id` | UUID | NOT NULL, FOREIGN KEY → pets(id) | Pet being applied for |
| `applicant_name` | VARCHAR(100) | NOT NULL | Applicant's name |
| `applicant_email`| VARCHAR(100) | NOT NULL | Applicant's email |
| `applicant_phone`| VARCHAR(20) | NOT NULL | Applicant's phone |
| `address` | VARCHAR(255) | NOT NULL | Applicant's physical address |
| `message` | TEXT | NULL | Reason for adoption, fit, etc. |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT 'SUBMITTED' | e.g. SUBMITTED, REVIEW, INTERVIEW, APPROVED |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date submitted |

**Indexes**:
- `idx_adoption_user`: On `user_id`
- `idx_adoption_pet`: On `pet_id`
