# Research: Product Catalog - Clarification Resolutions

**Date**: 2026-04-30  
**Phase**: 0 - Research & Clarification Resolution  
**Status**: Complete

---

## Research Tasks Completed

### 1. Sorting/Ordering Options (FR-008)

**Decision**: Implement three sort options: **Default (newest first), Price (low-to-high), Price (high-to-low)**

**Rationale**:
- **Newest First**: Highlights recently added pets, creates sense of fresh inventory (important for e-commerce)
- **Price Low-to-High**: Helps budget-conscious buyers find affordable options
- **Price High-to-High**: For premium pet seekers
- **Alternatives Considered**:
  - Alphabetical by name: Less relevant for e-commerce (price/freshness more important)
  - Popularity/rating: Requires additional data tracking (out of scope for MVP)
  - Breed/age: Orthogonal to search/filter; complex sorting strategy

**Implementation**: 
- Backend: Add `sortBy` query parameter to GET `/api/pets?sortBy=newest|price_asc|price_desc`
- Frontend: Dropdown/button group in UI to select sort order

---

### 2. Pagination Strategy (FR-009)

**Decision**: **Infinite Scroll with Manual "Load More" Button as Fallback**

**Rationale**:
- **Best for e-commerce**: Users can browse continuously without clicking pagination links
- **Mobile-friendly**: Critical for Render free-tier deployment; no required page navigation
- **Render optimization**: Reduces server load; can lazy-load images as they enter viewport
- **User experience**: Feels modern and natural on mobile devices
- **Alternatives Considered**:
  - Traditional pagination (page numbers): Requires more cognitive overhead; poor mobile UX
  - All at once: Performance risk with hundreds of pets; slow initial page load
  - Load More button only: Less fluid UX but simpler to implement

**Implementation**:
- Initial load: Fetch first 20 pets
- Infinite scroll: Auto-load next 20 as user scrolls to bottom (within 200px)
- Manual fallback: "Load More" button if auto-scroll triggers too frequently
- Debounce scroll events to prevent excessive API calls
- Total display limit: 100 pets before requiring pagination restart (UX best practice)

---

### 3. Mobile Responsiveness (SC-005)

**Decision**: **Minimum viewport width of 320px (iPhone SE) to 1920px (desktop); Full responsive design**

**Rationale**:
- **320px minimum**: Covers 99% of mobile devices in use; aligns with MDN web standards
- **Breakpoints**: 
  - Mobile: 320px-767px (single column, stacked layout)
  - Tablet: 768px-1023px (2-column grid)
  - Desktop: 1024px+ (3-4 column grid)
- **Constraints align**: Render free tier serves static assets efficiently; CSS media queries have no cost
- **Tools**: Tailwind CSS provides responsive classes (sm:, md:, lg:, xl:); Material-UI responsive components

**Implementation**:
- PetCard: Stack vertically on mobile, grid layout on larger screens
- FilterPanel: Collapsible drawer on mobile (MUI Drawer), fixed sidebar on desktop
- SearchBar: Full-width on mobile, constrained width on desktop

---

### 4. Success Measurement Metric (SC-006)

**Decision**: **Use "Browse-to-Detail Conversion Rate" as primary metric for MVP**

**Metric Definition**: (Users viewing pet details) / (Users viewing catalog) × 100%

**Target**: ≥50% of catalog users click into pet details (indicates engagement)

**Rationale**:
- **MVP-appropriate**: Measures core catalog engagement without requiring shopping cart/checkout logic
- **Actionable**: Indicates whether browse experience is discoverable and engaging
- **Future expansion**: Once shopping cart implemented, track "Detail-to-Cart" and "Cart-to-Purchase"
- **Alternatives Considered**:
  - Session duration: Valuable but depends on page content; less direct
  - Click patterns: More granular but complex to track initially
  - User satisfaction: Requires surveys/feedback loop (out of scope for MVP)

**Tracking**: Implement event logging in frontend:
- Event: `catalog_view` on page load
- Event: `pet_detail_clicked` on pet card/link click
- Send to analytics backend (can use simple logging initially)

---

### 5. Out-of-Stock Visibility (Assumption)

**Decision**: **Display out-of-stock pets in catalog with visual indicator; prevent purchase actions**

**Rationale**:
- **Commerce best practice**: Out-of-stock items still showcase inventory variety; builds trust (users see full selection)
- **Future functionality**: "Notify when available" feature can drive re-engagement
- **User expectation**: Amazon, Etsy, PetSmart all display out-of-stock items with clear status
- **Implementation**: 
  - Badge on PetCard: "Out of Stock" label with gray overlay
  - Detail page: "Availability" section clearly shows status
  - Add to Cart button: Disabled when out of stock; tooltip explains why
  - Filter option: Allow toggling "Show out of stock" (optional for MVP Phase 2)

**Alternative Rejected**: Hiding out-of-stock items would reduce perceived catalog size; may frustrate users searching for specific breeds

---

## Clarification Resolution Summary

| Item | Status | Decision | Impact |
|------|--------|----------|--------|
| FR-008: Sorting | ✅ Resolved | Default (newest), Price ASC, Price DESC | Add `sortBy` query parameter |
| FR-009: Pagination | ✅ Resolved | Infinite scroll + manual fallback | Initial 20, lazy-load on scroll |
| SC-005: Mobile | ✅ Resolved | 320px-1920px responsive design | Tailwind breakpoints, MUI responsive |
| SC-006: Success Metric | ✅ Resolved | Browse-to-Detail conversion ≥50% | Add event tracking to frontend |
| Assumption: Out-of-stock | ✅ Resolved | Show with visual indicator | Badge + disabled purchase button |

**Result**: All clarifications resolved. Feature ready for Phase 1 design and contract creation.
