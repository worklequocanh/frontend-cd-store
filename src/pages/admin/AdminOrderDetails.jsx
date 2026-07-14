import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { ChevronLeft, Package, Truck, CheckCircle2, Clock, MapPin, Phone, CreditCard, Banknote, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosClient.get(`/api/orders/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        toast.error('Failed to load order details');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosClient.patch(`/api/admin/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated!');
      setOrder({ ...order, orderStatus: newStatus });
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='pb-10 max-w-[1200px] mx-auto'
    >
      {/* Header */}
      <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Order Details</h1>
          <p className="text-slate-500 font-mono mt-1">#{order.orderNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={order.orderStatus} 
            onChange={(e) => handleStatusChange(e.target.value)} 
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm bg-white"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100'>
            <h2 className='text-lg font-bold text-slate-900 mb-6 flex items-center gap-2'>
              <ShoppingCart className="w-5 h-5 text-brand-600" /> Items in Order
            </h2>
            
            <div className='space-y-4'>
              {order.items.map((item, index) => (
                <div key={index} className='flex gap-4 items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0'>
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 p-2">
                    {item.productId?.images?.[0] ? (
                      <img src={item.productId.images[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className='font-semibold text-slate-900 line-clamp-2 text-sm'>{item.name}</p>
                    <p className='text-slate-500 text-xs mt-1'>Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className='font-bold text-slate-900'>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100'>
            <h2 className='text-lg font-bold text-slate-900 mb-6 flex items-center gap-2'>
              <MapPin className="w-5 h-5 text-brand-600" /> Customer & Delivery
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Customer Account</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {order.userId?.name?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{order.userId?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-500">{order.userId?.email || 'No email'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Shipping Details</p>
                <p className='font-bold text-slate-900'>{order.shippingAddress.name}</p>
                <p className="flex items-center gap-2 mt-1 text-sm text-slate-600"><Phone className="w-3.5 h-3.5" /> {order.shippingAddress.phone}</p>
                <p className="text-sm text-slate-600 mt-2">{order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Summary */}
          <div className='bg-slate-900 text-white rounded-3xl p-6 shadow-xl'>
            <h2 className='text-lg font-bold mb-4 pb-4 border-b border-slate-700'>Order Summary</h2>
            
            <div className='space-y-3 text-sm text-slate-300'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='font-medium text-white'>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span className='font-medium text-white'>${order.shippingFee?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className='flex justify-between text-brand-400'>
                  <span>Discount</span>
                  <span className='font-medium'>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className='flex justify-between items-end pt-4 mt-2 border-t border-slate-700'>
                <span className='font-bold text-white'>Total</span>
                <span className='text-2xl font-display font-bold text-brand-400'>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100'>
            <h2 className='text-lg font-bold text-slate-900 mb-4 flex items-center gap-2'>
              <CreditCard className="w-5 h-5 text-brand-600" /> Payment
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                order.paymentMethod === 'cod' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-violet-50 border-violet-200 text-violet-600'
              }`}>
                {order.paymentMethod === 'cod' ? <Banknote className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>

            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-bold ${
              order.paymentStatus === 'completed' || order.paymentStatus === 'paid' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              {order.paymentStatus === 'completed' || order.paymentStatus === 'paid' ? (
                <><CheckCircle2 className="w-4 h-4" /> Payment Completed</>
              ) : (
                <><Clock className="w-4 h-4" /> Payment Pending</>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}

export default AdminOrderDetails;
