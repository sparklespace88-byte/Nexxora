# NEXORA — E-COMMERCE PLATFORM (PHP & MYSQL / XAMPP)

Welcome to **NEXORA**, a full-featured e-commerce platform inspired by the ShopKart architecture.

---

## 🚀 Quick Start with XAMPP

### 1. Requirements
- XAMPP for Windows / Mac / Linux (PHP 8.0+ and MySQL / MariaDB)
- Web Browser

### 2. Setup Instructions

#### Step 1: Copy files to `htdocs`
1. Open your XAMPP installation directory (normally `C:\xampp`).
2. Navigate to `C:\xampp\htdocs\`.
3. Create a folder named `nexora`.
4. Copy the project files (`index.php`, `config.php`, `database/database.sql`, etc.) into `C:\xampp\htdocs\nexora\`.

#### Step 2: Import Database in phpMyAdmin
1. Start **Apache** and **MySQL** in your XAMPP Control Panel.
2. Open your web browser and go to: `http://localhost/phpmyadmin`
3. Click on **New** or **Databases** on the left menu.
4. Set Database Name: `nexora_db` and collation: `utf8mb4_unicode_ci`, then click **Create**.
5. Click on the newly created `nexora_db` database.
6. Click the **Import** tab at the top.
7. Click **Choose File** and select `/database/database.sql`.
8. Click **Import** (or **Go** at the bottom).

#### Step 3: Configure Database Connection
Check `php/config.php` (or `includes/config.php`):
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default in XAMPP is blank
define('DB_NAME', 'nexora_db');
define('SITE_URL', 'http://localhost/nexora');
```

#### Step 4: Open in Browser
- **Storefront URL:** `http://localhost/nexora`
- **Admin Dashboard:** `http://localhost/nexora/admin/dashboard.php`

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@nexora.com` | `admin123` |
| **Demo Customer** | `faizali@example.com` | `customer123` |

---

## 📂 Architecture
- `database/database.sql` - Full MySQL schema with foreign keys and seed records
- `includes/config.php` - PDO database connection and utility functions
- `index.php` - Homepage with Hero slider, categories, featured products
- `products.php` - Catalog with search, filters and sorting
- `product-details.php` - Single product view with gallery, specs, reviews
- `cart.php` & `checkout.php` - Server-side price recalculation & order placement
- `admin/` - Product, Order, Category, and Coupon management
