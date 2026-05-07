<!-- Sync Impact Report: v1.0.0 (initial) | Ratified: 2026-04-30
- New principles: Layered Architecture, API-First Design, Database-Backed, Component Reusability
- New sections: Tech Stack, Deployment & Infrastructure
- No removals (greenfield project)
- All dependent templates validated for alignment
-->

# PetStore E-Commerce Constitution

## Core Principles

### I. Layered Architecture (NON-NEGOTIABLE)
Separate concerns across three tiers: presentation (React frontend), business logic (Spring Boot REST services), and data (Postgres). Each layer has clear responsibilities and interfaces. Backend must not contain UI logic; frontend must not contain business rules. This separation ensures testability, scalability, and independent team development.

### II. API-First Design
Backend functionality MUST be exposed via RESTful APIs. All business operations accessible through defined API contracts before any frontend integration. API documentation required at implementation time. Frontend consumes only documented APIs; no direct database access. This ensures clean boundaries and enables future mobile/third-party clients.

### III. Component Reusability (Frontend)
React components MUST be designed as reusable, self-contained units. Props clearly define dependencies; styles encapsulated (Tailwind utility classes or CSS modules). Shared components extracted to avoid duplication. Material-UI (MUI) components used as foundation for consistency. Component-level testing required before integration.

### IV. Database-Backed State (NON-NEGOTIABLE)
All persistent data stored in Postgres; no in-memory state relied upon for core functionality. Database schema versioned and migration scripts tracked in git. Data integrity constraints enforced at database level. Queries optimized with appropriate indexing. Backup/restore procedures documented for deployment environments.

### V. Free-Tier Deployment Efficiency
Render free services impose resource limits (5 spinning containers max, shared CPU, 256MB RAM per dyno). Application must operate within these constraints: horizontal scaling minimized, background jobs minimal, database connections pooled. Cold start optimization required. Documentation on monitoring resource usage and graceful degradation strategies.

## Technology Stack

**Backend:**
- Framework: Java Spring Boot (latest stable)
- Runtime: JDK 17+
- Build Tool: Maven or Gradle
- API Format: JSON (REST)
- Persistence: Spring Data JPA / Hibernate ORM

**Frontend:**
- Framework: React 18+
- Styling: Tailwind CSS + Material-UI (MUI v5+)
- Build Tool: Vite or Create React App
- State Management: Context API or Redux (if complexity demands)
- HTTP Client: Axios or Fetch API

**Database:**
- Primary: PostgreSQL 15+
- Connection Pooling: HikariCP (backend)

**Deployment:**
- Backend: Render Web Service (free tier)
- Frontend: Render Static Site (free tier)
- Database: Render Postgres (free tier with limitations)
- Version Control: Git on GitHub

## Deployment & Infrastructure

All production services hosted on Render free tier. Backend must include health check endpoint for Render monitoring. Frontend build artifacts uploaded to static hosting. Environment variables for database credentials managed via Render secrets. Database backups scheduled weekly; scripts included in repository for manual restore testing. Monitoring logs retained for 7 days; critical errors must include structured logging for troubleshooting.

## Development Workflow

Feature branches follow naming convention: `feature/{domain}/{description}` (e.g., `feature/products/add-pet-filtering`). Pull requests require at least one approval and passing CI checks. Commits follow conventional commit format (`feat:`, `fix:`, `docs:`, `test:`, `chore:`). Backend changes include unit tests (minimum 70% coverage); frontend components include tests or storybook examples. Database migrations require schema review before merge.

## Governance

This Constitution supersedes all other development practices and project conventions. Amendments require explicit decision documentation and impact assessment on dependent artifacts (spec, plan, tasks). Breaking changes to architecture layers or API contracts MUST trigger constitution review.

**Version**: 1.0.0 | **Ratified**: 2026-04-30 | **Last Amended**: 2026-04-30
