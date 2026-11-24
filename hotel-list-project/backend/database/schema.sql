-- First create the database once: CREATE DATABASE hotel_list_db;
-- Then connect to hotel_list_db and run this file.
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  price NUMERIC(12,2) NOT NULL CHECK (price > 0),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS hotels_title_idx ON hotels USING GIN (to_tsvector('english', title));

-- Optional sample records. Run once after copying the sample-images folder to backend/public.
INSERT INTO hotels (title, description, latitude, longitude, price, image_url) VALUES
('Green Valley Resort', 'A peaceful mountain resort surrounded by green hills, offering comfortable rooms, fresh local food and beautiful valley views. Ideal for a relaxing family holiday.', 11.4102000, 76.6950000, 2500, '/sample-images/green-valley.svg'),
('Ocean Pearl Hotel', 'Enjoy a refreshing seaside stay with spacious rooms, friendly service and easy access to the beach. Perfect for couples and weekend travellers.', 9.9252000, 78.1198000, 3200, '/sample-images/ocean-pearl.svg'),
('Royal Orchid Suites', 'A modern city hotel with elegant interiors, complimentary Wi-Fi, an in-house restaurant and convenient access to shopping and business districts.', 11.0168000, 76.9558000, 4100, '/sample-images/royal-orchid.svg'),
('Hilltop Heritage Stay', 'A charming heritage-style property with garden spaces, warm hospitality and scenic surroundings for guests who love quiet getaways.', 10.2381000, 77.4892000, 2900, '/sample-images/hilltop-heritage.svg'),
('Lakeview Comfort Inn', 'A welcoming stay near the lake with clean family rooms, breakfast options and relaxing views. A convenient base for exploring nearby attractions.', 10.7905000, 78.7047000, 1800, '/sample-images/lakeview.svg'),
('Palm Breeze Residency', 'A comfortable contemporary hotel with air-conditioned rooms, helpful staff and easy transport connections for business and leisure visits.', 8.7642000, 78.1348000, 2200, '/sample-images/palm-breeze.svg');
