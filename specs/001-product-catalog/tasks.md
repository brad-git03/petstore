---
description: "Task list for Product Catalog feature implementation"
---

# Tasks: Product Catalog

**Input**: Design documents from `/specs/001-product-catalog/`  
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, research.md ✅, contracts/ ✅  
**Status**: Ready for implementation  
**MVP Scope**: Complete Phase 1-4 (US1+US2 minimum for MVP release)

---

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Task can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- **All paths**: Relative to repository root

---

## Dependency Graph

```
Phase 1: Setup
    ↓
Phase 2: Foundational (Database + API Framework)
    ↓
Phase 3: US1 - Browse by Category (P1) ──→ Phase 4: US2 - View Details (P1)
         (can run parallel)                      ↓
              ↓                          Phase 5: US3 - Search (P2)
              └─────────────────────────────────→ ↓
                                        Phase 6: US4 - Filter (P2)
                                                ↓
                                    Phase 7: Polish & Deployment
```

**Critical Path**: Phase 1 → Phase 2 → (Phase 3 || Phase 4) → Phase 5 → Phase 6 → Phase 7

**MVP Minimum**: Phase 1-4 (US1 + US2 fully functional, can skip US3+US4 initially)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold backend and frontend projects

- [X] T001 Create backend project structure with Maven (`backend/pom.xml`, `backend/src/main/java/com/petstore/`)
- [X] T002 [P] Create frontend project structure with React (`frontend/package.json`, `frontend/src/`)
- [X] T003 [P] Initialize Maven dependencies in `backend/pom.xml` (Spring Boot 3.x, Spring Data JPA, PostgreSQL driver, JUnit 5, Mockito)
- [X] T004 [P] Initialize npm dependencies in `frontend/package.json` (React 18, React Router, Axios, Material-UI, Tailwind CSS, Jest)
- [X] T005 [P] Configure Tailwind CSS in `frontend/tailwind.config.js` and `frontend/src/index.css`
- [X] T006 [P] Setup `.gitignore` for backend (`target/`, `*.jar`) and frontend (`node_modules/`, `build/`, `dist/`)

**Checkpoint**: Both projects scaffolded and dependencies resolvable

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, API framework, connection pooling

**⚠️ CRITICAL**: All tasks in this phase MUST complete before user story implementation begins

### Database Schema & Migrations

- [X] T007 Create Flyway migration `backend/src/main/resources/db/migration/V1__Create_categories_table.sql` with categories table (id, name, slug, description, icon_url, created_at)
- [X] T008 [P] Create Flyway migration `backend/src/main/resources/db/migration/V2__Create_pets_table.sql` with pets table (id, name, breed, type ENUM, age_years, price_cents, description, photo_url, category_id FK, created_at, updated_at)
- [X] T009 [P] Create Flyway migration `backend/src/main/resources/db/migration/V3__Create_inventory_table.sql` with inventory table (id, pet_id FK UNIQUE, status ENUM, quantity, last_restocked_at)
- [X] T010 [P] Create Flyway migration `backend/src/main/resources/db/migration/V4__Create_indexes.sql` with all performance indexes (idx_pet_type, idx_pet_price, idx_pet_created_at, idx_pet_name, idx_pet_category, idx_inventory_status, idx_inventory_pet, idx_category_slug)
- [X] T011 [P] Create seed data migration `backend/src/main/resources/db/migration/V5__Seed_categories.sql` (insert Dogs, Cats, Birds, Fishes categories)

### Backend Configuration

- [X] T012 Create Spring Boot application class in `backend/src/main/java/com/petstore/PetstoreApplication.java`
- [X] T013 [P] Configure `backend/src/main/resources/application.properties` (Spring JPA settings, Hibernate dialect for PostgreSQL 15, Flyway settings)
- [X] T014 [P] Create `backend/src/main/resources/application-render.properties` (Render production configuration with DATABASE_URL, HikariCP max-pool-size=5)
- [X] T015 [P] Create HikariCP configuration class in `backend/src/main/java/com/petstore/config/DataSourceConfig.java` (connection pooling, max 5 connections for Render)
- [X] T016 [P] Create JPA configuration class in `backend/src/main/java/com/petstore/config/JpaConfig.java` (Hibernate settings, dialect, batch size)
- [X] T017 [P] Create common API response wrapper in `backend/src/main/java/com/petstore/dto/ApiResponse.java` (success(), error(), health())
- [X] T018 [P] Create global exception handler in `backend/src/main/java/com/petstore/exception/GlobalExceptionHandler.java` (404, 400, 500 responses)

