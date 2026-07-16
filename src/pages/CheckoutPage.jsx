import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

function CheckoutPage() {
  const navigate = useNavigate();
  const [useDefaultInfo, setUseDefaultInfo] = useState(true);
  const { user, cart, setCart } = useStore();
  
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // Auto-fill when toggling to default info
  React.useEffect(() => {
    if (useDefaultInfo && user) {
      setShippingAddress({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [useDefaultInfo, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post(
        '/api/orders',
        { shippingAddress, paymentMethod }
      );
      setCart({ items: [], subtotal: 0, total: 0, discountAmount: 0 });
      toast.success('Order created successfully!');
      
      const orderId = res.data.data._id;
      
      if (paymentMethod === 'qr') {
        toast.success('Vui lòng quét mã VietQR hoặc chuyển đến cổng SePay để thanh toán!');
      }
      
      navigate(`/orders/${orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      <div className='bg-white border-b border-slate-200 py-8 mb-10'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Secure Checkout</h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" /> All transactions are secure and encrypted.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-8'>
          
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100'>
                  <h2 className='text-xl font-display font-bold text-slate-900'>1. Shipping Information</h2>
                  
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button 
                      type="button"
                      onClick={() => setUseDefaultInfo(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${useDefaultInfo ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Default Account Info
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUseDefaultInfo(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!useDefaultInfo ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Enter Manually
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type='text' 
                        value={shippingAddress.name} 
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} 
                        disabled={useDefaultInfo}
                        className={`w-full border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors ${useDefaultInfo ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-900'}`}
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type='tel' 
                        value={shippingAddress.phone} 
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} 
                        disabled={useDefaultInfo}
                        className={`w-full border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors ${useDefaultInfo ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-900'}`}
                        placeholder="+1 (555) 000-0000" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Complete Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea 
                        value={shippingAddress.address} 
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} 
                        disabled={useDefaultInfo}
                        className={`w-full border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors min-h-[100px] ${useDefaultInfo ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-900'}`}
                        placeholder="123 Tech Avenue, Apt 4, New York, NY" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
                <h2 className='text-xl font-display font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100'>2. Payment Method</h2>
                
                <div className='space-y-4'>
                  <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}>
                    <input type='radio' name='payment' value='cod' checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className='w-5 h-5 text-brand-600 focus:ring-brand-500' />
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-brand-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="block font-medium text-slate-900">Cash on Delivery (COD)</span>
                      <span className="text-sm text-slate-500">Pay when you receive the package</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}>
                    <input type='radio' name='payment' value='qr' checked={paymentMethod === 'qr'} onChange={(e) => setPaymentMethod(e.target.value)} className='w-5 h-5 text-brand-600 focus:ring-brand-500' />
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'qr' ? 'text-brand-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="block font-medium text-slate-900">SePay - Quét mã VietQR / Chuyển khoản</span>
                      <span className="text-sm text-slate-500">Thanh toán tự động qua VietQR hoặc Cổng SePay Sandbox</span>
                    </div>
                  </label>
                </div>
              </div>

              <button type='submit' disabled={loading} className='w-full bg-brand-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none'>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                    Processing Order...
                  </span>
                ) : 'Place Order Now'}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className='w-full lg:w-1/3'>
            <div className='bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl sticky top-24'>
              <h2 className='text-xl font-display font-bold mb-6 pb-4 border-b border-slate-700'>Order Summary</h2>
              
              {cart && cart.items && cart.items.length > 0 ? (
                <div>
                  <div className='space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-dark'>
                    {cart.items.map((item) => (
                      <div key={item._id} className='flex items-start gap-4'>
                        <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0">
                          <img src={item.productId?.images?.[0] || 'https://via.placeholder.com/50'} alt={item.productId?.name} className='w-full h-full object-cover rounded' />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className='font-medium text-sm line-clamp-2 mb-1'>{item.productId?.name}</p>
                          <p className='text-xs text-slate-400'>Qty: {item.quantity}</p>
                        </div>
                        <p className='font-semibold'>${((item.productId?.discountPrice || item.productId?.price || item.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className='border-t border-slate-700 pt-6 space-y-4 text-sm text-slate-300'>
                    <div className='flex justify-between'>
                      <span>Subtotal</span>
                      <span className='font-medium text-white'>${(cart.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Shipping</span>
                      <span className='font-medium text-white'>${((cart.subtotal || 0) > 500000 ? 0 : 250).toFixed(2)}</span>
                    </div>
                    {cart.discountAmount > 0 && (
                      <div className='flex justify-between text-brand-400 font-semibold'>
                        <span>Discount ({cart.couponCode})</span>
                        <span>-${cart.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className='flex justify-between items-end mt-6 pt-6 border-t border-slate-700'>
                      <span className='font-bold text-lg text-white'>Total</span>
                      <span className='font-display font-bold text-3xl text-brand-400'>
                        ${Math.max(0, (cart.subtotal || 0) + ((cart.subtotal || 0) > 500000 ? 0 : 250) - (cart.discountAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-slate-400'>Your cart is empty.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
