import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Minus, Plus } from 'lucide-react';

function CartPage() {
  const { user, cart, setCart } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        toast.error('Please log in first');
        navigate('/auth');
        return;
      }

      try {
        const res = await axiosClient.get('/api/cart');
        setCart(res.data.data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    if (!cart && user) {
      fetchCart();
    }
  }, [user, cart, setCart, navigate]);

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await axiosClient.delete(`/api/cart/items/${itemId}`);
      setCart(res.data.data);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await axiosClient.patch(`/api/cart/items/${itemId}`, { quantity: newQuantity });
      setCart(res.data.data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await axiosClient.post('/api/cart/apply-coupon', { code: couponCode });
      setCart(res.data.data);
      toast.success(`Coupon applied! Discount: $${res.data.data.discountAmount?.toFixed(2)}`);
      setCouponCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await axiosClient.delete('/api/cart/coupon');
      setCart(res.data.data);
      toast.success('Coupon removed');
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  };

  if (!cart) return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200 py-8 mb-10'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Shopping Cart</h1>
          <p className="text-slate-500 mt-2">You have {cart.items?.length || 0} items in your cart</p>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        {cart.items && cart.items.length > 0 ? (
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Cart Items */}
            <div className='w-full lg:w-2/3'>
              <div className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6'>
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 text-slate-500 text-sm font-semibold uppercase tracking-wider mb-4 pb-4 border-b border-slate-100">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                {cart.items.map((item) => (
                  <div key={item._id} className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-slate-100 last:border-0 last:pb-2'>
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                        {item.productId?.images?.[0] ? (
                          <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-cover mix-blend-multiply" />
                        ) : (
                          <Package className="text-slate-400 w-8 h-8" />
                        )}
                      </div>
                      <div>
                        <Link to={`/products/${item.productId?.slug}`} className="font-display font-semibold text-slate-900 text-lg hover:text-brand-600 transition-colors line-clamp-2 mb-1">
                          {item.productId?.name}
                        </Link>
                        <p className="text-sm text-slate-500">{item.productId?.brand || 'Premium Brand'}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center items-center mt-2 md:mt-0">
                      <div className="bg-slate-50 border border-slate-200 rounded-full flex items-center p-1">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-slate-700">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end items-center mt-2 md:mt-0">
                      <span className="font-bold text-lg text-slate-900">
                        ${((item.productId?.discountPrice || item.productId?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 md:col-span-1 flex justify-start md:justify-end items-center mt-2 md:mt-0">
                      <button 
                        onClick={() => handleRemoveItem(item._id)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors group"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className='w-full lg:w-1/3'>
              <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-24'>
                <h2 className='text-2xl font-display font-bold text-slate-900 mb-6'>Order Summary</h2>
                
                <div className='space-y-4 mb-6 text-slate-600'>
                  <div className='flex justify-between items-center'>
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">${cart.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-slate-900">$25.00</span>
                  </div>
                  {cart.discountAmount > 0 && (
                    <div className='flex justify-between items-center text-brand-600 font-semibold'>
                      <div className="flex items-center gap-2">
                        <span>Discount ({cart.couponCode})</span>
                        <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                      <span>-${cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className='pt-4 mt-4 border-t border-slate-100'>
                    <div className='flex justify-between items-end'>
                      <span className="font-medium text-lg text-slate-900">Total</span>
                      <span className="text-3xl font-display font-bold text-brand-600">
                        ${Math.max(0, (cart.subtotal || 0) + 25 - (cart.discountAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 text-right mt-1">Includes taxes and fees</p>
                  </div>
                </div>

                <div className='mb-8'>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Discount Code</label>
                  <div className='flex gap-2'>
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type='text' 
                        placeholder='Enter code' 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors uppercase' 
                      />
                    </div>
                    <button 
                      onClick={handleApplyCoupon} 
                      disabled={!couponCode.trim()}
                      className='bg-slate-900 text-white px-6 rounded-xl font-medium hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors'
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <Link 
                  to='/checkout' 
                  className='w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5'
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure SSL Checkout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto'>
            <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-brand-600" />
            </div>
            <h2 className='text-3xl font-display font-bold text-slate-900 mb-4'>Your cart is empty</h2>
            <p className='text-slate-500 mb-8 text-lg'>Looks like you haven't added anything to your cart yet. Discover our premium collections and find something you love.</p>
            <Link 
              to='/' 
              className='inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all'
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
