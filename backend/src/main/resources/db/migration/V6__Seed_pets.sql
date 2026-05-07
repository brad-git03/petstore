-- V6: Seed pets and inventory
INSERT INTO pets (id, name, breed, type, age_years, price_cents, description, photo_url, category_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Buddy', 'Golden Retriever', 'DOG', 2.5, 80000, 'A very friendly and energetic dog who loves to play fetch.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', (SELECT id FROM categories WHERE slug = 'dogs')),
('22222222-2222-2222-2222-222222222222', 'Luna', 'Siamese', 'CAT', 1.2, 50000, 'Elegant and vocal cat with striking blue eyes.', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=400', (SELECT id FROM categories WHERE slug = 'cats')),
('33333333-3333-3333-3333-333333333333', 'Charlie', 'Macaw', 'BIRD', 5.0, 120000, 'Colorful and very talkative companion.', 'https://images.unsplash.com/photo-1552728089-57169ab00a0b?auto=format&fit=crop&q=80&w=400', (SELECT id FROM categories WHERE slug = 'birds')),
('44444444-4444-4444-4444-444444444444', 'Nemo', 'Clownfish', 'FISH', 0.5, 2500, 'Bright orange and small, perfect for your aquarium.', 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=400', (SELECT id FROM categories WHERE slug = 'fishes')),
('55555555-5555-5555-5555-555555555555', 'Max', 'Bulldog', 'DOG', 3.0, 100000, 'Loyal, sturdy, and great with kids.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400', (SELECT id FROM categories WHERE slug = 'dogs')),
('66666666-6666-6666-6666-666666666666', 'Milo', 'British Shorthair', 'CAT', 2.0, 60000, 'Calm and affectionate indoor cat.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', (SELECT id FROM categories WHERE slug = 'cats'));

INSERT INTO inventory (pet_id, status, quantity) VALUES
('11111111-1111-1111-1111-111111111111', 'AVAILABLE', 1),
('22222222-2222-2222-2222-222222222222', 'AVAILABLE', 1),
('33333333-3333-3333-3333-333333333333', 'OUT_OF_STOCK', 0),
('44444444-4444-4444-4444-444444444444', 'AVAILABLE', 5),
('55555555-5555-5555-5555-555555555555', 'AVAILABLE', 1),
('66666666-6666-6666-6666-666666666666', 'AVAILABLE', 1);
