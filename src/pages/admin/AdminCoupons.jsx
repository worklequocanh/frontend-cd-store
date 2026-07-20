import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { Ticket, Plus, Trash2, CheckCircle, XCircle, Sparkles, UserCheck, Clock, Infinity as InfinityIcon } from 'lucide-react';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    value: 10,
    minOrderValue: 0,
    maxDiscount: 0,
    maxUsage: 100,
    usagePerUserLimit: 1,
    requiresNewsletter: false,
    isUnlimitedTime: false,
    startDate: new Date().toISOString().split('T')[0],
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axiosClient.get('/api/coupons/admin');
      setCoupons(res.data.data);
    } catch (error) {
      toast.error('Tải danh sách mã ưu đãi thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/coupons', formData);
      toast.success('Đã tạo mã giảm giá!');
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Tạo mã giảm giá thất bại');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) return;
    try {
      await axiosClient.delete(`/api/coupons/${id}`);
      toast.success('Đã xóa mã giảm giá!');
      fetchCoupons();
    } catch (error) {
      toast.error('Xóa mã giảm giá thất bại');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axiosClient.patch(`/api/coupons/${id}`, { isActive: !currentStatus });
      toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'tắt'} mã giảm giá!`);
      fetchCoupons();
    } catch (error) {
      toast.error('Cập nhật trạng thái mã giảm giá thất bại');
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  return (
    <div className='pb-10 max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Quản Lý Mã Giảm Giá</h1>
          <p className="text-slate-500 mt-1">Quản lý mã ưu đãi và chương trình khuyến mãi của cửa hàng.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Tạo Mã Ưu Đãi
        </button>
      </div>

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Mã Ưu Đãi</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Mức Giảm</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Giới Hạn Sử Dụng</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Trạng Thái</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Ngày Hết Hạn</th>
                <th className='px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider'>Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => {
                const isExpired = !c.isUnlimitedTime && c.expiredAt && new Date(c.expiredAt) < new Date();
                return (
                  <tr key={c._id} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <span className='font-bold text-slate-900 font-mono text-base'>{c.code}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            {c.requiresNewsletter && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                ⭐ VIP Only
                              </span>
                            )}
                            {c.usagePerUserLimit > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                👤 {c.usagePerUserLimit} lần/user
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className="font-bold text-brand-600">
                        {c.type === 'percent' ? `Giảm ${c.value}%` : `Giảm $${c.value}`}
                      </span>
                      {c.maxDiscount > 0 && <span className="block text-xs text-slate-500">Tối đa ${c.maxDiscount}</span>}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className="text-sm font-medium text-slate-700">
                        {c.usedCount} / {c.maxUsage || '∞'}
                      </div>
                      {c.maxUsage && (
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${Math.min((c.usedCount / c.maxUsage) * 100, 100)}%` }}></div>
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <button 
                        onClick={() => handleToggleActive(c._id, c.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                          c.isActive && !isExpired
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {c.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {c.isActive ? 'Đang mở' : 'Đã tắt'}
                      </button>
                      {isExpired && <span className="block text-xs text-red-500 font-semibold mt-1">Hết hạn</span>}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium'>
                      {c.isUnlimitedTime ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <InfinityIcon className="w-4 h-4" /> Vĩnh viễn
                        </span>
                      ) : (
                        new Date(c.expiredAt).toLocaleDateString()
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right'>
                      <button 
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Xóa mã ưu đãi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-900">Chưa có mã giảm giá nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col my-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-display font-bold text-slate-900">Tạo Mã Ưu Đãi Mới</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mã Khuyến Mãi</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono uppercase font-bold"
                    placeholder="GIAM50"
                  />
                  <button type="button" onClick={generateRandomCode} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                    Ngẫu nhiên
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Loại Mã</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="percent">Theo phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giá Trị Giảm</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Đơn Hàng Tối Thiểu ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({...formData, minOrderValue: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giảm Tối Đa ($) *loại %</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({...formData, maxDiscount: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tổng Lượt Dùng Toàn Cửa Hàng</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="Để trống/0 = Không giới hạn"
                    value={formData.maxUsage || ''}
                    onChange={(e) => setFormData({...formData, maxUsage: e.target.value ? Number(e.target.value) : 0})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mỗi User Được Dùng Tối Đa (Lần)</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.usagePerUserLimit}
                    onChange={(e) => setFormData({...formData, usagePerUserLimit: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.requiresNewsletter}
                    onChange={(e) => setFormData({...formData, requiresNewsletter: e.target.checked})}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <div className="text-sm">
                    <span className="font-bold text-amber-900 block">⭐ Khóa Đặc Quyền VIP Newsletter</span>
                    <span className="text-amber-700 text-xs">Chỉ người dùng đã gửi email đăng ký bản tin ở chân trang mới được dùng mã này.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isUnlimitedTime}
                    onChange={(e) => setFormData({...formData, isUnlimitedTime: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="text-sm">
                    <span className="font-bold text-indigo-900 block">⏳ Mã Vĩnh Viễn (Không giới hạn thời gian)</span>
                    <span className="text-indigo-700 text-xs">Mã sẽ có hiệu lực liên tục mà không bao giờ hết hạn.</span>
                  </div>
                </label>
              </div>

              {!formData.isUnlimitedTime && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày Bắt Đầu</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày Hết Hạn</label>
                    <input 
                      type="date" 
                      required={!formData.isUnlimitedTime}
                      value={formData.expiredAt}
                      onChange={(e) => setFormData({...formData, expiredAt: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2.5 font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors">
                  Tạo Mã Ưu Đãi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;
