<?php
/**
 * NEXORA Main Homepage
 * Compatible with XAMPP (Apache + MySQL/MariaDB)
 */
require_once __DIR__ . '/config.php';

// Fetch Categories
$cat_stmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
$categories = $cat_stmt->fetchAll();

// Fetch Featured Products
$prod_stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_featured = 1 ORDER BY p.id DESC LIMIT 8");
$featured_products = $prod_stmt->fetchAll();

// Handle Newsletter Subscription POST
$newsletter_msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['subscribe_newsletter'])) {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $check = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
        $check->execute([$email]);
        if ($check->rowCount() > 0) {
            $newsletter_msg = "This email is already subscribed!";
        } else {
            $insert = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
            $insert->execute([$email]);
            $newsletter_msg = "Thank you for subscribing to NEXORA!";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXORA - Modern E-Commerce Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-50 text-slate-900 font-sans">
    <!-- Top Announcement Bar -->
    <div class="bg-slate-900 text-slate-300 text-xs py-2 px-6 flex justify-between items-center border-b border-slate-800">
        <div>
            <span class="text-amber-300 font-bold"><i class="fa-solid fa-sparkles mr-1"></i> Summer Clearance</span> · Use code <strong class="text-white">SAVE20</strong> for 20% off orders over $50
        </div>
        <div class="flex items-center gap-4">
            <a href="admin/dashboard.php" class="text-blue-400 hover:text-white transition"><i class="fa-solid fa-shield-halved mr-1"></i> Admin Portal</a>
        </div>
    </div>

    <!-- Main Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <a href="index.php" class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-cart-shopping text-lg"></i>
                </div>
                <span class="text-2xl font-extrabold tracking-tight">NEX<span class="text-blue-600">ORA</span></span>
            </a>

            <!-- Search Form -->
            <form action="products.php" method="GET" class="flex-1 max-w-xl hidden md:flex items-center relative">
                <input type="text" name="q" placeholder="Search products..." class="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-24 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30">
                <i class="fa-solid fa-magnifying-glass text-slate-400 absolute left-3"></i>
                <button type="submit" class="absolute right-1 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Search</button>
            </form>

            <!-- Actions -->
            <div class="flex items-center gap-4 text-xs font-semibold">
                <a href="wishlist.php" class="text-slate-700 hover:text-blue-600"><i class="fa-regular fa-heart text-base mr-1"></i> Wishlist</a>
                <a href="cart.php" class="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl flex items-center gap-2"><i class="fa-solid fa-bag-shopping"></i> <span>Cart</span></a>
            </div>
        </div>
    </header>

    <!-- Hero Banner -->
    <section class="max-w-7xl mx-auto px-6 py-6">
        <div class="rounded-3xl bg-slate-900 text-white p-10 sm:p-14 flex flex-col items-start gap-4 shadow-xl">
            <span class="bg-blue-600/30 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold">New Arrivals 2026</span>
            <h1 class="text-4xl sm:text-5xl font-extrabold max-w-2xl leading-tight">Experience The Future of Sound & Smart Living</h1>
            <p class="text-slate-300 max-w-lg text-sm sm:text-base">Studio-grade acoustics, titanium smartwatches, and aerodynamic performance footwear.</p>
            <a href="products.php" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-md">Shop Catalog Now</a>
        </div>
    </section>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-6 py-8">
        <h2 class="text-2xl font-bold mb-6">Popular Categories</h2>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <?php foreach ($categories as $cat): ?>
            <a href="products.php?category=<?= urlencode($cat['name']) ?>" class="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-blue-500 hover:shadow-md transition">
                <span class="font-bold text-sm text-slate-800"><?= htmlspecialchars($cat['name']) ?></span>
            </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-6 py-8">
        <h2 class="text-2xl font-bold mb-6">Featured Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <?php foreach ($featured_products as $prod): ?>
            <div class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <img src="<?= htmlspecialchars($prod['image']) ?>" alt="<?= htmlspecialchars($prod['name']) ?>" class="w-full aspect-square object-cover rounded-xl mb-3">
                    <span class="text-[10px] font-bold uppercase text-blue-600"><?= htmlspecialchars($prod['brand']) ?></span>
                    <h3 class="font-bold text-sm text-slate-900 line-clamp-2"><?= htmlspecialchars($prod['name']) ?></h3>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-base font-extrabold text-slate-900">$<?= number_format($prod['price'], 2) ?></span>
                    <a href="product-details.php?id=<?= $prod['id'] ?>" class="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition">View Item</a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-6 text-center text-xs">
            <p>&copy; <?= date('Y') ?> NEXORA Inc. All rights reserved. Built with PHP & MySQL for XAMPP.</p>
        </div>
    </footer>
</body>
</html>
