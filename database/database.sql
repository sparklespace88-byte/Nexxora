-- ============================================================
-- NEXORA E-COMMERCE DATABASE SCHEMA (MySQL 8.0 / MariaDB)
-- Compatible with XAMPP, WAMP, LAMP & phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS `nexora_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nexora_db`;

-- Drop existing tables to allow clean re-import
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `wishlist_items`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL UNIQUE,
  `phone` VARCHAR(40) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Categories Table
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `image` VARCHAR(255) NULL,
  `icon_name` VARCHAR(50) DEFAULT 'Package',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cat_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Products Table
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `brand` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NOT NULL,
  `discount_percent` INT DEFAULT 0,
  `stock` INT DEFAULT 10,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `image` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `specifications` JSON NULL,
  `is_featured` TINYINT(1) DEFAULT 1,
  `is_new_arrival` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_prod_category` (`category_id`),
  INDEX `idx_prod_slug` (`slug`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Customer Addresses Table
CREATE TABLE `addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(30) NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Orders Table
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NULL,
  `customer_name` VARCHAR(120) NOT NULL,
  `customer_email` VARCHAR(180) NOT NULL,
  `customer_phone` VARCHAR(40) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discount` DECIMAL(10,2) DEFAULT 0.00,
  `shipping_fee` DECIMAL(10,2) DEFAULT 0.00,
  `tax` DECIMAL(10,2) DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('COD', 'Online Card') DEFAULT 'COD',
  `payment_status` ENUM('Pending', 'Paid') DEFAULT 'Pending',
  `order_status` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_order_number` (`order_number`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Order Items Table
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `product_image` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Reviews Table
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_id` INT NULL,
  `user_name` VARCHAR(120) NOT NULL,
  `user_email` VARCHAR(180) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT NOT NULL,
  `verified_purchase` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Coupons Table
CREATE TABLE `coupons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_percent` INT NOT NULL,
  `min_order` DECIMAL(10,2) DEFAULT 0.00,
  `description` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `expires_at` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Newsletter Subscribers Table
CREATE TABLE `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(180) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED INITIAL DATA
-- ============================================================

-- Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `icon_name`) VALUES
(1, 'Electronics', 'electronics', '/src/assets/images/hero_nexora_electronics_1790441938567.jpg', 'Laptop'),
(2, 'Fashion', 'fashion', '/src/assets/images/product_running_shoes_1790441985090.jpg', 'Shirt'),
(3, 'Home & Living', 'home-living', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', 'Home'),
(4, 'Beauty', 'beauty', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', 'Sparkles'),
(5, 'Sports', 'sports', '/src/assets/images/product_smart_watch_1790441968272.jpg', 'Activity');

-- Default Users (Password: admin123 and customer123 using bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `status`) VALUES
(1, 'NEXORA Administrator', 'admin@nexora.com', '+1 (800) 555-NEXORA', '$2y$10$e8wJj9k9Q7Y.g6O9HqQ6/uBvRzUuN3F3QhK.E6e9r4P5s0V0Z7t5S', 'admin', 'Active'),
(2, 'Faiz Ali', 'faizali@example.com', '+1 (555) 890-1234', '$2y$10$e8wJj9k9Q7Y.g6O9HqQ6/uBvRzUuN3F3QhK.E6e9r4P5s0V0Z7t5S', 'customer', 'Active');

-- Sample Products
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `brand`, `price`, `original_price`, `discount_percent`, `stock`, `rating`, `review_count`, `image`, `description`, `is_featured`, `is_new_arrival`) VALUES
(1, 1, 'AcousticPro ANC Wireless Headphones', 'acousticpro-anc-wireless-headphones', 'NEXORA Sound', 149.99, 229.99, 35, 18, 4.80, 128, '/src/assets/images/product_wireless_headphones_1790441955153.jpg', 'Immerse yourself in studio-grade acoustic fidelity with 40dB hybrid ANC.', 1, 1),
(2, 1, 'AeroPulse Titan Smart Watch GPS', 'aeropulse-titan-smart-watch-gps', 'PulseTech', 199.99, 279.99, 28, 14, 4.90, 94, '/src/assets/images/product_smart_watch_1790441968272.jpg', 'Precision titanium casing with 1.43-inch AMOLED display and 12-day battery.', 1, 1),
(3, 2, 'VelocityStrider Kinetic Running Shoes', 'velocitystrider-kinetic-running-shoes', 'AeroKnit', 89.99, 129.99, 30, 22, 4.70, 210, '/src/assets/images/product_running_shoes_1790441985090.jpg', 'Engineered for high-mileage responsiveness with nitrogen-infused foam.', 1, 0),
(4, 2, 'NomadShield Expandable Travel Backpack 35L', 'nomadshield-expandable-travel-backpack-35l', 'NomadGear', 69.99, 99.99, 30, 12, 4.60, 78, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 'Water-resistant Cordura nylon travel pack with 180-degree clamshell opening.', 1, 0),
(5, 1, 'Horizon Pro 5G Ultra Smartphone', 'horizon-pro-5g-ultra-smartphone', 'Horizon Mobile', 799.99, 949.99, 16, 9, 4.90, 342, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', 'Next-gen flagship with 6.7 Dynamic 120Hz display and 200MP camera.', 1, 1);

-- Coupons
INSERT INTO `coupons` (`code`, `discount_percent`, `min_order`, `description`, `is_active`, `expires_at`) VALUES
('SAVE20', 20, 50.00, '20% off all orders over $50', 1, '2026-12-31'),
('NEXORA10', 10, 30.00, '10% off your entire cart', 1, '2026-12-31'),
('WELCOME50', 25, 150.00, '25% off high-value orders over $150', 1, '2026-12-31');

-- Subscribers
INSERT INTO `newsletter_subscribers` (`email`) VALUES
('faizali@example.com'),
('techbuyer@nexora.com');
