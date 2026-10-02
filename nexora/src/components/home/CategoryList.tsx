import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Laptop, Shirt, Home, Sparkles, Activity, Gamepad2, Layers } from 'lucide-react';

export const CategoryList: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electronics':
        return <Laptop className="w-5 h-5 text-blue-600" />;
      case 'fashion':
        return <Shirt className="w-5 h-5 text-emerald-600" />;
      case 'home-living':
        return <Home className="w-5 h-5 text-amber-600" />;
      case 'beauty':
        return <Sparkles className="w-5 h-5 text-rose-500" />;
      case 'sports':
        return <Activity className="w-5 h-5 text-indigo-600" />;
      case 'toys':
        return <Gamepad2 className="w-5 h-5 text-purple-600" />;
      default:
        return <Layers className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const catalog = document.getElementById('featured-products');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
            Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our carefully curated collections
          </p>
        </div>
        <button
          onClick={() => handleCategoryClick('All')}
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View All Products &rarr;
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center cursor-pointer group text-center"
            >
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-blue-600 ring-offset-2 scale-105'
                    : 'ring-1 ring-slate-200 hover:ring-2 hover:ring-blue-500 hover:scale-105 shadow-sm'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://placehold.co/200x200/2563eb/ffffff?text=' + encodeURIComponent(cat.name);
                  }}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 bg-slate-100"
                />
                <div className="absolute inset-0 rounded-full bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
                <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100">
                  {getCategoryIcon(cat.slug)}
                </div>
              </div>

              <span
                className={`mt-3 text-xs sm:text-sm font-semibold transition-colors leading-tight ${
                  isSelected ? 'text-blue-600 font-bold' : 'text-slate-800 group-hover:text-blue-600'
                }`}
              >
                {cat.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 font-mono">
                {cat.itemCount} Items
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
