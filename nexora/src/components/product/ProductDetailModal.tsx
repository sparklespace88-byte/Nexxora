import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetails,
    setSelectedProductDetails,
    addToCart,
    toggleWishlist,
    isInWishlist,
    getProductReviews,
    addReview,
    currentUser,
    products,
    setIsAuthModalOpen,
    setAuthMode
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!selectedProductDetails) return null;

  const product = selectedProductDetails;
  const isFavorited = isInWishlist(product.id);
  const reviews = getProductReviews(product.id);
  const isOutOfStock = product.stock <= 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    addReview(product.id, newRating, newComment);
    setNewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>{product.brand}</span>
            <span>/</span>
            <span>{product.category}</span>
          </div>
          <button
            onClick={() => setSelectedProductDetails(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 divide-y divide-slate-100 space-y-8">
          {/* Main PDP Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Gallery & Zoom */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-4/3 sm:aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={product.gallery[activeImageIndex] || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://placehold.co/800x800/1e293b/ffffff?text=' + encodeURIComponent(product.name);
                  }}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === i
                          ? 'border-blue-600 ring-2 ring-blue-600/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Purchase Module */}
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1 leading-snug font-display">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800 tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {product.reviewCount} customer reviews
                </button>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-4 flex items-center gap-2">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>In Stock · Available for Immediate Dispatch ({product.stock} units)</span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                    Currently Out of Stock
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Stepper & Buy Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-slate-800 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isFavorited
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="mt-6 grid grid-cols-3 gap-2 py-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>30-Day Money Back</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Genuine 1-Yr Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Specifications & Customer Reviews */}
          <div className="pt-6">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  {reviews.length}
                </span>
              </button>
            </div>

            {/* Specs Tab Content */}
            {activeTab === 'specs' && (
              <div className="py-4">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key} className="hover:bg-slate-50">
                        <td className="py-2.5 font-semibold text-slate-600 w-1/3">
                          {key}
                        </td>
                        <td className="py-2.5 text-slate-900 font-medium">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab Content */}
            {activeTab === 'reviews' && (
              <div className="py-4 space-y-6">
                {/* Submit Review Form */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200"
                >
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Write a Product Review
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-600">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your experience with this product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 bg-white"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {currentUser
                        ? `Posting as ${currentUser.name}`
                        : 'Sign in to post verified reviews'}
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="divide-y divide-slate-100">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {rev.userName}
                            </span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            {rev.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No reviews yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">
                You May Also Like
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProductDetails(rel);
                      setActiveImageIndex(0);
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all bg-white group"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full aspect-square object-cover rounded-lg bg-slate-50 group-hover:scale-105 transition-transform"
                    />
                    <h5 className="text-xs font-semibold text-slate-800 line-clamp-1 mt-2">
                      {rel.name}
                    </h5>
                    <p className="text-xs font-bold text-blue-600 tabular-nums">
                      ${rel.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
