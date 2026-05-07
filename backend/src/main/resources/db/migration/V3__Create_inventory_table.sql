-- V3: Create inventory table
CREATE TYPE inventory_status AS ENUM ('AVAILABLE', 'OUT_OF_STOCK');

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL UNIQUE,
    status inventory_status NOT NULL DEFAULT 'AVAILABLE',
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    last_restocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);
