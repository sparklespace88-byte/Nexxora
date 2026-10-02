# NEXORA - Modern Full-Stack E-Commerce Platform

Welcome to **NEXORA**, a complete, production-ready, feature-rich modern e-commerce web application.

---

## 🚀 Features Included
- **Modern Responsive Storefront**: Mobile, tablet, and desktop optimized UI with dynamic Tailwind theming.
- **Dynamic Theme Switcher**: 8 vibrant preset colors (Blue, Green, Purple, Red, Orange, Teal, Pink, Slate) + Custom Color Picker.
- **Product Management & Catalog**: Real products across Electronics, Fashion, Sports, Gaming & Toys, Home & Living, and Beauty.
- **Live Search & Category Filtering**: Instant real-time search, price range filtering, rating filters, and stock status.
- **Interactive Cart & Promo Code System**: Full slide-over drawer cart, quantity controls, and coupon support (`SAVE20`, `WELCOME10`).
- **Complete Multi-Step Checkout**: Customer shipping information, payment options (Cash on Delivery, Credit/Debit Card), order summary, and order confirmation.
- **Authentication**:
  - Google / Gmail One-Tap Authentication
  - Customer registration & login
  - Quick 1-click Demo credentials
- **Customer Dashboard**: Track recent orders, view order status timelines, manage saved shipping addresses, and account security.
- **Admin Management Console**: Product CRUD (Create, Edit, Delete), order status updates, and user directory.
- **Full PHP & MySQL Backend Source**: Ready-to-deploy XAMPP/Apache backend files, REST API endpoints, and complete relational SQL database schema.

---

## 🛠️ How to Run Locally (Option 1: Node.js / Vite React)

1. Make sure you have **Node.js 18+** installed.
2. Open terminal in this folder and install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   ```
   http://localhost:3000
   ```

To build for production:
```bash
npm run build
```

---

## 🐘 How to Run with PHP / MySQL / XAMPP (Option 2: Classic Web Server)

1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Open `http://localhost/phpmyadmin` in your browser.
3. Create a new database named `nexora_db`.
4. Import the provided SQL schema:
   - Click on the `nexora_db` database -> **Import** tab.
   - Choose the file: `database/schema.sql`
   - Click **Go** to import tables and sample data.
5. Copy the project folder into your XAMPP `htdocs` directory:
   - Windows: `C:\xampp\htdocs\nexora\`
   - macOS: `/Applications/XAMPP/htdocs/nexora/`
6. Open your browser and navigate to:
   ```
   http://localhost/nexora/
   ```

---

## 📁 Project Directory Structure
```
nexora/
├── database/               # Complete MySQL schema & initial seed data
│   └── schema.sql
├── php/                    # PHP backend REST APIs & database connector
│   ├── config/             # DB connection (PDO)
│   ├── api/                # Products, Cart, Orders, and Auth endpoints
│   └── README.md
├── public/                 # Static assets & downloadable full package zip
├── src/                    # Complete React + TypeScript application
│   ├── components/         # Modular UI components
│   │   ├── account/        # User profile & order tracking
│   │   ├── admin/          # Admin management console
│   │   ├── auth/           # Login, Register & Google Auth
│   │   ├── cart/           # Sliding cart drawer
│   │   ├── checkout/       # Checkout flow & order confirmation
│   │   ├── common/         # Toast notifications & shared widgets
│   │   ├── home/           # Hero slider, deals, banners, categories
│   │   ├── layout/         # Header, Navbar, Theme switcher, Footer
│   │   ├── php-export/     # PHP source file previewer & export
│   │   └── product/        # Product detail modal & cards
│   ├── context/            # React StoreContext (State management & business logic)
│   ├── data/               # Rich catalog seed products & category data
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # React entry point
│   └── index.css           # Tailwind CSS theme setup
├── index.html              # HTML entry point with metadata & fonts
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & bundler configuration
```

---
*Created with ❤️ for NEXORA E-Commerce Platform.*
