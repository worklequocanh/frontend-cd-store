import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Zap, Play, Pause, Search, CheckSquare, Square, Tag, DollarSign, Percent, AlertCircle } from 'lucide-react';
import Pagination from '../../components/Pagination';

function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    badgeText: 'SALE',
    discountType: 'percent',
    discountValue: 10,
    maxDiscountAmount: '',
    targetType: 'all_products',
    targetCategories: [],
    targetProducts: [],
    isUnlimitedTime: true
  });

  const [searchProduct, setSearchProduct] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosClient.get(`/api/admin/campaigns?page=${page}&limit=10&status=${statusFilter}`);
      setCampaigns(res.data.data.campaigns);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      toast.error('Tải danh sách chiến dịch thất bại');
    }
  };

  const fetchDependencies = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/api/products?limit=1000'),
        axiosClient.get('/api/categories')
      ]);
      setProducts(prodRes.data.data?.products || []);
      setCategories(catRes.data.data || []);
    } catch (error) {
      console.error('Failed to load products/categories for campaign center');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, statusFilter]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      badgeText: 'SALE',
      discountType: 'percent',
      discountValue: 10,
      maxDiscountAmount: '',
      targetType: 'all_products',
      targetCategories: [],
      targetProducts: [],
      isUnlimitedTime: true
    });
    setShowForm(true);
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      name: c.name || '',
      description: c.description || '',
      badgeText: c.badgeText || 'SALE',
      discountType: c.discountType || 'percent',
      discountValue: c.discountValue || 0,
      maxDiscountAmount: c.maxDiscountAmount || '',
      targetType: c.targetType || 'all_products',
      targetCategories: (c.targetCategories || []).map(cat => typeof cat === 'object' ? cat._id : cat),
      targetProducts: (c.targetProducts || []).map(p => typeof p === 'object' ? p._id : p),
      isUnlimitedTime: c.isUnlimitedTime !== undefined ? c.isUnlimitedTime : true
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.targetType === 'by_categories' && formData.targetCategories.length === 0) {
      return toast.error('Vui lòng chọn ít nhất 1 danh mục');
    }
    if (formData.targetType === 'by_products' && formData.targetProducts.length === 0) {
      return toast.error('Vui lòng chọn ít nhất 1 sản phẩm');
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null
      };

      if (editingId) {
        await axiosClient.patch(`/api/admin/campaigns/${editingId}`, payload);
        toast.success('Đã cập nhật chiến dịch!');
      } else {
        await axiosClient.post('/api/admin/campaigns', payload);
        toast.success('Đã tạo chiến dịch thành công!');
      }

      setShowForm(false);
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lưu chiến dịch thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chiến dịch này? Nếu chiến dịch đang chạy, hệ thống sẽ tự động khôi phục giá gốc cho sản phẩm.')) return;
    try {
      await axiosClient.delete(`/api/admin/campaigns/${id}`);
      toast.success('Đã xóa chiến dịch và hoàn tác giá!');
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa chiến dịch thất bại');
    }
  };

  const handleToggleAction = async (id, action) => {
    try {
      setTogglingId(id);
      const res = await axiosClient.post(`/api/admin/campaigns/${id}/toggle`, { action });
      toast.success(res.data?.message || 'Thao tác thành công!');
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setTogglingId(null);
    }
  };

  const toggleProductSelection = (productId) => {
    setFormData(prev => {
      const exists = prev.targetProducts.includes(productId);
      return {
        ...prev,
        targetProducts: exists
          ? prev.targetProducts.filter(id => id !== productId)
          : [...prev.targetProducts, productId]
      };
    });
  };

  const toggleCategorySelection = (categoryId) => {
    setFormData(prev => {
      const exists = prev.targetCategories.includes(categoryId);
      return {
        ...prev,
        targetCategories: exists
          ? prev.targetCategories.filter(id => id !== categoryId)
          : [...prev.targetCategories, categoryId]
      };
    });
  };

  const selectAllFilteredProducts = (filteredList) => {
    const ids = filteredList.map(p => p._id);
    setFormData(prev => {
      const allSelected = ids.every(id => prev.targetProducts.includes(id));
      return {
        ...prev,
        targetProducts: allSelected
          ? prev.targetProducts.filter(id => !ids.includes(id))
          : Array.from(new Set([...prev.targetProducts, ...ids]))
      };
    });
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchProduct.toLowerCase()) || 
    p.slug?.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Preview Price Calculator helper
  const calculatePreviewPrice = (originalPrice) => {
    if (!originalPrice) return 0;
    if (formData.discountType === 'percent') {
      let amt = (originalPrice * Number(formData.discountValue || 0)) / 100;
      if (formData.maxDiscountAmount && amt > Number(formData.maxDiscountAmount)) {
        amt = Number(formData.maxDiscountAmount);
      }
      return Math.max(0, originalPrice - amt).toFixed(2);
    } else {
      return Math.max(0, originalPrice - Number(formData.discountValue || 0)).toFixed(2);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Đang chạy (Active)</span>;
      case 'paused':
        return <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full">Đã tạm dừng (Paused)</span>;
      case 'ended':
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">Đã kết thúc (Ended)</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">Bản nháp (Draft)</span>;
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
            Quản Lý Chiến Dịch Khuyến Mãi
          </h1>
          <p className="text-slate-500 mt-1">Thiết lập các đợt giảm giá đồng loạt theo %, số tiền cố định và quản lý tự động khôi phục giá.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Chiến Dịch Mới</span>
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'active', label: '🟢 Đang chạy' },
          { key: 'draft', label: '🟡 Bản nháp' },
          { key: 'paused', label: '🔴 Đã tạm dừng' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              statusFilter === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tên Chiến Dịch</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mức Giảm</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phạm Vi Áp Dụng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                        {c.name}
                        {c.badgeText && (
                          <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                            {c.badgeText}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.description || 'Không có mô tả'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-extrabold text-brand-600 text-base">
                      {c.discountType === 'percent' ? `Giảm ${c.discountValue}%` : `Giảm $${Number(c.discountValue).toFixed(2)}`}
                    </div>
                    {c.maxDiscountAmount && (
                      <div className="text-[11px] text-slate-400">Tối đa ${Number(c.maxDiscountAmount).toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl inline-block">
                      {c.targetType === 'all_products' && '📦 Tất cả sản phẩm'}
                      {c.targetType === 'by_categories' && `📂 ${c.targetCategories?.length || 0} Danh mục`}
                      {c.targetType === 'by_products' && `🎯 ${c.targetProducts?.length || 0} Sản phẩm`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {c.status !== 'active' ? (
                        <button
                          onClick={() => handleToggleAction(c._id, 'apply')}
                          disabled={togglingId === c._id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                          title="Áp dụng giảm giá lên sản phẩm ngay"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{togglingId === c._id ? 'Đang áp dụng...' : 'Kích hoạt'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleAction(c._id, 'revert')}
                          disabled={togglingId === c._id}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                          title="Tạm dừng và hoàn tác lại toàn bộ giá gốc ban đầu"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>{togglingId === c._id ? 'Đang hoàn tác...' : 'Tạm dừng & Khôi phục giá'}</span>
                        </button>
                      )}

                      {c.status !== 'active' && (
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa chiến dịch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {campaigns.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Chưa có chiến dịch nào. Hãy tạo chiến dịch đầu tiên để thúc đẩy doanh số!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Modal Panel Tạo / Sửa Chiến Dịch */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col my-auto">
            {/* Panel Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">
                  {editingId ? 'Chỉnh Sửa Chiến Dịch Khuyến Mãi' : 'Tạo Chiến Dịch Khuyến Mãi Mới'}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">Thiết lập mức giảm và chọn sản phẩm/danh mục áp dụng.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Panel Body */}
            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
              {/* Section 1: Basic Info */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-600" />
                  1. Thông Tin Chung
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tên Chiến Dịch</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Siêu Sale Mùa Hè 2026"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Huy Hiệu (Badge hiển thị trên ảnh)</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      placeholder="VD: SALE -20% hoặc HOT DEAL"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold uppercase text-brand-600 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Mô Tả Ngắn</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="VD: Giảm giá đặc biệt tri ân khách hàng tháng 7..."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Discount Settings */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-brand-600" />
                  2. Cấu Hình Mức Giảm Giá
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Loại Giảm Giá</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="percent">Giảm theo Tỷ Lệ (%)</option>
                      <option value="fixed">Giảm số tiền cố định ($ / VNĐ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Giá Trị Giảm {formData.discountType === 'percent' ? '(%)' : '($)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      max={formData.discountType === 'percent' ? "99" : "999999"}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-lg text-brand-600 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  {formData.discountType === 'percent' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Giảm Tối Đa ($ - tùy chọn)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Không giới hạn"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Target Scope Selection */}
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-brand-600" />
                  3. Phạm Vi Áp Dụng
                </h3>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {[
                    { key: 'all_products', label: '📦 Toàn bộ sản phẩm' },
                    { key: 'by_categories', label: '📂 Chọn theo Danh mục' },
                    { key: 'by_products', label: '🎯 Chọn Sản phẩm cụ thể' }
                  ].map((scope) => (
                    <label
                      key={scope.key}
                      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border font-bold text-sm cursor-pointer transition-all ${
                        formData.targetType === scope.key
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="targetType"
                        value={scope.key}
                        checked={formData.targetType === scope.key}
                        onChange={() => setFormData({ ...formData, targetType: scope.key })}
                        className="hidden"
                      />
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.targetType === scope.key ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                      }`}>
                        {formData.targetType === scope.key && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                      </span>
                      <span>{scope.label}</span>
                    </label>
                  ))}
                </div>

                {/* Multi-select Categories Grid */}
                {formData.targetType === 'by_categories' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Tìm danh mục..."
                          value={searchCategory}
                          onChange={(e) => setSearchCategory(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <span className="text-xs font-bold text-brand-600">
                        Đã chọn: {formData.targetCategories.length} danh mục
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-2">
                      {filteredCategories.map((cat) => {
                        const selected = formData.targetCategories.includes(cat._id);
                        return (
                          <div
                            key={cat._id}
                            onClick={() => toggleCategorySelection(cat._id)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                              selected ? 'bg-brand-50 border-brand-500 font-bold text-brand-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {selected ? <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-300 shrink-0" />}
                            <span className="text-sm truncate">{cat.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Multi-select Products Grid */}
                {formData.targetType === 'by_products' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 animate-fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="relative flex-1 min-w-[240px] max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Tìm sản phẩm theo tên hoặc slug..."
                          value={searchProduct}
                          onChange={(e) => setSearchProduct(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => selectAllFilteredProducts(filteredProducts)}
                          className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          Chọn/Bỏ toàn bộ đang lọc ({filteredProducts.length})
                        </button>
                        <span className="text-xs font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg">
                          Đã chọn: {formData.targetProducts.length} SP
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                      {filteredProducts.map((p) => {
                        const selected = formData.targetProducts.includes(p._id);
                        return (
                          <div
                            key={p._id}
                            onClick={() => toggleProductSelection(p._id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                              selected ? 'bg-brand-50 border-brand-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {selected ? <CheckSquare className="w-5 h-5 text-brand-600 shrink-0" /> : <Square className="w-5 h-5 text-slate-300 shrink-0" />}
                            <img src={p.images?.[0] || 'https://via.placeholder.com/60'} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 bg-white border border-slate-200" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold text-slate-900 truncate">{p.name}</div>
                              <div className="text-xs text-slate-500 font-semibold">${p.price?.toFixed(2)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Live Price Calculator Preview */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-6 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-600" />
                  Bảng Tính Thử Giá (Live Preview)
                </h4>
                <p className="text-xs text-emerald-800">
                  Dưới đây là mô phỏng giá bán sau khi áp dụng mức giảm <b>{formData.discountType === 'percent' ? `${formData.discountValue}%` : `$${formData.discountValue}`}</b> cho sản phẩm mẫu:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {[100, 250, 499].map((samplePrice, i) => {
                    const previewNew = calculatePreviewPrice(samplePrice);
                    const saved = (samplePrice - previewNew).toFixed(2);
                    return (
                      <div key={i} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
                        <div className="text-xs font-semibold text-slate-500">Giá mẫu ban đầu: <span className="line-through">${samplePrice.toFixed(2)}</span></div>
                        <div className="my-2">
                          <span className="text-2xl font-black text-emerald-600">${previewNew}</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-fit">
                          🔥 Tiết kiệm ${saved}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang Lưu...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Cập Nhật Chiến Dịch' : 'Lưu Chiến Dịch'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCampaigns;
