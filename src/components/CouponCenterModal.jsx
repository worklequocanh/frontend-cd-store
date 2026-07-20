import React, { useState, useEffect } from 'react';
import { Ticket, X, CheckCircle2, AlertCircle, Sparkles, Copy, Mail, ArrowRight, Clock, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';

function CouponCenterModal({ isOpen, onClose, onApplyCoupon, subtotal = 0, currentCouponCode = null }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribingEmail, setSubscribingEmail] = useState('');
  const [subscribingLoading, setSubscribingLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCoupons();
      // Try to get stored user email from local storage
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser && storedUser.email) {
          setUserEmail(storedUser.email);
          setSubscribingEmail(storedUser.email);
        }
      } catch (e) {}
    }
  }, [isOpen]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/coupons');
      setCoupons(res.data.data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách mã ưu đãi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubscribe = async (e) => {
    e?.preventDefault();
    if (!subscribingEmail || !subscribingEmail.includes('@')) {
      toast.error('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }
    setSubscribingLoading(true);
    try {
      const res = await axiosClient.post('/api/newsletter/subscribe', { email: subscribingEmail });
      toast.success('🎉 Kích hoạt Đặc quyền VIP thành công! Bạn có thể áp dụng mã VIP100 ngay bây giờ.');
      if (onApplyCoupon) {
        onApplyCoupon('VIP100');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký VIP thất bại');
    } finally {
      setSubscribingLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 p-6 text-white flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-brand-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                Kho Mã Ưu Đãi Độc Quyền
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">Chọn và áp dụng mã phù hợp nhất cho đơn hàng của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick VIP Banner Inside Modal if any coupon requires newsletter */}
        <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border-b border-amber-500/20 p-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kích Hoạt Đặc Quyền VIP100 (-$10.00)</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Đăng ký email bản tin để mở khóa ngay mã VIP100 và ưu đãi dành riêng cho thành viên VIP.</p>
              </div>
            </div>
            <form onSubmit={handleQuickSubscribe} className="flex gap-2 shrink-0">
              <input
                type="email"
                value={subscribingEmail}
                onChange={(e) => setSubscribingEmail(e.target.value)}
                placeholder="Nhập email..."
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 w-44"
              />
              <button
                type="submit"
                disabled={subscribingLoading}
                className="bg-gradient-to-r from-amber-500 to-brand-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 flex items-center gap-1"
              >
                {subscribingLoading ? '...' : 'Đăng ký ngay'}
              </button>
            </form>
          </div>
        </div>

        {/* Coupon List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600 mx-auto mb-3"></div>
              <p className="text-sm text-slate-500 font-medium">Đang tìm các ưu đãi tốt nhất...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-900">Chưa có ưu đãi nào khả dụng</p>
              <p className="text-xs text-slate-400 mt-1">Hãy quay lại sau hoặc kiểm tra các chương trình đặc biệt ở trang chủ.</p>
            </div>
          ) : (
            coupons.map((coupon) => {
              const isSelected = currentCouponCode === coupon.code;
              const isEligible = subtotal >= (coupon.minOrderValue || 0);
              const missingValue = Math.max(0, (coupon.minOrderValue || 0) - subtotal);

              return (
                <div
                  key={coupon._id}
                  className={`border-2 rounded-2xl p-4 transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-md'
                      : isEligible
                      ? 'border-slate-200 bg-white hover:border-brand-300 shadow-sm'
                      : 'border-slate-100 bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Code & details */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                          : isEligible
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Ticket className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-mono font-bold text-lg text-slate-900">{coupon.code}</span>
                          {coupon.requiresNewsletter && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              ⭐ VIP Only
                            </span>
                          )}
                          {coupon.usagePerUserLimit > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                              👤 {coupon.usagePerUserLimit} lần/user
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-brand-600 text-base mt-1">
                          {coupon.type === 'percent' ? `Giảm ${coupon.value}%` : `Giảm ngay $${coupon.value.toFixed(2)}`}
                          {coupon.maxDiscount > 0 && <span className="text-xs text-slate-500 font-normal ml-1.5">(Tối đa ${coupon.maxDiscount})</span>}
                        </p>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                          <span>Đơn tối thiểu: <strong className="text-slate-700 font-semibold">${coupon.minOrderValue || 0}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {coupon.isUnlimitedTime ? (
                              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                <InfinityIcon className="w-3.5 h-3.5" /> Vĩnh viễn
                              </span>
                            ) : (
                              <span>HSD: {new Date(coupon.expiredAt).toLocaleDateString()}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Apply action */}
                    <div className="flex flex-col sm:items-end justify-center shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md">
                          <CheckCircle2 className="w-4 h-4" /> Đang áp dụng
                        </span>
                      ) : isEligible ? (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyCoupon(coupon.code);
                            onClose();
                          }}
                          className="bg-slate-900 hover:bg-brand-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <span>Dùng Mã Này</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200/80 text-slate-600 font-medium text-xs">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Cần mua thêm ${(missingValue).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Ưu đãi tự động tối ưu cho giỏ hàng
          </span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 px-4 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CouponCenterModal;
