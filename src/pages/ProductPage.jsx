import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';
import { Star, ShoppingCart, Truck, ShieldCheck, ChevronRight, Minus, Plus } from 'lucide-react';

function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const { user, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/api/products/${slug}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [slug]);

  const fetchReviews = async (productId) => {
    try {
      const res = await axiosClient.get(`/api/reviews/product/${productId}`);
      setReviews(res.data.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    if (product) {
      fetchReviews(product._id);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }

    if (product) {
      try {
        const res = await axiosClient.post('/api/cart/items', {
          productId: product._id,
          quantity: quantity
        });
        setCart(res.data.data);
        toast.success('Added to cart successfully!');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc' && quantity < (product?.stock || 1)) setQuantity(quantity + 1);
  };

  if (!product) return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-brand-600 transition-colors">Home</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className='container mx-auto px-4 py-12'>
        <div className='bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 mb-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className='bg-slate-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-slate-200'>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[activeImage]} alt={product.name} className='w-full h-full object-cover mix-blend-multiply' />
                ) : (
                  <span className="text-slate-400">No image available</span>
                )}
              </div>
              {/* Thumbnail List */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activeImage === idx ? 'border-brand-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover bg-slate-100 mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <p className="text-brand-600 font-semibold tracking-wider uppercase text-sm mb-2">{product.brand || 'Premium Brand'}</p>
              <h1 className='text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 leading-tight'>{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-slate-700">{product.rating}</span>
                  </div>
                )}
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">{reviews.length} reviews</span>
                <span className="text-slate-400">|</span>
                <span className={`${product.stock > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded-full text-sm font-semibold`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              <div className='mb-8'>
                <div className="flex items-end gap-4">
                  <span className='text-4xl font-display font-bold text-slate-900'>${product.price}</span>
                  {product.discountPrice && (
                    <span className='text-xl text-slate-400 line-through mb-1'>${product.discountPrice}</span>
                  )}
                </div>
              </div>

              <p className='text-slate-600 mb-8 leading-relaxed text-lg'>{product.description}</p>

              {/* Actions */}
              <div className='flex flex-col sm:flex-row gap-4 mb-10'>
                <div className='flex items-center justify-between border border-slate-200 rounded-full bg-slate-50 px-2 w-full sm:w-40 h-14'>
                  <button onClick={() => handleQuantityChange('dec')} className='p-3 text-slate-500 hover:text-brand-600 transition-colors' disabled={product.stock === 0}>
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-lg">{quantity}</span>
                  <button onClick={() => handleQuantityChange('inc')} className='p-3 text-slate-500 hover:text-brand-600 transition-colors' disabled={product.stock === 0}>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-full font-bold text-lg transition-all shadow-lg ${product.stock > 0 ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/30 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <ShoppingCart className="w-6 h-6" /> 
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="bg-white p-2 rounded-full shadow-sm"><Truck className="w-5 h-5 text-brand-600" /></div>
                  <span className="font-medium text-slate-700">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="bg-white p-2 rounded-full shadow-sm"><ShieldCheck className="w-5 h-5 text-brand-600" /></div>
                  <span className="font-medium text-slate-700">1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className='bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100'>
            <h2 className='text-2xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3'>
              Customer Reviews 
              <span className="bg-brand-100 text-brand-700 text-sm py-1 px-3 rounded-full">{reviews.length}</span>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {reviews.map((review) => (
                <div key={review._id} className='bg-slate-50 p-6 rounded-2xl'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 text-brand-600 font-bold rounded-full flex items-center justify-center">
                        {review.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <span className='font-semibold text-slate-900'>{review.userId?.name || 'Anonymous User'}</span>
                    </div>
                    <div className='flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm'>
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
