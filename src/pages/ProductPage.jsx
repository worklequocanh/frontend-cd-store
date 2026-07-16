import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';
import { Star, ShoppingCart, Truck, ShieldCheck, ChevronRight, Minus, Plus, Package, RotateCcw, Headphones, MessageSquare } from 'lucide-react';

// Star rating display
function StarRow({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className='flex items-center gap-0.5'>
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${sz} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>
  );
}

// Review submit form
function ReviewForm({ productId, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/api/reviews', { productId, rating, comment });
      toast.success('Review submitted! Thank you.');
      setComment('');
      setRating(5);
      onSubmit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-slate-50 rounded-2xl p-6 border border-slate-100'>
      <h3 className='font-display font-bold text-slate-900 mb-4 flex items-center gap-2'>
        <MessageSquare className='w-5 h-5 text-brand-500' />
        Write a Review
      </h3>
      <div className='mb-4'>
        <p className='text-sm font-medium text-slate-600 mb-2'>Your Rating</p>
        <div className='flex gap-1'>
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              type='button'
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              className='p-1 transition-transform hover:scale-110'
            >
              <Star className={`w-7 h-7 transition-colors ${i <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
            </button>
          ))}
          <span className='ml-2 text-sm font-semibold text-slate-500 self-center'>{rating}/5</span>
        </div>
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-slate-600 mb-2'>Your Review</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          rows={3}
          placeholder='Share your experience with this product...'
          className='input-base resize-none text-sm'
        />
      </div>
      <button type='submit' disabled={loading} className='btn-primary text-sm py-2.5 px-6'>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { user, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axiosClient.get(`/api/products/${slug}`).then(r => setProduct(r.data.data)).catch(console.error);
  }, [slug]);

  const fetchReviews = (productId) => {
    axiosClient.get(`/api/reviews/product/${productId}`).then(r => setReviews(r.data.data)).catch(console.error);
  };

  useEffect(() => {
    if (product) fetchReviews(product._id);
  }, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth', { 
        state: { 
          from: location.pathname + location.search,
          pendingCartItem: { productId: product._id, quantity }
        } 
      });
      return;
    }
    try {
      const res = await axiosClient.post('/api/cart/items', { productId: product._id, quantity });
      setCart(res.data.data);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (!product) return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        <p className='text-slate-400 text-sm font-medium'>Loading product...</p>
      </div>
    </div>
  );

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-slate-100'>
        <div className='container mx-auto px-4 py-3.5 flex items-center gap-2 text-sm'>
          <button onClick={() => navigate('/')} className='text-slate-400 hover:text-brand-600 transition-colors'>Home</button>
          <ChevronRight className='w-3.5 h-3.5 text-slate-300' />
          {product.categoryId?.name && (
            <>
              <span className='text-slate-400'>{product.categoryId.name}</span>
              <ChevronRight className='w-3.5 h-3.5 text-slate-300' />
            </>
          )}
          <span className='text-slate-700 font-medium truncate max-w-[200px]'>{product.name}</span>
        </div>
      </div>

      <div className='container mx-auto px-4 py-10'>
        {/* Main Product Card */}
        <div className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>

            {/* Image Panel */}
            <div className='p-6 lg:p-10 bg-slate-50/50'>
              <div className='relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm aspect-square flex items-center justify-center group'>
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className='w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105'
                  />
                ) : (
                  <Package className='w-20 h-20 text-slate-200' />
                )}
                {!inStock && (
                  <div className='absolute inset-0 bg-white/80 flex items-center justify-center'>
                    <span className='bg-slate-900 text-white font-bold px-4 py-2 rounded-full text-sm'>Out of Stock</span>
                  </div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className='flex gap-3 mt-4 overflow-x-auto pb-1'>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-500 shadow-md shadow-brand-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt='thumb' className='w-full h-full object-contain bg-white p-1' />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className='p-6 lg:p-10 flex flex-col'>
              <div className='flex items-center gap-2 mb-3'>
                {product.brand && (
                  <span className='text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider'>{product.brand}</span>
                )}
                {lowStock && (
                  <span className='text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full'>Only {product.stock} left</span>
                )}
              </div>

              <h1 className='text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4 leading-tight'>{product.name}</h1>

              {/* Rating row */}
              {product.rating && (
                <div className='flex items-center gap-3 mb-5 pb-5 border-b border-slate-100'>
                  <StarRow rating={product.rating} size='md' />
                  <span className='font-bold text-slate-700'>{product.rating}</span>
                  <span className='text-slate-400 text-sm'>·</span>
                  <button onClick={() => setActiveTab('reviews')} className='text-sm text-brand-600 hover:underline font-medium'>
                    {reviews.length} reviews
                  </button>
                  <span className='text-slate-400 text-sm'>·</span>
                  <span className={`text-sm font-semibold ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                    {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className='flex items-end gap-3 mb-6'>
                <span className='text-4xl font-display font-bold text-slate-900'>${product.price?.toFixed(2)}</span>
                {product.discountPrice && Number(product.discountPrice) > Number(product.price) && (
                  <>
                    <span className='text-xl text-slate-400 line-through mb-0.5'>${Number(product.discountPrice).toFixed(2)}</span>
                    <span className='bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-bold px-3 py-0.5 rounded-full mb-0.5 shadow-sm animate-pulse'>
                      -{Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% (Tiết kiệm ${(product.discountPrice - product.price).toFixed(2)})
                    </span>
                  </>
                )}
              </div>

              {/* Quantity + Add to cart */}
              <div className='flex flex-col sm:flex-row gap-3 mb-8'>
                <div className='flex items-center bg-slate-100 rounded-full h-14 px-2'>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={!inStock}
                    className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-slate-600 hover:text-brand-600 transition-all disabled:opacity-40'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='w-10 text-center font-bold text-slate-900'>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={!inStock}
                    className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-slate-600 hover:text-brand-600 transition-all disabled:opacity-40'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 h-14 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg ${
                    inStock
                      ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/30 hover:-translate-y-0.5 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className='w-5 h-5' />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Feature pills */}
              <div className='grid grid-cols-2 gap-3 mt-auto'>
                {[
                  { icon: <Truck className='w-4 h-4' />, label: 'Free Shipping' },
                  { icon: <ShieldCheck className='w-4 h-4' />, label: '1 Year Warranty' },
                  { icon: <RotateCcw className='w-4 h-4' />, label: '30-Day Returns' },
                  { icon: <Headphones className='w-4 h-4' />, label: '24/7 Support' },
                ].map(f => (
                  <div key={f.label} className='flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100'>
                    <div className='text-brand-500'>{f.icon}</div>
                    <span className='text-sm font-medium text-slate-700'>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
          {/* Tab bar */}
          <div className='flex border-b border-slate-100 overflow-x-auto'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className='p-6 md:p-10'>
            {activeTab === 'description' && (
              <div className='prose prose-slate max-w-none'>
                <p className='text-slate-600 leading-relaxed text-base whitespace-pre-line'>
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className='space-y-8'>
                {/* Average rating */}
                {reviews.length > 0 && (
                  <div className='flex items-center gap-6 p-6 bg-slate-50 rounded-2xl'>
                    <div className='text-center'>
                      <p className='text-5xl font-display font-bold text-slate-900'>{product.rating || '—'}</p>
                      <StarRow rating={product.rating || 0} size='md' />
                      <p className='text-xs text-slate-400 mt-1'>{reviews.length} reviews</p>
                    </div>
                  </div>
                )}

                {/* Review list */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {reviews.map(r => (
                    <div key={r._id} className='bg-slate-50 rounded-2xl p-5 border border-slate-100'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-600 text-white font-bold rounded-full flex items-center justify-center text-sm'>
                            {r.userId?.name?.charAt(0) || 'U'}
                          </div>
                          <span className='font-semibold text-slate-900 text-sm'>{r.userId?.name || 'Anonymous'}</span>
                        </div>
                        <StarRow rating={r.rating} size='sm' />
                      </div>
                      <p className='text-slate-600 text-sm leading-relaxed'>{r.comment}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className='col-span-2 text-center py-12 text-slate-400'>
                      <Star className='w-12 h-12 mx-auto mb-4 text-slate-200' />
                      <p className='font-medium'>No reviews yet. Be the first!</p>
                    </div>
                  )}
                </div>

                {/* Review form */}
                {user && (
                  <ReviewForm productId={product._id} onSubmit={() => fetchReviews(product._id)} />
                )}
                {!user && (
                  <div className='text-center py-6 bg-brand-50 rounded-2xl'>
                    <p className='text-slate-600 mb-3'>Sign in to write a review</p>
                    <button onClick={() => navigate('/auth')} className='btn-primary text-sm py-2 px-5'>Sign In</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className='space-y-4 text-slate-600 text-sm leading-relaxed'>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-xl'>
                  <Truck className='w-5 h-5 text-brand-500 mt-0.5 shrink-0' />
                  <div>
                    <p className='font-semibold text-slate-900'>Free Standard Shipping</p>
                    <p>Orders over $50 qualify for free shipping. Estimated delivery: 3–7 business days.</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-xl'>
                  <RotateCcw className='w-5 h-5 text-brand-500 mt-0.5 shrink-0' />
                  <div>
                    <p className='font-semibold text-slate-900'>30-Day Returns</p>
                    <p>Not satisfied? Return within 30 days for a full refund. Items must be in original condition.</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-xl'>
                  <ShieldCheck className='w-5 h-5 text-brand-500 mt-0.5 shrink-0' />
                  <div>
                    <p className='font-semibold text-slate-900'>1 Year Warranty</p>
                    <p>All products come with a 1-year manufacturer warranty against defects.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
