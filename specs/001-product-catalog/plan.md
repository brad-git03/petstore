# Implementation Plan: Product Catalog

**Branch**: `001-product-catalog` | **Date**: 2026-04-30 | **Spec**: [specs/001-product-catalog/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-product-catalog/spec.md`

## Summary

Build the product catalog feature allowing users to browse pets by category (Dogs, Cats, Birds, Fishes), view detailed pet information (name, breed, age, price, availability), search by name/attributes, and filter by pet type and price range. Backend will expose REST APIs; frontend will use React with Material-UI and Tailwind CSS. Data persisted in PostgreSQL with indexed queries for performance. Deployment on Render free tier with connection pooling and resource optimization.

## Technical Context

**Language/Version**: Java 17+ (backend), React 18+ (frontend), PostgreSQL 15+  
**Primary Dependencies**: Spring Boot 3.x, Spring Data JPA, React Router, Material-UI v5, Tailwind CSS, Axios  
**Storage**: PostgreSQL 15+ with HikariCP connection pooling  
**Testing**: JUnit 5 + Mockito (backend), Jest + React Testing Library (frontend)  
**Target Platform**: Render free tier (Web Service for backend, Static Site for frontend, Postgres database)  
**Project Type**: Web application (full-stack: React frontend + Spring Boot REST API backend)  
**Performance Goals**: Search results <1s, filter updates <500ms, page load <3s, 95% image load success rate  
**Constraints**: 256MB RAM per dyno, 5 spinning containers max, connection pooling required, minimize cold starts  
**Scale/Scope**: Product catalog for 4 pet categories, ~100-1000 pets initially, responsive design for mobile

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Layered Architecture (NON-NEGOTIABLE)**: Feature respects three-tier separation
- Backend: Spring Boot services exposing REST API with business logic
- Frontend: React components consuming API only, no direct database access
- Data: PostgreSQL with schema versioning
- **Status**: PASS - Will implement GET endpoints for catalog operations; frontend will not access database directly

✅ **API-First Design (NON-NEGOTIABLE)**: Backend must expose REST APIs before frontend integration
- Catalog browsing endpoints: GET /api/pets, GET /api/pets/{id}, GET /api/categories
- Search/filter endpoints: GET /api/pets?search=&type=&priceMin=&priceMax=
- All operations through documented API contracts
- **Status**: PASS - Will create API contract document in Phase 1

✅ **Component Reusability (Frontend)**: React components as self-contained units
- PetCard component for catalog display (reusable across browse, search, filter views)
- PetDetailView component for detail pages
- FilterPanel component for search/filter UI
- **Status**: PASS - Component design follows Tailwind + MUI conventions

✅ **Database-Backed State (NON-NEGOTIABLE)**: All data in Postgres, schema versioned
- Pet data persisted in `pets` table with indexed queries
- Availability tracked in inventory table
- Migrations tracked in git
- **Status**: PASS - No in-memory state for core catalog data

✅ **Free-Tier Deployment Efficiency**: Operates within Render resource limits
- Connection pooling: HikariCP configured for Render (max 5 connections)
- Query optimization: Indexed searches by name, type, price
- Cold start: Stateless API endpoints
- **Status**: PASS - Design minimizes resource consumption

**Gate Result**: ✅ ALL GATES PASS - Feature design aligns with constitution

## Project Structure

### Documentation (this feature)

```text
specs/001-product-catalog/
├── plan.md              # This file
├── research.md          # Phase 0 output - resolved clarifications
├── data-model.md        # Phase 1 output - entity design
├── quickstart.md        # Phase 1 output - developer quick reference
├── contracts/           # Phase 1 output - API contracts
│   └── catalog-api.md   # GET /api/pets, /api/pets/{id}, /api/categories endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Backend: Spring Boot REST API
backend/
├── src/main/java/com/petstore/
│   ├── controller/
│   │   ├── PetController.java          # GET endpoints for catalog
│   │   └── CategoryController.java     # Category endpoints
│   ├── service/
│   │   ├── PetService.java             # Business logic for pets
│   │   ├── SearchService.java          # Search and filter logic
│   │   └── InventoryService.java       # Availability/inventory logic
│   ├── repository/
│   │   ├── PetRepository.java          # JPA repository for pets
│   │   └── InventoryRepository.java    # JPA repository for inventory
│   ├── model/
│   │   ├── Pet.java                    # Pet entity
│   │   ├── Category.java               # Category entity
│   │   ├── Inventory.java              # Inventory entity
│   │   └── dto/                        # Data transfer objects
│   │       ├── PetDto.java
│   │       ├── PetDetailDto.java
│   │       └── CategoryDto.java
│   └── config/
│       ├── DataSourceConfig.java       # HikariCP configuration
│       └── JpaConfig.java              # Hibernate/JPA config
├── src/main/resources/
│   ├── application.properties          # Dev configuration
│   ├── application-render.properties   # Production Render config
│   └── db/migration/                   # Flyway migrations
│       ├── V1__Create_pet_schema.sql
│       └── V2__Create_inventory_schema.sql
├── src/test/java/com/petstore/
│   └── controller/                     # Controller tests
└── pom.xml

# Frontend: React with Tailwind + Material-UI
frontend/
├── src/
│   ├── components/
│   │   ├── PetCard.jsx                 # Reusable pet card component
│   │   ├── PetDetailView.jsx           # Pet details page
│   │   ├── CategoryBrowser.jsx         # Category selection
│   │   ├── SearchBar.jsx               # Search input component
│   │   ├── FilterPanel.jsx             # Filter controls (type, price)
│   │   └── PaginationControl.jsx       # Pagination/load more
│   ├── pages/
│   │   ├── CatalogPage.jsx             # Main catalog page
│   │   └── PetDetailPage.jsx           # Detail page
│   ├── services/
│   │   └── catalogApi.js               # Axios API client
│   ├── hooks/
│   │   └── usePetSearch.js             # Custom hook for search/filter
│   ├── styles/
│   │   └── index.css                   # Tailwind config
│   └── App.jsx
├── tests/
│   ├── components/
│   │   ├── PetCard.test.jsx
│   │   └── FilterPanel.test.jsx
│   └── services/
│       └── catalogApi.test.js
└── package.json

# Database
migrations/
├── 01_create_pet_schema.sql
├── 02_create_inventory_schema.sql
└── 03_add_indexes.sql
```

**Structure Decision**: Full-stack web application with separate backend and frontend services
- **Backend** (`backend/`): Spring Boot REST API exposing catalog operations
- **Frontend** (`frontend/`): React SPA consuming catalog API
- **Database**: PostgreSQL with versioned migrations (Flyway)
- Rationale: Follows layered architecture principle; enables independent scaling of services; Render free tier accommodates both services

## Complexity Tracking

No complexity violations. Feature design aligns with all constitution principles and deployment constraints.

---

## Constitution Re-Check (Post-Design)

*GATE: Verified after Phase 1 design completion*

**Design Artifacts Generated**:
✅ research.md - All clarifications resolved  
✅ data-model.md - Entity design with indexing strategy  
✅ contracts/catalog-api.md - REST API contracts  
✅ quickstart.md - Developer setup guide  
✅ plan.md - Project structure and technical context

**Re-Validation Against All Constitution Principles**:

✅ **I. Layered Architecture (NON-NEGOTIABLE)**: CONFIRMED
- Backend: Spring Boot controllers → services → repositories → database
- Frontend: React components → custom hooks → API service → backend
- No business logic in frontend; no UI logic in backend
- Clear separation maintained across all layers
- **Post-Design Status**: PASS

✅ **II. API-First Design (NON-NEGOTIABLE)**: CONFIRMED
- All catalog operations exposed via documented REST endpoints
- API contracts created before any implementation
- Frontend consumes only via `/api/pets`, `/api/pets/{id}`, `/api/categories`
- No direct database access from frontend
- **Post-Design Status**: PASS

✅ **III. Component Reusability (Frontend)**: CONFIRMED
- PetCard component reusable across browse/search/filter views
- FilterPanel encapsulated with Tailwind + MUI styling
- SearchBar, PaginationControl as independent components
- Props-based composition; styles via CSS modules + Tailwind utilities
- **Post-Design Status**: PASS

✅ **IV. Database-Backed State (NON-NEGOTIABLE)**: CONFIRMED
- All pet data persisted in PostgreSQL with versioned migrations
- Three normalized tables: categories, pets, inventory
- Indexes on type, price, name, created_at for query performance
- Constraints at database level: NOT NULL, UNIQUE, CHECK, FOREIGN KEY
- **Post-Design Status**: PASS

✅ **V. Free-Tier Deployment Efficiency (NON-NEGOTIABLE)**: CONFIRMED
- HikariCP connection pooling: max 5 connections for Render free tier
- Query optimization: indexed searches on name, type, price ranges
- Pagination: 20 pets per load to minimize data transfer
- Cold start: Stateless API endpoints; no long-running jobs
- Resource usage: Designed for 256MB RAM constraint
- **Post-Design Status**: PASS

**Post-Design Gate Result**: ✅ ALL GATES PASS - Design locked and aligned with constitution

---

## Phase 1 Design Completion Summary

**Date Completed**: 2026-04-30

**Artifacts Generated**:
1. ✅ `research.md` - Resolved 5 clarifications (sorting, pagination, mobile, metrics, visibility)
2. ✅ `data-model.md` - Designed 3 entities with indexes, validations, state transitions
3. ✅ `contracts/catalog-api.md` - Documented 4 endpoints with examples, error handling
4. ✅ `quickstart.md` - Step-by-step backend + frontend setup guide
5. ✅ `plan.md` (this file) - Technical context, architecture, compliance gates

**Next Phase**: Phase 2 - Task Generation (via `/speckit.tasks` command)
