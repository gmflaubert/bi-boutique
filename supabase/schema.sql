-- B&I Boutique — Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database.

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL,
  original_price INTEGER,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT NOT NULL,
  sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  colors JSONB DEFAULT '[]'::JSONB,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  total INTEGER NOT NULL,
  customer_name TEXT DEFAULT '',
  customer_phone TEXT DEFAULT '',
  delivery_location TEXT DEFAULT '',
  promo_code TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL,
  min_purchase INTEGER DEFAULT 0,
  expires_at DATE,
  active BOOLEAN DEFAULT true
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

-- Products: everyone can read, only authenticated (admin) can write
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: anyone can create (customers), only admin can read/update/delete
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- Promos: everyone can read (needed for validation), only admin can write
CREATE POLICY "Anyone can read promos" ON promos FOR SELECT USING (true);
CREATE POLICY "Admin can insert promos" ON promos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update promos" ON promos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete promos" ON promos FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed Data — Products
-- ============================================================

INSERT INTO products (name, description, price, original_price, images, category, sizes, colors, in_stock, featured, created_at) VALUES
(
  'Silk Evening Gown',
  'A stunning silk evening gown that exudes elegance and sophistication. Perfect for galas, formal dinners, and special occasions. The flowing silhouette flatters every figure.',
  45000, 55000,
  ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
  'Dresses',
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  '[{"name":"Black","hex":"#000000"},{"name":"Burgundy","hex":"#800020"},{"name":"Navy","hex":"#000080"}]'::jsonb,
  true, true, '2024-01-15T10:00:00Z'
),
(
  'Casual Blazer',
  'A versatile casual blazer that transitions seamlessly from office to evening. Tailored fit with modern details. Pair with jeans or dress pants for a polished look.',
  28000, NULL,
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600'],
  'Jackets',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  '[{"name":"Charcoal","hex":"#36454F"},{"name":"Beige","hex":"#F5F5DC"},{"name":"White","hex":"#FFFFFF"}]'::jsonb,
  true, true, '2024-01-20T10:00:00Z'
),
(
  'Floral Summer Dress',
  'A light and breezy floral summer dress that captures the essence of warm days. The vibrant print and comfortable fit make it ideal for brunches, picnics, and casual outings.',
  18000, 22000,
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'],
  'Dresses',
  ARRAY['XS', 'S', 'M', 'L'],
  '[{"name":"Floral Pink","hex":"#FFB6C1"},{"name":"Floral Blue","hex":"#87CEEB"}]'::jsonb,
  true, true, '2024-02-01T10:00:00Z'
),
(
  'Classic Denim Jeans',
  'Timeless classic denim jeans crafted from premium fabric. The perfect balance of comfort and style with a flattering straight-leg cut that never goes out of fashion.',
  15000, NULL,
  ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
  'Pants',
  ARRAY['28', '30', '32', '34', '36'],
  '[{"name":"Dark Blue","hex":"#00008B"},{"name":"Light Blue","hex":"#ADD8E6"},{"name":"Black","hex":"#000000"}]'::jsonb,
  true, false, '2024-02-10T10:00:00Z'
),
(
  'Leather Crossbody Bag',
  'A beautifully crafted leather crossbody bag that combines functionality with elegance. Multiple compartments keep you organized while the adjustable strap ensures comfort.',
  35000, 40000,
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'],
  'Accessories',
  ARRAY['One Size'],
  '[{"name":"Tan","hex":"#D2B48C"},{"name":"Black","hex":"#000000"},{"name":"Brown","hex":"#8B4513"}]'::jsonb,
  true, true, '2024-02-15T10:00:00Z'
),
(
  'Elegant Silk Scarf',
  'An exquisite silk scarf that adds a touch of luxury to any outfit. The smooth, lightweight fabric drapes beautifully. Versatile enough to wear as a headband, neck tie, or bag accent.',
  12000, NULL,
  ARRAY['https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=600', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'],
  'Accessories',
  ARRAY['One Size'],
  '[{"name":"Multi","hex":"#FF69B4"},{"name":"Gold","hex":"#FFD700"}]'::jsonb,
  true, false, '2024-03-01T10:00:00Z'
),
(
  'High-Waist Trousers',
  'Sophisticated high-waist trousers that elongate your silhouette. The tailored fit and premium fabric make these perfect for both professional settings and elegant casual wear.',
  22000, NULL,
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
  'Pants',
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  '[{"name":"Black","hex":"#000000"},{"name":"Cream","hex":"#FFFDD0"},{"name":"Olive","hex":"#808000"}]'::jsonb,
  true, false, '2024-03-10T10:00:00Z'
),
(
  'Cotton T-Shirt',
  'A premium cotton t-shirt that offers ultimate comfort and style. The soft, breathable fabric and relaxed fit make it a wardrobe essential for everyday wear.',
  8000, 10000,
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
  'Tops',
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  '[{"name":"White","hex":"#FFFFFF"},{"name":"Black","hex":"#000000"},{"name":"Gray","hex":"#808080"},{"name":"Pink","hex":"#FFC0CB"}]'::jsonb,
  true, false, '2024-03-15T10:00:00Z'
);

-- ============================================================
-- Seed Data — Promo Codes
-- ============================================================

INSERT INTO promos (code, type, value, min_purchase, expires_at, active) VALUES
('WELCOME10', 'percentage', 10, 20000, '2027-12-31', true),
('SAVE5000', 'fixed', 5000, 30000, NULL, true);
