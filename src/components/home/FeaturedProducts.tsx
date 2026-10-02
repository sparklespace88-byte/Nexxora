import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery
  } = useStore();

  const [visibleCount, setVisibleCount] = useState(8);

  const categoriesList = [
    'All',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Sports',
    'Toys & Gaming'
  ];

  // Filter products by selected category and active search query
  let filtered = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    // default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const displayedProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header with Category Tabs & Sorting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Curated For You
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display mt-1">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Handpicked premium items with verified reviews and genuine warranties
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Bar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-4 scrollbar-none">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(8);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Count & Active Search Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
        <span>
          Showing <strong className="text-slate-800 tabular-nums">{displayedProducts.length}</strong> of{' '}
          <strong className="text-slate-800 tabular-nums">{filtered.length}</strong> products
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </span>
        {searchQuery && (
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-medium">
            Search filter: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search keywords or switching to a different category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
            }}
            className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-6 py-3 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all duration-200"
          >
            Load More Products ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
};
