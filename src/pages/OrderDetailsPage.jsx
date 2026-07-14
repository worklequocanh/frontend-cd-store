import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, CreditCard, ChevronLeft } from 'lucide-react';

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();
  const [payosLoading, setPayosLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        toast.error('Please log in first');
        navigate('/auth');
        return;
      }

      try {
        const res = await axiosClient.get(`/api/orders/${id}`);
        setOrder(res.data.data);
        
        if (res.data.data.paymentMethod === 'qr' && res.data.data.paymentStatus === 'pending') {
          const configRes = await axiosClient.get('/api/orders/config/payment');
          setPaymentConfig(configRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error(error.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const params = new URLSearchParams(window.location.search);
    if (params.get('payos') === 'success') {
      toast.success('Payment successful! Order status is updating.');
      window.history.replaceState(null, '', window.location.pathname);
    } else if (params.get('payos') === 'cancel') {
      toast.error('Payment was cancelled.');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [id, user, navigate]);

  const handlePayOSCheckout = async () => {
    try {
      setPayosLoading(true);
      const res = await axiosClient.post(`/api/orders/${id}/create-payos-link`);
      if (res.data.data.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating payment link');
      setPayosLoading(false);
    }
  };

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  if (!order) return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Order not found</h2>
        <p className="text-slate-500 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
        <Link to='/' className="text-brand-600 font-medium hover:underline">Return to Home</Link>
      </div>
    </div>
  );

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      <div className='bg-white border-b border-slate-200 py-6 mb-10'>
        <div className='container mx-auto px-4'>
          <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Orders
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className='text-3xl font-display font-bold text-slate-900 mb-2'>Order Details</h1>
              <p className="text-slate-500 font-mono">#{order.orderNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {order.paymentStatus === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
              <h2 className='text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2'>
                <Package className="w-6 h-6 text-brand-600" /> Order Items
              </h2>
              
              <div className='space-y-6'>
                {order.items.map((item, index) => (
                  <div key={index} className='flex gap-4 items-center pb-6 border-b border-slate-100 last:border-0 last:pb-0'>
                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                      {item.productId?.images?.[0] ? (
                        <img src={item.productId.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                        <Package className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId?.slug}`} className='font-display font-semibold text-slate-900 hover:text-brand-600 transition-colors line-clamp-2'>
                        {item.name}
                      </Link>
                      <p className='text-slate-500 text-sm mt-1'>Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className='font-bold text-slate-900'>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline (Status) */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
              <h2 className='text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-2'>
                <Truck className="w-6 h-6 text-brand-600" /> Order Tracking
              </h2>
              
              <div className="relative pl-6 border-l-2 border-brand-100 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[35px] w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center ring-4 ring-white">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900">Order Placed</h3>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className={`relative ${order.paymentStatus === 'completed' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${order.paymentStatus === 'completed' ? 'bg-brand-500' : 'bg-slate-200'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${order.paymentStatus === 'completed' ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="font-bold text-slate-900">Payment Confirmed</h3>
                  <p className="text-sm text-slate-500">{order.paymentStatus === 'completed' ? 'We have received your payment' : 'Awaiting payment'}</p>
                </div>
                
                <div className={`relative ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'bg-brand-500' : 'bg-slate-200'}`}>
                    <Truck className={`w-3.5 h-3.5 ${order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="font-bold text-slate-900">Shipped</h3>
                  <p className="text-sm text-slate-500">Your order is on the way</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Order Summary */}
            <div className='bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl'>
              <h2 className='text-xl font-display font-bold mb-6 pb-4 border-b border-slate-700'>Summary</h2>
              
              <div className='space-y-4 text-sm text-slate-300'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='font-medium text-white'>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping Fee</span>
                  <span className='font-medium text-white'>${order.shippingFee?.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className='flex justify-between text-brand-400'>
                    <span>Discount</span>
                    <span className='font-medium'>-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className='flex justify-between items-end pt-6 mt-4 border-t border-slate-700'>
                  <span className='font-bold text-lg text-white'>Total</span>
                  <span className='text-3xl font-display font-bold text-brand-400'>${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
              <h2 className='text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2'>
                <MapPin className="w-5 h-5 text-brand-600" /> Shipping Info
              </h2>
              
              <div className="space-y-4 text-slate-600">
                <div>
                  <p className='font-bold text-slate-900'>{order.shippingAddress.name}</p>
                  <p className="flex items-center gap-2 mt-1"><Phone className="w-4 h-4" /> {order.shippingAddress.phone}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.district}</p>
                  <p>{order.shippingAddress.city}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
              <h2 className='text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2'>
                <CreditCard className="w-5 h-5 text-brand-600" /> Payment
              </h2>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                  <CreditCard className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                  <p className="text-sm text-slate-500">
                    {order.paymentStatus === 'completed' ? 'Paid completely' : 'Pending payment'}
                  </p>
                </div>
              </div>

              {/* PayOS Payment Section */}
              {order.paymentMethod === 'qr' && order.paymentStatus === 'pending' && (
                <div className='mt-6 border-t border-slate-100 pt-6'>
                  <div className="bg-brand-50 p-4 rounded-2xl mb-4">
                    <h3 className='font-bold text-brand-900 text-sm mb-2'>Pay with PayOS</h3>
                    <p className='text-xs text-brand-700 leading-relaxed'>
                      Securely pay via QR code using any banking app. Instant confirmation.
                    </p>
                  </div>

                  <button 
                    onClick={handlePayOSCheckout}
                    disabled={payosLoading}
                    className='w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none'
                  >
                    {payosLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                        Processing...
                      </span>
                    ) : 'Pay Now'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
