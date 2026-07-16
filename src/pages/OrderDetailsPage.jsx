import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, CreditCard, ChevronLeft, Banknote, AlertCircle, Copy, Check, QrCode, Sparkles, FileText } from 'lucide-react';

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();
  const [payosLoading, setPayosLoading] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        toast.error('Please log in first');
        navigate('/auth');
        return;
      }

      const initialSearch = window.location.search;
      const params = new URLSearchParams(initialSearch);
      const isRedirectSuccess = params.get('payos') === 'success' || params.get('sepay') === 'success' || params.get('payment') === 'success';
      const isRedirectCancel = params.get('payos') === 'cancel' || params.get('sepay') === 'cancel' || params.get('payment') === 'cancel';

      try {
        const res = await axiosClient.get(`/api/orders/${id}`);
        
        if (isRedirectSuccess) {
          try {
            const redirectRes = await axiosClient.post(`/api/orders/${id}/verify-sepay-redirect`, {
              redirectStatus: 'success'
            });
            if (redirectRes.data?.data) {
              res.data.data = redirectRes.data.data;
            }
          } catch (redirectErr) {
            console.log('Redirect verification note:', redirectErr);
          }
        }

        setOrder(res.data.data);
        
        if (res.data.data.paymentMethod === 'qr' && res.data.data.paymentStatus === 'pending') {
          const configRes = await axiosClient.get('/api/orders/config/payment');
          setPaymentConfig(configRes.data.data);
        }

        if (isRedirectSuccess) {
          window.history.replaceState(null, '', window.location.pathname);
          toast.success('Xác nhận thanh toán qua cổng SePay thành công!');
        } else if (isRedirectCancel) {
          window.history.replaceState(null, '', window.location.pathname);
          toast.info('Bạn đã quay lại từ cổng thanh toán SePay. Vui lòng tiếp tục thanh toán bên dưới!');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error(error.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  // Automatic API polling for QR status updates via SePay IPN webhook
  useEffect(() => {
    if (!order || order.paymentMethod !== 'qr' || order.paymentStatus !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        const res = await axiosClient.get(`/api/orders/${id}`);
        if (res.data?.data?.paymentStatus === 'completed') {
          setOrder(res.data.data);
          toast.success('Payment confirmed automatically via API!');
        }
      } catch (err) {
        console.error('API status check error:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [id, order?.paymentMethod, order?.paymentStatus]);

  const handleSePayCheckout = async () => {
    try {
      setPayosLoading(true);
      const res = await axiosClient.post(`/api/orders/${id}/create-sepay-link`);
      const { checkoutUrl, formFields } = res.data.data || {};
      if (checkoutUrl && formFields) {
        const form = document.createElement('form');
        form.action = checkoutUrl;
        form.method = 'POST';
        Object.keys(formFields).forEach(field => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = field;
          input.value = formFields[field];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      } else if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating SePay checkout form');
      setPayosLoading(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${fieldName}!`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      const toastId = toast.loading('Đang tạo hóa đơn PDF...');
      const response = await axiosClient.get(`/api/orders/${id}/invoice/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderNumber || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success('Tải hóa đơn PDF thành công!');
    } catch (error) {
      toast.error('Không thể tải hóa đơn PDF lúc này.');
    }
  };

  const handleMockPay = async () => {
    try {
      setMockLoading(true);
      const res = await axiosClient.post(`/api/orders/${id}/mock-pay`);
      if (res.data?.data) {
        setOrder(res.data.data);
        toast.success('🎉 Giả lập thanh toán SePay thành công!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi mô phỏng thanh toán');
    } finally {
      setMockLoading(false);
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
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <FileText className="w-4 h-4" /> Tải Hóa Đơn PDF
              </button>
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
                <Truck className="w-6 h-6 text-brand-600" /> Order Tracking Timeline
              </h2>
              
              {order.orderStatus === 'cancelled' ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600 font-bold">✕</div>
                  <h3 className="text-lg font-bold text-red-700">Order Cancelled</h3>
                  <p className="text-sm text-red-600 mt-1">{order.cancelReason || 'This order has been cancelled.'}</p>
                  {order.cancelledAt && <p className="text-xs text-red-400 mt-2">Cancelled on {new Date(order.cancelledAt).toLocaleString()}</p>}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stepper Bar */}
                  <div className="grid grid-cols-4 gap-2 relative">
                    {['pending', 'confirmed', 'shipped', 'delivered'].map((stepStatus, idx) => {
                      const stepsOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
                      const currentIdx = stepsOrder.indexOf(order.orderStatus);
                      const isCompleted = currentIdx >= idx;
                      const isCurrent = currentIdx === idx;
                      
                      const stepTitles = ['Pending Approval', 'Order Confirmed', 'In Transit (Shipped)', 'Delivered'];
                      const stepDescs = ['Order received', 'Processing in warehouse', 'Handed to courier', 'Completed'];

                      return (
                        <div key={stepStatus} className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all mb-3 ${
                            isCompleted ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span className={`text-xs md:text-sm font-bold ${isCurrent ? 'text-brand-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {stepTitles[idx]}
                          </span>
                          <span className="text-[10px] md:text-xs text-slate-500 mt-1 hidden sm:block">
                            {stepDescs[idx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Status row */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {order.paymentStatus === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Payment Status: {order.paymentStatus.toUpperCase()}</p>
                        <p className="text-xs text-slate-500">{order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Online payment via SePay Sandbox'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  <div className='flex justify-between text-brand-400 font-semibold'>
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
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
                <CreditCard className="w-5 h-5 text-brand-600" /> Payment Details
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                  order.paymentMethod === 'cod' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-violet-50 border-violet-200 text-violet-600'
                }`}>
                  {order.paymentMethod === 'cod' ? <Banknote className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}
                  </p>
                  
                  {order.paymentMethod !== 'cod' ? (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      order.paymentStatus === 'completed' || order.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {order.paymentStatus === 'completed' || order.paymentStatus === 'paid' ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Successfully Paid</>
                      ) : (
                        <><AlertCircle className="w-3.5 h-3.5" /> Unpaid</>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Payment on delivery
                    </span>
                  )}
                </div>
              </div>

              {/* SePay Payment Section */}
              {order.paymentMethod === 'qr' && order.paymentStatus === 'pending' && (
                <div className='mt-6 border-t border-slate-100 pt-6 space-y-6'>
                  <div className="bg-brand-50 border border-brand-100 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                      </span>
                      <span className="font-bold text-brand-900 text-xs md:text-sm">Chờ tự động nhận thanh toán qua SePay Webhook...</span>
                    </div>
                  </div>

                  {/* VietQR Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-slate-800 font-display font-bold">
                      <QrCode className="w-5 h-5 text-brand-600" />
                      Quét mã VietQR (Tự động nhập nội dung)
                    </div>

                    <div className="bg-white p-4 rounded-2xl inline-block shadow-md mx-auto border border-slate-100">
                      <img 
                        src={`https://qr.sepay.vn/img?acc=${paymentConfig?.accountNo || '0123456789'}&bank=${paymentConfig?.bankId || 'MBBank'}&amount=${Math.round(order.total)}&des=${order.orderNumber}`}
                        alt="SePay VietQR Code"
                        className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
                      />
                    </div>

                    {/* Bank transfer info details */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left text-sm space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-slate-500">Ngân hàng:</span>
                        <span className="font-bold text-slate-900">{paymentConfig?.bankId || 'MBBank'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-slate-500">Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">{paymentConfig?.accountNo || '0123456789'}</span>
                          <button 
                            onClick={() => handleCopy(paymentConfig?.accountNo || '0123456789', 'Số tài khoản')}
                            className="text-brand-600 hover:bg-brand-50 p-1 rounded transition-colors"
                          >
                            {copiedField === 'Số tài khoản' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-slate-500">Chủ tài khoản:</span>
                        <span className="font-bold text-slate-900 uppercase">{paymentConfig?.accountName || 'CD STORE'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-slate-500">Số tiền:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-600 text-base">${order.total?.toFixed(2)} ({Math.round(order.total).toLocaleString('vi-VN')} VND)</span>
                          <button 
                            onClick={() => handleCopy(String(Math.round(order.total)), 'Số tiền')}
                            className="text-brand-600 hover:bg-brand-50 p-1 rounded transition-colors"
                          >
                            {copiedField === 'Số tiền' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Nội dung chuyển khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono text-base">{order.orderNumber}</span>
                          <button 
                            onClick={() => handleCopy(order.orderNumber, 'Nội dung')}
                            className="text-brand-600 hover:bg-brand-50 p-1 rounded transition-colors"
                          >
                            {copiedField === 'Nội dung' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gateway Checkout Button */}
                  <button 
                    onClick={handleSePayCheckout}
                    disabled={payosLoading}
                    className='w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2'
                  >
                    {payosLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                        Đang chuyển đến cổng SePay...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 text-brand-400" />
                        Chuyển đến cổng thanh toán SePay Checkout
                      </>
                    )}
                  </button>

                  {/* Sandbox Test Simulator Panel */}
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      🧪 SePay Sandbox Mode - Công cụ kiểm thử Đồ án
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Nhấn nút dưới đây để giả lập webhook từ SePay báo thanh toán thành công (Trừ tồn kho, cập nhật trạng thái COMPLETED & gửi email):
                    </p>
                    <button 
                      onClick={handleMockPay}
                      disabled={mockLoading}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {mockLoading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                          Đang xác nhận giả lập...
                        </>
                      ) : '⚡ Mô phỏng thanh toán SePay thành công (Sandbox Test)'}
                    </button>
                  </div>
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
