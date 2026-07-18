import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, CreditCard, Banknote, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xử lý',   color: 'bg-amber-100 text-amber-700',   icon: <Clock className='w-3.5 h-3.5' /> },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700',     icon: <CheckCircle className='w-3.5 h-3.5' /> },
  shipped:   { label: 'Đang giao',   color: 'bg-indigo-100 text-indigo-700', icon: <Truck className='w-3.5 h-3.5' /> },
  delivered: { label: 'Đã giao', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className='w-3.5 h-3.5' /> },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700',       icon: <XCircle className='w-3.5 h-3.5' /> },
};

function PaymentBadge({ method, paymentStatus }) {
  const isOnline = method === 'qr' || method === 'online' || method === 'payos' || method === 'sepay';
  const isPaid = paymentStatus === 'completed' || paymentStatus === 'paid';

  if (!isOnline) {
    return (
      <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600'>
        <Banknote className='w-3.5 h-3.5' />
        COD
      </span>
    );
  }

  return (
    <div className='flex items-center gap-1.5'>
      <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700'>
        <CreditCard className='w-3.5 h-3.5' />
        Chuyển khoản
      </span>
      {isPaid ? (
        <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700'>
          <CheckCircle className='w-3 h-3' />
          Đã thanh toán
        </span>
      ) : (
        <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600'>
          <AlertCircle className='w-3 h-3' />
          Chưa thanh toán
        </span>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  return (
    <Link
      to={`/orders/${order._id}`}
      className='group block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200'
    >
      {/* Header row */}
      <div className='flex items-center justify-between px-5 py-4 border-b border-slate-50'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors'>
            <Package className='w-5 h-5' />
          </div>
          <div>
            <p className='text-sm font-bold text-slate-900'>#{order.orderNumber}</p>
            <p className='text-xs text-slate-400'>{new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
          <ChevronRight className='w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all' />
        </div>
      </div>

      {/* Body */}
      <div className='px-5 py-4'>
        {/* Items list */}
        <div className='flex flex-wrap gap-x-4 gap-y-1 mb-4'>
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className='flex items-center gap-1.5 text-sm text-slate-600'>
              <span className='font-medium text-slate-800'>{item.name}</span>
              <span className='text-slate-300'>×</span>
              <span className='font-semibold text-slate-700'>{item.quantity}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <span className='text-xs text-slate-400 font-medium self-center'>+{order.items.length - 3} sản phẩm khác</span>
          )}
        </div>

        {/* Footer row: payment info + total */}
        <div className='flex items-center justify-between pt-3 border-t border-slate-50'>
          <PaymentBadge method={order.paymentMethod} paymentStatus={order.paymentStatus} />
          <span className='font-display font-bold text-lg text-slate-900'>${(order.total || 0).toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axiosClient.get('/api/orders')
      .then(res => setOrders(res.data.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filters = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50'>
      <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600'></div>
    </div>
  );

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      <div className='bg-white border-b border-slate-100'>
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-2xl font-display font-bold text-slate-900'>Đơn Hàng Của Tôi</h1>
          <p className='text-slate-400 text-sm mt-1'>Tổng cộng {orders.length} đơn hàng</p>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 max-w-3xl'>
        {/* Filter tabs */}
        <div className='flex gap-2 flex-wrap mb-8'>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {f === 'all' ? 'Tất cả' : STATUS_CONFIG[f]?.label || f}
              {f !== 'all' && orders.filter(o => o.orderStatus === f).length > 0 && (
                <span className='ml-1.5 opacity-70'>({orders.filter(o => o.orderStatus === f).length})</span>
              )}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className='space-y-4'>
            {filtered.map((order, i) => (
              <div key={order._id} className='animate-fade-in-up' style={{ animationDelay: `${i * 50}ms` }}>
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm'>
            <div className='w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5'>
              <Package className='w-10 h-10 text-slate-300' />
            </div>
            <h3 className='text-xl font-display font-bold text-slate-900 mb-2'>Chưa có đơn hàng nào</h3>
            <p className='text-slate-400 mb-6 text-sm'>
              {filter === 'all' ? "Bạn chưa đặt mua đơn hàng nào." : `Không tìm thấy đơn hàng ở trạng thái ${STATUS_CONFIG[filter]?.label || filter}.`}
            </p>
            <Link to='/' className='btn-primary inline-flex'>Khám Phá Sản Phẩm</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
