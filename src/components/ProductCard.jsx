import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import axiosClient from '../utils/axiosClient';

function ProductCard({ product }) {
  const { user, cart, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to add items to your cart');
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }

    try {
      const res = await axiosClient.post('/api/cart/items', {
        productId: product._id,
        quantity: 1
      });
      setCart(res.data.data);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className='group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full'>
      <div className='relative overflow-hidden aspect-video bg-slate-100'>
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-slate-400'>No Image</div>
        )}
        
        {/* Quick Add Button Overlay */}
        <div className='absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center'>
          <button 
            onClick={handleAddToCart}
            className='bg-white/90 backdrop-blur-sm text-brand-600 font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-brand-600 hover:text-white transition-colors'
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>

      <div className='p-5 flex flex-col flex-grow'>
        <div className='mb-auto'>
          <p className='text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2'>{product.brand || 'Premium'}</p>
          <h3 className='font-display font-semibold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors'>
            {product.name}
          </h3>
        </div>
        
        <div className='flex justify-between items-end mt-4 pt-4 border-t border-slate-100'>
          <div>
            <span className='text-xs text-slate-500 line-through mr-2'>
              ${(product.price * 1.2).toFixed(2)}
            </span>
            <span className='font-bold text-xl text-slate-900'>${product.price}</span>
          </div>
          
          {product.rating && (
            <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md'>
              <Star className='w-3.5 h-3.5 text-yellow-500 fill-yellow-500' />
              <span className='text-xs font-bold text-yellow-700'>{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
