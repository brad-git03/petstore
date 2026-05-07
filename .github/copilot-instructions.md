<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

**Current Implementation Plan**: [specs/001-product-catalog/plan.md](../specs/001-product-catalog/plan.md)

This plan contains:
- Technical stack: Java 17+ Spring Boot, React 18+, PostgreSQL 15+, Tailwind CSS, Material-UI
- Database schema: pets, categories, inventory tables with indexes
- API contracts: GET /api/pets, /api/pets/{id}, /api/categories endpoints
- Component structure: Backend service + Frontend React SPA
- Render free-tier deployment constraints: 256MB RAM, 5 connections max
- Constitution alignment: Layered architecture, API-first design, component reusability

See also:
- [Feature Specification](../specs/001-product-catalog/spec.md)
- [Data Model](../specs/001-product-catalog/data-model.md)
- [API Contracts](../specs/001-product-catalog/contracts/catalog-api.md)
- [Quick Start Guide](../specs/001-product-catalog/quickstart.md)
<!-- SPECKIT END -->
