
    -- =============================================================================
    -- GRADE A REALTY - PROPERTY SEED DATA
    -- Run this in Supabase SQL Editor to populate the database.
    -- =============================================================================

    -- Ensure we have the Admin user to own these properties
    -- (Assuming the schema seed ran and created user 'a0000000-0000-0000-0000-000000000001')

    -- 1. Modern NY Loft
    WITH new_prop AS (
        INSERT INTO properties (
            owner_id, title, description, property_type, listing_type, status,
            sale_price, address_line1, city, state, postal_code,
            bedrooms, bathrooms, square_feet, amenities,
            latitude, longitude, created_at
        ) VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'Modern Downtown Loft',
            'A stunning modern loft in the heart of the city with floor-to-ceiling windows and open concept living.',
            'condo', 'sale', 'active',
            450000, '123 Main St', 'New York', 'NY', '10001',
            2, 2, 1200, '["Central Air", "Hardwood Floors", "Dishwasher", "Gym Access"]',
            40.7128, -74.0060, NOW()
        ) RETURNING id
    )
    INSERT INTO property_images (property_id, url, is_primary, display_order)
    SELECT id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', true, 1 FROM new_prop;

    -- 2. Suburban Family Home
    WITH new_prop AS (
        INSERT INTO properties (
            owner_id, title, description, property_type, listing_type, status,
            sale_price, address_line1, city, state, postal_code,
            bedrooms, bathrooms, square_feet, amenities,
            latitude, longitude, created_at
        ) VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'Suburban Family Home',
            'Perfect family home with spacious backyard, renovated kitchen, and close to top-rated schools.',
            'house', 'sale', 'active',
            750000, '456 Oak Ln', 'Westfield', 'NJ', '07090',
            4, 3, 2500, '["Garage Parking", "Swimming Pool", "Smart Home", "Fireplace"]',
            40.6587, -74.3477, NOW()
        ) RETURNING id
    )
    INSERT INTO property_images (property_id, url, is_primary, display_order)
    SELECT id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', true, 1 FROM new_prop;

    -- 3. Luxury Miami Villa
    WITH new_prop AS (
        INSERT INTO properties (
            owner_id, title, description, property_type, listing_type, status,
            sale_price, address_line1, city, state, postal_code,
            bedrooms, bathrooms, square_feet, amenities,
            latitude, longitude, created_at
        ) VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'Luxury Villa with Pool',
            'Exclusive luxury villa with private beach access, infinity pool, and home theater.',
            'house', 'sale', 'active',
            2500000, '789 Palm Dr', 'Miami', 'FL', '33101',
            6, 5, 4500, '["Waterfront", "Private Dock", "Home Theater", "Infinity Pool", "Gated"]',
            25.7617, -80.1918, NOW()
        ) RETURNING id
    )
    INSERT INTO property_images (property_id, url, is_primary, display_order)
    SELECT id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', true, 1 FROM new_prop;
