CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total      NUMERIC(10, 2) NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  price      NUMERIC(10, 2) NOT NULL
);

-- Seed a few sample products so the store isn't empty on first load
INSERT INTO products (name, description, price, image_url, stock) VALUES
  ('Wireless Headphones', 'Premium sound quality with active noise cancellation and 30-hour battery life.', 79.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 50),
  ('Mechanical Keyboard', 'Compact TKL layout with tactile brown switches and RGB backlighting.', 129.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 30),
  ('USB-C Hub 7-in-1', 'HDMI 4K, 3x USB-A, SD card reader, and 100W power delivery.', 49.99, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600', 75),
  ('Webcam 1080p', 'Full HD webcam with built-in microphone and auto light correction.', 59.99, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70a1?w=600', 40),
  ('Desk Lamp LED', 'Adjustable color temperature and brightness with USB charging port.', 34.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 60),
  ('Mouse Pad XL', 'Extended gaming mouse pad, 900x400mm, stitched edges, non-slip base.', 24.99, 'https://images.unsplash.com/photo-1615869442320-fd02a129c77c?w=600', 100)
ON CONFLICT DO NOTHING;
