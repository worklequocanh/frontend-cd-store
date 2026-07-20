import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, User, CreditCard, Banknote, ShieldCheck, AlertTriangle, Ticket, Sparkles } from 'lucide-react';
import CouponCenterModal from '../components/CouponCenterModal';

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
  const [showCouponModal, setShowCouponModal] = useState(false);

  const handleApplyCoupon = async (code) => {
    if (!code || !code.trim()) return;
    try {
      const res = await axiosClient.post('/api/cart/coupon', { code: code.trim() });
      setCart(res.data.data);
      toast.success(`Đã áp dụng mã giảm giá! Giảm: $${(res.data.data.discountAmount || 0).toFixed(2)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    }
  };

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

  // Kiểm tra thông tin mặc định của tài khoản có đủ không
  const defaultInfoMissing = useDefaultInfo && (
    !user?.phone?.trim() || !user?.address?.trim()
  );

  // Danh sách trường còn thiếu
  const missingFields = [];
  if (useDefaultInfo) {
    if (!user?.phone?.trim()) missingFields.push('Số điện thoại');
    if (!user?.address?.trim()) missingFields.push('Địa chỉ giao hàng');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    // Chặn nếu thông tin mặc định chưa đủ
    if (defaultInfoMissing) {
      toast.error('Vui lòng cập nhật đầy đủ thông tin tài khoản trước khi đặt hàng');
      return;
    }

    // Validate khi nhập tay
    if (!useDefaultInfo) {
      if (!shippingAddress.name?.trim()) {
        toast.error('Vui lòng nhập họ tên người nhận');
        return;
      }
      if (!shippingAddress.phone?.trim()) {
        toast.error('Vui lòng nhập số điện thoại');
        return;
      }
      if (!shippingAddress.address?.trim()) {
        toast.error('Vui lòng nhập địa chỉ giao hàng');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await axiosClient.post(
        '/api/orders',
        { shippingAddress, paymentMethod }
      );
      setCart({ items: [], subtotal: 0, total: 0, discountAmount: 0 });
      toast.success('Đặt hàng thành công!');

      const orderId = res.data.data._id;

      if (paymentMethod === 'qr') {
        toast.success('Vui lòng quét mã VietQR hoặc chuyển đến cổng SePay để thanh toán!');
      }

      navigate(`/orders/${orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      <div className='bg-white border-b border-slate-200 py-8 mb-10'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Thanh Toán Đơn Hàng</h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Mọi giao dịch đều được mã hóa và bảo mật an toàn.
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
                  <h2 className='text-xl font-display font-bold text-slate-900'>1. Thông Tin Giao Hàng</h2>

                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setUseDefaultInfo(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${useDefaultInfo ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Thông tin tài khoản
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseDefaultInfo(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!useDefaultInfo ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Nhập thủ công
                    </button>
                  </div>
                </div>

                {/* Cảnh báo thiếu thông tin */}
                {defaultInfoMissing && (
                  <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">Thông tin tài khoản chưa đầy đủ</p>
                      <p className="text-amber-700 text-sm mt-0.5">
                        Bạn chưa cập nhật: <span className="font-bold">{missingFields.join(', ')}</span>.
                        Vui lòng{' '}
                        <Link to="/profile" className="underline font-bold hover:text-amber-900">
                          cập nhật hồ sơ
                        </Link>{' '}
                        hoặc chọn <strong>"Nhập thủ công"</strong> để tiếp tục.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Họ và Tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type='text'
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        disabled={useDefaultInfo}
                        className={`w-full border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors ${useDefaultInfo ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-900'}`}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Số Điện Thoại
                      {useDefaultInfo && !user?.phone?.trim() && (
                        <span className="ml-2 text-xs text-red-500 font-semibold">⚠ Chưa cập nhật</span>
                      )}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type='tel'
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        disabled={useDefaultInfo}
                        className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors ${
                          useDefaultInfo
                            ? !user?.phone?.trim()
                              ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                              : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                        placeholder="0912 345 678"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Địa Chỉ Giao Hàng
                      {useDefaultInfo && !user?.address?.trim() && (
                        <span className="ml-2 text-xs text-red-500 font-semibold">⚠ Chưa cập nhật</span>
                      )}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        disabled={useDefaultInfo}
                        className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors min-h-[100px] ${
                          useDefaultInfo
                            ? !user?.address?.trim()
                              ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                              : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100'>
                <h2 className='text-xl font-display font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100'>2. Phương Thức Thanh Toán</h2>

                <div className='space-y-4'>
                  <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}>
                    <input type='radio' name='payment' value='cod' checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className='w-5 h-5 text-brand-600 focus:ring-brand-500' />
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-brand-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="block font-medium text-slate-900">Tiền mặt khi nhận hàng (COD)</span>
                      <span className="text-sm text-slate-500">Thanh toán trực tiếp khi nhận được hàng</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}>
                    <input type='radio' name='payment' value='qr' checked={paymentMethod === 'qr'} onChange={(e) => setPaymentMethod(e.target.value)} className='w-5 h-5 text-brand-600 focus:ring-brand-500' />
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'qr' ? 'text-brand-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="block font-medium text-slate-900">Chuyển khoản qua SePay / VietQR</span>
                      <span className="text-sm text-slate-500">Thanh toán tự động qua mã QR hoặc cổng SePay</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type='submit'
                disabled={loading || defaultInfoMissing}
                className='w-full bg-brand-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none'
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                    Đang xử lý đơn hàng...
                  </span>
                ) : defaultInfoMissing ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Cập nhật thông tin để tiếp tục
                  </span>
                ) : 'Đặt Hàng Ngay'}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className='w-full lg:w-1/3'>
            <div className='bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl sticky top-24'>
              <h2 className='text-xl font-display font-bold mb-6 pb-4 border-b border-slate-700'>Tóm Tắt Đơn Hàng</h2>

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
                          <p className='text-xs text-slate-400'>Số lượng: {item.quantity}</p>
                        </div>
                        <p className='font-semibold whitespace-nowrap'>
                          ${((item.productId?.discountPrice || item.productId?.price || item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className='border-t border-slate-700 pt-6 space-y-4 text-sm text-slate-300'>
                    <div className='flex justify-between'>
                      <span>Tạm tính</span>
                      <span className='font-medium text-white'>${(cart.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Phí vận chuyển</span>
                      <span className='font-medium text-white'>
                        {(cart.subtotal || 0) > 500000
                          ? <span className="text-green-400">Miễn phí</span>
                          : '$250.00'}
                      </span>
                    </div>

                    {/* Coupon center button in Checkout summary */}
                    <div className="pt-2">
                      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-brand-400 shrink-0" />
                          <div className="text-xs">
                            <span className="text-slate-300 block font-medium">Mã ưu đãi</span>
                            <span className="font-bold text-white font-mono">
                              {cart.couponCode || 'Chưa áp dụng mã'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCouponModal(true)}
                          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                        >
                          {cart.couponCode ? 'Đổi mã' : 'Chọn voucher'}
                        </button>
                      </div>
                    </div>

                    {cart.discountAmount > 0 && (
                      <div className='flex justify-between text-brand-400 font-semibold pt-1'>
                        <span>Giảm giá ({cart.couponCode})</span>
                        <span>-${(cart.discountAmount || 0).toFixed(2)}</span>
                      </div>
                    )}

                    <div className='flex justify-between items-end mt-6 pt-6 border-t border-slate-700'>
                      <span className='font-bold text-lg text-white'>Tổng cộng</span>
                      <span className='font-display font-bold text-3xl text-brand-400'>
                        ${Math.max(0, (cart.subtotal || 0) + ((cart.subtotal || 0) > 500000 ? 0 : 250) - (cart.discountAmount || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-slate-400'>Giỏ hàng trống.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      <CouponCenterModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onApplyCoupon={handleApplyCoupon}
        subtotal={cart.subtotal || 0}
        currentCouponCode={cart.couponCode}
      />
    </div>
  );
}

export default CheckoutPage;