### Health Check & Monitoring

- [X] T019 Create health check controller in `backend/src/main/java/com/petstore/controller/HealthController.java` (GET /api/health endpoint, database connection status)

**Checkpoint**: Foundation ready — database schema versioned, API framework configured, Render resource constraints applied

---

## Phase 3: User Story 1 - Browse Pets by Category (Priority: P1) 🎯 MVP

**Goal**: Users can view all available pets organized by category (Dogs, Cats, Birds, Fishes)

**Independent Test**: User loads catalog page, sees 4 categories, clicks category, sees pets filtered by type

**User Story 1 Implementation**:

### Backend: Models & Repositories

- [ ] T020 [P] [US1] Create Category JPA entity in `backend/src/main/java/com/petstore/model/Category.java` (id, name, slug, description, icon_url, created_at)
- [ ] T021 [P] [US1] Create Pet JPA entity in `backend/src/main/java/com/petstore/model/Pet.java` (all fields per data model, relationships to Category and Inventory)
- [ ] T022 [P] [US1] Create Inventory JPA entity in `backend/src/main/java/com/petstore/model/Inventory.java` (id, pet_id, status, quantity, last_restocked_at)
- [ ] T023 [P] [US1] Create CategoryRepository in `backend/src/main/java/com/petstore/repository/CategoryRepository.java` (extends JpaRepository<Category, UUID>)
- [ ] T024 [P] [US1] Create PetRepository in `backend/src/main/java/com/petstore/repository/PetRepository.java` (extends JpaRepository<Pet, UUID> with custom queries for type/search/price filters)
- [ ] T025 [P] [US1] Create DTOs in `backend/src/main/java/com/petstore/dto/` (PetListItemDto.java, PetDetailDto.java, CategoryDto.java for API responses)

### Backend: Services

- [ ] T026 [US1] Create CategoryService in `backend/src/main/java/com/petstore/service/CategoryService.java` (getAllCategories())
- [ ] T027 [US1] Create PetService in `backend/src/main/java/com/petstore/service/PetService.java` (getPetsByType(), getPetById(), with inventory status mapping)

### Backend: Controllers & Endpoints

- [ ] T028 [US1] Create CategoryController in `backend/src/main/java/com/petstore/controller/CategoryController.java` (GET /api/categories endpoint returning all categories with icons)
- [ ] T029 [US1] Create PetController in `backend/src/main/java/com/petstore/controller/PetController.java` (GET /api/pets?type=DOG&limit=20&offset=0 for browsing, GET /api/pets/{id} for details)
- [ ] T030 [US1] Implement pagination response with metadata in PetController (limit, offset, total, hasMore fields)

### Frontend: Components & Pages

- [ ] T031 [P] [US1] Create PetCard component in `frontend/src/components/PetCard.jsx` (displays name, breed, price, photo, availability badge, reusable card)
- [ ] T032 [P] [US1] Create CategoryBrowser component in `frontend/src/components/CategoryBrowser.jsx` (displays 4 categories as tabs/buttons with icons)
- [ ] T033 [P] [US1] Create CatalogPage in `frontend/src/pages/CatalogPage.jsx` (main browse view with category list and pet grid, infinite scroll, load more button)
- [ ] T034 [P] [US1] Create PaginationControl component in `frontend/src/components/PaginationControl.jsx` (displays load more button with loading state)

### Frontend: Services & Hooks

- [ ] T035 [US1] Create catalog API service in `frontend/src/services/catalogApi.js` (Axios client for GET /api/categories and GET /api/pets)
- [ ] T036 [US1] Create usePetSearch custom hook in `frontend/src/hooks/usePetSearch.js` (manages search state, infinite scroll logic, pagination)
- [ ] T037 [US1] Setup React Router in `frontend/src/App.jsx` (routes to CatalogPage, PetDetailPage)

### Data & Testing

- [ ] T038 [US1] Create seed data script `backend/seed-sample-data.sql` (insert 50-100 sample pets across all categories for testing)
- [ ] T039 [US1] Create integration test in `backend/src/test/java/com/petstore/integration/CatalogBrowseIT.java` (test GET /api/pets?type=DOG returns correct results)
- [ ] T040 [US1] Create component test in `frontend/src/components/PetCard.test.jsx` (test PetCard renders name, price, photo, availability)

