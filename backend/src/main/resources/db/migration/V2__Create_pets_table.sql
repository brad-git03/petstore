-- V2: Create pets table
CREATE TYPE pet_type AS ENUM ('DOG', 'CAT', 'BIRD', 'FISH');

CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    type pet_type NOT NULL,
    age_years DECIMAL(3, 1) NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents > 0),
    description TEXT,
    photo_url VARCHAR(500),
    category_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pet_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
