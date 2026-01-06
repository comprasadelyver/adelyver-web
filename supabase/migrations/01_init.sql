-- Tabla de usuarios y roles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    total_weight NUMERIC DEFAULT 0,
    shipping_cost NUMERIC DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT
);