**Checkpoint**: US1 complete — Users can browse all pets by category, see 4 categories, filter by type. Ready for independent testing.

---

## Phase 4: User Story 2 - View Pet Details (Priority: P1) 🎯 MVP

**Goal**: Users can click a pet to view full details (name, breed, age, price, availability)

**Independent Test**: User clicks pet card, sees detail page with all information, out-of-stock pet has disabled button

**User Story 2 Implementation**:

### Backend: Services & Controllers (Enhancement)

- [ ] T041 [US2] Enhance PetService with getPetDetail(UUID id) method in `backend/src/main/java/com/petstore/service/PetService.java` (fetch pet + inventory with error handling)
- [ ] T042 [US2] Enhance PetController with GET /api/pets/{id} endpoint in `backend/src/main/java/com/petstore/controller/PetController.java` (return PetDetailDto with full details)
- [ ] T043 [US2] Add 404 handling in PetController for missing pets

### Frontend: Components & Pages

- [ ] T044 [P] [US2] Create PetDetailView component in `frontend/src/components/PetDetailView.jsx` (displays all pet details: name, breed, age, price, description, photo, availability badge)
- [ ] T045 [P] [US2] Create PetDetailPage in `frontend/src/pages/PetDetailPage.jsx` (full detail page layout with back button, availability status, add to cart button state management)
- [ ] T046 [US2] Update React Router in `frontend/src/App.jsx` to handle pet detail route with URL parameter `/pet/:id`

### Frontend: Services (Enhancement)

- [ ] T047 [US2] Enhance catalogApi.js with getPetDetail(petId) method in `frontend/src/services/catalogApi.js`
- [ ] T048 [US2] Add error handling and loading states in PetDetailPage

### Testing

- [ ] T049 [US2] Create integration test in `backend/src/test/java/com/petstore/integration/PetDetailIT.java` (test GET /api/pets/{id} returns full details)
- [ ] T050 [US2] Create component test in `frontend/src/components/PetDetailView.test.jsx` (test detail view renders all fields)
- [ ] T051 [US2] Create end-to-end test (navigate from catalog to detail page, verify all info displays)

**Checkpoint**: US1 + US2 complete — MVP catalog fully functional. Users can browse and view details.

---

## Phase 5: User Story 3 - Search Pets (Priority: P2)

**Goal**: Users can search pets by name to quickly find specific pets

**Independent Test**: User types search term, sees filtered results, empty search shows all pets

**User Story 3 Implementation**:

### Backend: Services & Repositories

- [ ] T052 [US3] Add findByNameContainingIgnoreCase() query method to PetRepository in `backend/src/main/java/com/petstore/repository/PetRepository.java`
- [ ] T053 [US3] Create SearchService in `backend/src/main/java/com/petstore/service/SearchService.java` (searchPets(searchTerm, limit, offset) method)
- [ ] T054 [US3] Enhance PetController to support `?search=` query parameter in `backend/src/main/java/com/petstore/controller/PetController.java`

### Frontend: Components & Pages

- [ ] T055 [P] [US3] Create SearchBar component in `frontend/src/components/SearchBar.jsx` (input field with debounced search, reusable across catalog)
- [ ] T056 [US3] Integrate SearchBar into CatalogPage in `frontend/src/pages/CatalogPage.jsx` (add search input above pet grid)
- [ ] T057 [US3] Update usePetSearch hook to handle search term state and API calls in `frontend/src/hooks/usePetSearch.js`
- [ ] T058 [US3] Add "No results" message when search returns empty in CatalogPage

### Testing

- [ ] T059 [US3] Create integration test in `backend/src/test/java/com/petstore/integration/SearchIT.java` (test search by name returns matching pets)
- [ ] T060 [US3] Create component test for SearchBar in `frontend/src/components/SearchBar.test.jsx` (test debouncing, input handling)
- [ ] T061 [US3] Create functional test (search for "buddy", verify results, clear search, verify all pets return)

**Checkpoint**: US3 complete — Users can search for pets by name

---

## Phase 6: User Story 4 - Filter by Type and Price Range (Priority: P2)

**Goal**: Users can filter pets by pet type and price range to narrow results

**Independent Test**: User applies filters independently, results update correctly, clearing filters shows all pets

**User Story 4 Implementation**:

### Backend: Repositories & Services

