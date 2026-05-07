# API Contract: Product Catalog REST Endpoints

**Date**: 2026-04-30  
**Phase**: 1 - Design & Contracts  
**Status**: Complete  
**Format**: RESTful JSON APIs  
**Authentication**: Public endpoints (no authentication required for catalog browsing)

---

## Base URL

**Development**: `http://localhost:8080/api`  
**Production (Render)**: `https://<backend-service>.onrender.com/api`

---

## Endpoints Overview

| Method | Endpoint | Purpose | Priority |
|--------|----------|---------|----------|
| GET | `/categories` | List all pet categories | P1 |
| GET | `/pets` | Browse/search/filter pets | P1 |
| GET | `/pets/{id}` | Get pet details | P1 |
| GET | `/health` | Health check (Render monitoring) | P1 |
| GET, PUT | `/users/{id}` | Get/Update user profile info | P2 |
| GET, POST, DELETE | `/favorites` | Manage user wishlist | P2 |
| GET, POST, DELETE | `/cart` | Manage user shopping cart | P2 |
| POST | `/applications` | Submit an adoption application | P2 |

---

## Endpoint: GET `/categories`

**Purpose**: Retrieve all pet categories (Dogs, Cats, Birds, Fishes)

**Request**:
```
GET /api/categories
Content-Type: application/json
```

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Dogs",
      "slug": "dogs",
      "description": "Canine companions of various breeds",
      "iconUrl": "https://cdn.example.com/dog-icon.svg"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Cats",
      "slug": "cats",
      "description": "Feline friends in different sizes",
      "iconUrl": "https://cdn.example.com/cat-icon.svg"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Birds",
      "slug": "birds",
      "description": "Feathered pets and avian varieties",
      "iconUrl": "https://cdn.example.com/bird-icon.svg"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Fishes",
      "slug": "fishes",
      "description": "Aquatic and freshwater fish species",
      "iconUrl": "https://cdn.example.com/fish-icon.svg"
    }
  ],
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Response** (500 Server Error):
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Performance**: Expected <100ms (cached in memory or Redis)

---

## Endpoint: GET `/pets`

**Purpose**: Browse, search, and filter pets with pagination

**Request**:
```
GET /api/pets?type=DOG&search=buddy&priceMin=10000&priceMax=50000&sortBy=newest&limit=20&offset=0
Content-Type: application/json
```

**Query Parameters**:

| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| `type` | string | No | - | Filter by pet type (DOG, CAT, BIRD, FISH) | `DOG` |
| `search` | string | No | - | Search by pet name (case-insensitive) | `buddy` |
| `priceMin` | integer | No | - | Minimum price in cents | `10000` |
| `priceMax` | integer | No | - | Maximum price in cents | `50000` |
| `sortBy` | string | No | `newest` | Sort order: `newest`, `price_asc`, `price_desc` | `price_asc` |
| `limit` | integer | No | `20` | Results per page (max 100) | `20` |
| `offset` | integer | No | `0` | Pagination offset | `0` |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440010",
      "name": "Buddy",
      "breed": "Golden Retriever",
      "type": "DOG",
      "price": 15000,
      "photoUrl": "https://cdn.example.com/buddy.jpg",
      "availability": "AVAILABLE"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440011",
      "name": "Max",
      "breed": "Labrador",
      "type": "DOG",
      "price": 14000,
      "photoUrl": "https://cdn.example.com/max.jpg",
      "availability": "OUT_OF_STOCK"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150,
    "hasMore": true
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Response** (400 Bad Request - Invalid Parameters):
```json
{
  "success": false,
  "error": "Invalid type parameter. Must be one of: DOG, CAT, BIRD, FISH",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Response** (500 Server Error):
```json
{
  "success": false,
  "error": "Database query failed",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Performance**: Expected <1 second with proper indexing (<500ms typical)

**Cache Strategy**: Results can be cached for 5 minutes; invalidate on inventory updates

---

## Endpoint: GET `/pets/{id}`

**Purpose**: Retrieve detailed information for a single pet

**Request**:
```
GET /api/pets/650e8400-e29b-41d4-a716-446655440010
Content-Type: application/json
```

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Pet unique identifier |

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440010",
    "name": "Buddy",
    "breed": "Golden Retriever",
    "type": "DOG",
    "age": 2.5,
    "price": 15000,
    "description": "Friendly and energetic Golden Retriever, great with families. Loves fetch and swimming!",
    "photoUrl": "https://cdn.example.com/buddy-full.jpg",
    "availability": "AVAILABLE",
    "quantity": 1,
    "createdAt": "2026-04-15T08:30:00Z"
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Response** (404 Not Found):
```json
{
  "success": false,
  "error": "Pet not found",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Response** (400 Bad Request - Invalid UUID):
```json
{
  "success": false,
  "error": "Invalid pet ID format. Must be a valid UUID.",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Response** (500 Server Error):
```json
{
  "success": false,
  "error": "Database query failed",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Performance**: Expected <50ms (single row lookup)

**Cache Strategy**: Cache per-pet details for 10 minutes; invalidate on inventory updates

---

## Endpoint: GET `/health`

**Purpose**: Render health check endpoint for service monitoring

**Request**:
```
GET /api/health
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "status": "UP",
  "service": "petstore-catalog-api",
  "timestamp": "2026-04-30T12:00:00Z",
  "database": "CONNECTED"
}
```

**Response** (503 Service Unavailable - DB Down):
```json
{
  "status": "DOWN",
  "service": "petstore-catalog-api",
  "timestamp": "2026-04-30T12:00:00Z",
  "database": "DISCONNECTED",
  "error": "Cannot connect to PostgreSQL"
}
```

**Performance**: Expected <10ms (no database query)

---

## New Endpoints (Phase 2 - User & Adoption Features)

### User Profile Management
- `GET /api/users/{id}`: Retrieve profile (name, email, phone, location, home_type)
- `PUT /api/users/{id}`: Update profile details

### Favorites (Wishlist)
- `GET /api/favorites`: List favorited pet IDs for current user
- `POST /api/favorites`: Add a pet to favorites (`{ "petId": "uuid" }`)
- `DELETE /api/favorites/{petId}`: Remove a pet from favorites

### Cart Management
- `GET /api/cart`: Get current user's cart items
- `POST /api/cart`: Add pet to cart (`{ "petId": "uuid", "quantity": 1 }`)
- `DELETE /api/cart/{petId}`: Remove pet from cart

### Adoption Applications
- `POST /api/applications`: Submit adoption form
  - **Request Body**: `{ "petId": "uuid", "applicantName": "...", "applicantEmail": "...", "applicantPhone": "...", "address": "...", "message": "..." }`
  - **Response**: `{ "success": true, "applicationId": "uuid", "status": "SUBMITTED" }`

---

## Error Handling Standards

All errors follow this format:

**Structure**:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "errorCode": "VALIDATION_ERROR|NOT_FOUND|INTERNAL_ERROR",
  "timestamp": "ISO8601 timestamp"
}
```

**HTTP Status Codes**:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters, validation failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server error
- `503 Service Unavailable`: Database or external service down

---

## Rate Limiting

**Not implemented in MVP** but reserved for future phases:
- Recommended: 100 requests/minute per IP for public endpoints
- Implement via Spring Cloud Gateway or custom interceptor

---

## CORS Configuration

**Allowed Origins** (for frontend): `http://localhost:3000` (dev), `https://<frontend-site>.onrender.com` (prod)

**Allowed Methods**: GET, OPTIONS

**Allowed Headers**: Content-Type, Accept

---

## Response Time Budgets

| Endpoint | Budget | Constraint Reason |
|----------|--------|------------------|
| GET /categories | <100ms | Cached; small data set |
| GET /pets | <1000ms | Database query with filters; must respect Render limits |
| GET /pets/{id} | <50ms | Single-row lookup |
| GET /health | <10ms | No DB query |

---

## Frontend Integration Notes

### Pagination Example (Infinite Scroll)

**First Load**:
```javascript
GET /api/pets?type=DOG&limit=20&offset=0
```

**Load More** (auto-triggered at scroll):
```javascript
GET /api/pets?type=DOG&limit=20&offset=20
```

**Continue paginating**:
```javascript
GET /api/pets?type=DOG&limit=20&offset=40  // next 20
GET /api/pets?type=DOG&limit=20&offset=60  // next batch
```

### Search with Filters Example

**All dogs, price $100-$300, cheapest first**:
```javascript
GET /api/pets?type=DOG&priceMin=10000&priceMax=30000&sortBy=price_asc&limit=20&offset=0
```

**Search for "buddy", any type, default sort**:
```javascript
GET /api/pets?search=buddy&limit=20&offset=0
```

---

## Implementation Notes

- All timestamps in UTC/ISO8601 format
- All prices in **cents** (not dollars) to avoid floating-point rounding issues
- UUIDs generated server-side for all entities
- No authentication required for catalog endpoints (future: add for cart/checkout)
