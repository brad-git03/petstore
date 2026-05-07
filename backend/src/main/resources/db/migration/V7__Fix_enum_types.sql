-- V7: Fix PostgreSQL Enum Types for Hibernate Compatibility
-- Hibernate 6 often struggles with querying custom PostgreSQL ENUM types directly,
-- resulting in 'operator does not exist: pet_type = character varying' errors.
-- Converting them to VARCHAR solves this safely and completely.

ALTER TABLE pets ALTER COLUMN type TYPE VARCHAR(50) USING type::text;
DROP TYPE IF EXISTS pet_type CASCADE;

ALTER TABLE inventory ALTER COLUMN status DROP DEFAULT;
ALTER TABLE inventory ALTER COLUMN status TYPE VARCHAR(50) USING status::text;
ALTER TABLE inventory ALTER COLUMN status SET DEFAULT 'AVAILABLE';
DROP TYPE IF EXISTS inventory_status CASCADE;