- [ ] T062 [US4] Add price range query to PetRepository in `backend/src/main/java/com/petstore/repository/PetRepository.java` (findByPriceCentsBetween method)
- [ ] T063 [US4] Add combined filter query in PetRepository (findByTypeAndPriceRange)
- [ ] T064 [US4] Enhance SearchService with filtering logic in `backend/src/main/java/com/petstore/service/SearchService.java` (apply type, priceMin, priceMax filters)
- [ ] T065 [US4] Enhance PetController to support `?type=DOG&priceMin=10000&priceMax=50000` parameters in `backend/src/main/java/com/petstore/controller/PetController.java`

### Frontend: Components & Integration

- [ ] T066 [P] [US4] Create FilterPanel component in `frontend/src/components/FilterPanel.jsx` (collapsible on mobile, shows type checkboxes and price range slider, uses MUI components)
- [ ] T067 [P] [US4] Create PriceRangeSlider component in `frontend/src/components/PriceRangeSlider.jsx` (input fields for min/max price with MUI Slider)
- [ ] T068 [US4] Integrate FilterPanel into CatalogPage in `frontend/src/pages/CatalogPage.jsx` (add filter panel beside pet grid)
- [ ] T069 [US4] Update usePetSearch hook to handle type and price filter state in `frontend/src/hooks/usePetSearch.js`
- [ ] T070 [US4] Add "Clear Filters" button to CatalogPage

### Sorting Enhancement (from Research)

- [ ] T071 [P] [US4] Add sortBy parameter support to PetController in `backend/src/main/java/com/petstore/controller/PetController.java` (newest, price_asc, price_desc)
- [ ] T072 [P] [US4] Create SortControl component in `frontend/src/components/SortControl.jsx` (dropdown for sort options)
- [ ] T073 [US4] Integrate SortControl into CatalogPage

### Testing

- [ ] T074 [US4] Create integration test in `backend/src/test/java/com/petstore/integration/FilterIT.java` (test type filter, price range filter, combined filters)
- [ ] T075 [US4] Create component test for FilterPanel in `frontend/src/components/FilterPanel.test.jsx` (test filter state changes)
- [ ] T076 [US4] Create functional test (apply filters, verify results, clear filters, verify all pets return, test sorting options)

**Checkpoint**: US4 complete — Users can filter and sort results

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality, performance, documentation, deployment readiness

### Documentation & Deployment

- [ ] T077 [P] Create `.env.example` files for both backend and frontend (template for environment configuration)
- [ ] T078 [P] Create deployment guide in `docs/DEPLOYMENT.md` (steps for deploying to Render: web service, static site, postgres)
- [ ] T079 [P] Update main README.md with project overview, architecture diagram, local setup instructions
- [ ] T080 [P] Create ARCHITECTURE.md documenting layered design (frontend/backend/database separation)

### Performance Optimization

- [ ] T081 Create database query performance analysis script (test common queries with EXPLAIN ANALYZE)
- [ ] T082 [P] Implement image lazy loading in PetCard component in `frontend/src/components/PetCard.jsx`
- [ ] T083 [P] Setup image CDN caching headers in backend (cache-control headers for /api/pets responses)
- [ ] T084 Optimize PostgreSQL indexes if needed (verify idx_pet_type, idx_pet_price, idx_pet_created_at are effective)

### Accessibility & UX Polish

- [ ] T085 [P] Add aria labels and semantic HTML to all components (PetCard, FilterPanel, SearchBar)
- [ ] T086 [P] Test keyboard navigation (tab through categories, filters, search)
- [ ] T087 [P] Verify color contrast meets WCAG AA standards
- [ ] T088 [P] Test responsive design on mobile (320px), tablet (768px), desktop (1024px+) using browser dev tools

### Testing & Quality Gates

- [ ] T089 Add unit tests for all backend services (PetService, SearchService, CategoryService) achieving 70%+ coverage
- [ ] T090 [P] Add unit tests for React hooks (usePetSearch) in `frontend/src/hooks/usePetSearch.test.js`
- [ ] T091 Create end-to-end test suite with Cypress/Playwright (browse catalog, search, filter, view details)
- [ ] T092 [P] Add linting (ESLint for frontend, Checkstyle for backend) to CI/CD

### Monitoring & Logging

- [ ] T093 Add structured logging to backend (SLF4J with JSON output) for error tracking
- [ ] T094 [P] Add frontend error tracking (Sentry or similar for production errors)
- [ ] T095 [P] Configure Render uptime monitoring (health check endpoint)

