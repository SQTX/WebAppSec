-- Tworzenie bazy danych
CREATE DATABASE IF NOT EXISTS CoffeeShop;
USE CoffeeShop;


-- Tworzenie tabeli 'products'
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    number INT NOT NULL,
    is_new BOOLEAN NOT NULL
);


-- Dodanie danych do tabeli
INSERT INTO products (name, description, price, number, is_new) VALUES
('Arcaffe Roma', '1kg', 109.99, 10, TRUE),
('HAYB - Się Przelewa', 'Klasyk Filter Blend 1kg', 133.99, 10, FALSE),
('AreoPRESS', 'Tłok + narzędzia', 129.99, 10, FALSE),
('Comandante - Młynek', 'Nitro Blade Black', 109.99, 10, FALSE),
('Fellow Ode', 'Młynek automatyczny - Czarny', 1290.90, 10, FALSE),
('Lavazza Qualita Oro', NULL, 80.00, 10, FALSE),
('Pellini Top', '100% Arabica', 79.00, 10, FALSE);


-- Tworzenie tabeli 'carts'
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Przykladowy koszyk
INSERT INTO carts (session_id) VALUES ('session12345');


-- Tworzenie tabeli 'clients'
CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    access_token_secret VARCHAR(128) NOT NULL,
    refresh_token_secret VARCHAR(128) NOT NULL,
    refJWT_token VARCHAR(255),
	cart_id INT,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
);


-- Dodanie klienta
INSERT INTO clients (name, login, email, password_hash, access_token_secret, refresh_token_secret, refJWT_token, cart_id)
VALUES (
    'John Doe',
    'john_doe',
    'john.doe@example.com',
    '$2b$10$EIXhB/qjfKZY6.Fg8a6eSOOpIS0yK/UxQ4fBCQ9SmTwvKBBEfbqUG', -- Przykładowy hash bcrypt
    '2e8bc8a6d7aef8d7ea1ef8477c72e814c72f8f9264e8ec4b64a26cf8df9b1e23',
    'c8f97a93aef8c72fe837d6e2147ef9d76248be192746e8746b97a96dc2e61e57',
    'example_ref_jwt_token',
    1
);