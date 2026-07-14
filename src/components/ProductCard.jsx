import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart, Zap } from 'lucide-react';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import axiosClient from '../utils/axiosClient';

function ProductCard({ product }) {
  const { user, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const discountPercent = product.discountPrice
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : Math.round(((product.price * 1.2 - product.price) / (product.price * 1.2)) * 100);

  const originalPrice = product.discountPrice || (product.price * 1.2).toFixed(2);

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth', { 
        state: { 
          from: location.pathname + location.search,
          pendingCartItem: { productId: product._id, quantity: 1 }
        } 
      });
      return;
    }
    try {
      const res = await axiosClient.post('/api/cart/items', { productId: product._id, quantity: 1 });
      setCart(res.data.data);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className='group relative bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col card-hover'
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className='absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm'>
          -{discountPercent}%
        </span>
      )}

      {/* Low Stock Badge */}
      {isLowStock && (
        <span className='absolute top-3 right-3 z-10 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1'>
          <Zap className="w-2.5 h-2.5" />
          {product.stock} left
        </span>
      )}

      {/* Out of Stock overlay */}
      {isOutOfStock && (
        <div className='absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center'>
          <span className='bg-slate-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-full'>Out of Stock</span>
        </div>
      )}

      {/* Image */}
      <div className='relative overflow-hidden bg-slate-50 aspect-square'>
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-slate-300'>
            <Package className='w-12 h-12' />
          </div>
        )}

        {/* Add to Cart Overlay */}
        {!isOutOfStock && (
          <div className='absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
            <button
              onClick={handleAddToCart}
              className='w-full bg-slate-900/90 backdrop-blur-sm text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg'
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='p-4 flex flex-col flex-grow'>
        {/* Brand */}
        <p className='text-[11px] font-bold text-brand-500 uppercase tracking-widest mb-1.5'>
          {product.brand || 'Premium'}
        </p>

        {/* Name */}
        <h3 className='font-display font-semibold text-slate-900 leading-snug line-clamp-2 mb-3 text-sm group-hover:text-brand-600 transition-colors flex-grow'>
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className='flex items-center gap-1 mb-3'>
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
              />
            ))}
            <span className='text-xs text-slate-400 ml-1'>{product.rating}</span>
          </div>
        )}

        {/* Price */}
        <div className='flex items-center justify-between pt-3 border-t border-slate-50'>
          <div className='flex items-baseline gap-2'>
            <span className='font-display font-bold text-lg text-slate-900'>${product.price}</span>
            <span className='text-xs text-slate-400 line-through'>${Number(originalPrice).toFixed(2)}</span>
          </div>
          {product.rating && (
            <div className='bg-amber-50 px-2 py-1 rounded-lg'>
              <span className='text-xs font-bold text-amber-600'>{product.rating}★</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