### Render Free-Tier Optimization

- [ ] T096 Verify HikariCP connection pool is properly configured (test with load)
- [ ] T097 [P] Test cold start performance on Render (measure time to first response)
- [ ] T098 [P] Configure appropriate timeouts for Render resource limits
- [ ] T099 Create runbook for monitoring Render resource usage (CPU, memory, connections)

### Acceptance Testing

- [ ] T100 Create full user workflow test (browse → search → filter → view details → check availability)
- [ ] T101 [P] Test out-of-stock pet behavior (cannot add to cart, button disabled)
- [ ] T102 [P] Test pagination/infinite scroll (load 20, scroll, load more 20, no duplicates)
- [ ] T103 [P] Test error scenarios (bad requests, missing resources, database down) with error messages

**Checkpoint**: Feature complete, polished, tested, documented, ready for production

---

## Phase 8: User & Adoption Features (Recently Completed)

**Purpose**: Expand the user experience with cart, wishlist, profile, and adoption workflows.

### Wishlist & Favorites
- [X] T104 Create `FavoritesContext.jsx` with local storage persistence
- [X] T105 Add `FavoritesModal.jsx` for viewing and managing favorited pets
- [X] T106 Update `PetCard.jsx` and `PetDetailPage.jsx` to toggle favorites with heart icon

### Shopping Cart
- [X] T107 Create `CartContext.jsx` for global cart state
- [X] T108 Build slide-in `CartModal.jsx` with item display and total calculation
- [X] T109 Add "Add to Cart" functionality to Pet Cards and Detail Pages

### User Dashboard & About Page
- [X] T110 Create `ProfilePage.jsx` with sidebar tabs (Profile, Application Status, Wishlist, Settings)
- [X] T111 Add fully functional "Edit Profile" capability with React state
- [X] T112 Create `AboutPage.jsx` with mission, vision, and team members

### Adoption Workflow
- [X] T113 Create `AdoptionModal.jsx` using `ReactDOM.createPortal`
- [X] T114 Implement adoption application form (name, email, phone, address, message)
- [X] T115 Add success state overlay upon application submission
- [X] T116 Update `PetCard` and `PetDetailPage` "Adopt Now" buttons to trigger modal

**Checkpoint**: User & Adoption features fully implemented on the frontend. Backend integrations pending.

---

## Implementation Strategy

### MVP Release Path (Minimum to Launch)
1. Complete Phase 1-2 (setup + foundation)
2. Complete Phase 3-4 (US1 + US2 browse and details)
3. Deploy to Render (basic working catalog)
4. Optional: Phase 5-6 (search + filters for next release)

### Full Feature Release
- Complete all phases 1-7
- All user stories implemented
- Full test coverage
- Production-ready documentation

### Suggested Task Sequence
1. **Backend-first approach**: T001-T019 (setup + foundation), T020-T030 (models + controllers)
2. **Database seeding**: T038 (get sample data loaded)
3. **Frontend-parallel**: T031-T037 (components + pages in parallel with backend)
4. **Testing**: Integrate tests throughout (T039-T040, T049-T051, etc.)
5. **Polish**: Phase 7 tasks as features solidify

### Parallel Execution Opportunities
- All [P] marked tasks can run in parallel
- Backend and frontend can be developed independently (API contracts defined in Phase 1)
- Testing can happen throughout, not just at end

---

## Success Criteria per User Story

**US1 - Browse Pets by Category**: ✅ Pass when users can view all 4 categories and filter pets by type  
**US2 - View Pet Details**: ✅ Pass when users can click pet and see full details with availability status  
**US3 - Search Pets**: ✅ Pass when search returns matching pets within 1 second  
**US4 - Filter by Price & Type**: ✅ Pass when filters apply correctly and results update within 500ms  
**MVP**: ✅ US1 + US2 fully functional, deployed to Render, responding < 3 seconds  

---

## Notes for Developers

- Reference [quickstart.md](specs/001-product-catalog/quickstart.md) for detailed backend/frontend setup
- Reference [catalog-api.md](specs/001-product-catalog/contracts/catalog-api.md) for API contract details
- Reference [data-model.md](specs/001-product-catalog/data-model.md) for database schema
- Run `npm install` after modifying `frontend/package.json`
- Run `mvn clean install` after modifying `backend/pom.xml`
- Migrations run automatically on Spring Boot startup
