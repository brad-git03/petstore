-- V4: Create performance indexes
-- Pets table indexes
CREATE INDEX idx_pet_type ON pets(type);
CREATE INDEX idx_pet_price ON pets(price_cents);
CREATE INDEX idx_pet_created_at ON pets(created_at DESC);
CREATE INDEX idx_pet_name ON pets(name);
CREATE INDEX idx_pet_category ON pets(category_id);

-- Inventory table indexes
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_pet ON inventory(pet_id);
