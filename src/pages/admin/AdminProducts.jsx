import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { useStore } from '../../store/store';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, PackageSearch, Save, Download } from 'lucide-react';
import Pagination from '../../components/Pagination';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', price: 0, discountPrice: '', stock: 0, categoryId: '', images: [] });
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user } = useStore();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Yêu cầu quyền Quản trị viên');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get(`/api/products?limit=10&page=${page}`);
        setProducts(res.data.data.products);
        setTotalPages(res.data.data.pages);
      } catch (error) {
        toast.error('Tải danh sách sản phẩm thất bại');
      }
    };

    fetchProducts();
  }, [user, page]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);

    try {
      setUploadingImage(true);
      const res = await axiosClient.post('/api/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), res.data.data.url]
      }));
      toast.success('Đã tải ảnh lên!');
    } catch (error) {
      toast.error('Tải ảnh lên thất bại');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axiosClient.patch(`/api/products/${editingId}`, formData);
        toast.success('Đã cập nhật sản phẩm!');
      } else {
        await axiosClient.post('/api/products', formData);
        toast.success('Đã thêm sản phẩm!');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', price: 0, discountPrice: '', stock: 0, categoryId: '', images: [] });

      const res = await axiosClient.get(`/api/products?limit=10&page=${page}`);
      setProducts(res.data.data.products);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lưu sản phẩm thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;

    try {
      await axiosClient.delete(`/api/products/${id}`);
      toast.success('Đã xóa sản phẩm!');
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      toast.error('Xóa sản phẩm thất bại');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      categoryId: product.categoryId?._id || product.categoryId || '',
      images: product.images || []
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleExport = async (format = 'xlsx') => {
    try {
      const toastId = toast.loading(`Đang xuất file kho hàng ${format.toUpperCase()}...`);
      const response = await axiosClient.get(`/api/admin/export/products?format=${format}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KhoHang_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success(`Xuất kho hàng ${format.toUpperCase()} thành công!`);
    } catch (error) {
      toast.error(`Lỗi xuất file ${format.toUpperCase()}`);
    }
  };

  return (
    <div className='pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Quản Lý Kho & Sản Phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý danh sách sản phẩm, giá bán và số lượng tồn kho.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport('xlsx')}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Xuất Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Xuất CSV (.csv)
          </button>
          <button onClick={() => {
            if (showForm) {
              setEditingId(null);
              setFormData({ name: '', slug: '', price: 0, discountPrice: '', stock: 0, categoryId: '', images: [] });
            }
            setShowForm(!showForm);
          }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/30 hover:-translate-y-0.5'}`}>
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Hủy' : 'Thêm Sản Phẩm'}
        </button>
        </div>
      </div>

      {/* Create / Edit Product Modal Panel */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col my-auto">
            {/* Panel Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">{editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{editingId ? 'Cập nhật thông tin chi tiết của sản phẩm.' : 'Nhập thông tin sản phẩm mới để thêm vào kho.'}</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', slug: '', price: 0, discountPrice: '', stock: 0, categoryId: '', images: [] });
                }} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Panel Body (Form) */}
            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Tên Sản Phẩm</label>
                  <input type='text' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-medium' placeholder="VD: Tai nghe không dây cao cấp" required />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Đường Dẫn (Slug)</label>
                  <input type='text' value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-mono text-sm' placeholder="tai-nghe-khong-day-cao-cap" required />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Giá Bán (VNĐ)</label>
                  <input type='number' step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-bold text-slate-900' required />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Giá Niêm Yết / Thị Trường ($) <span className="text-xs text-slate-400 font-normal">(Tùy chọn hiển thị gạch chéo)</span></label>
                  <input type='number' step="0.01" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? parseFloat(e.target.value) : '' })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' placeholder="Bỏ trống nếu không giảm giá" />
                  {formData.discountPrice > formData.price && formData.price > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                      🔥 Khuyến mãi: Tiết kiệm {Math.round(((formData.discountPrice - formData.price) / formData.discountPrice) * 100)}% (${(formData.discountPrice - formData.price).toFixed(2)})
                    </p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Số Lượng Kho</label>
                  <input type='number' value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-semibold' required />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Hình Ảnh Sản Phẩm</label>
                <div className='bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6'>
                  <div className='flex flex-wrap items-center gap-4 mb-4'>
                    {formData.images && formData.images.map((img, idx) => (
                      <div key={idx} className='relative group'>
                        <img src={img} alt='Hình sản phẩm' className='w-24 h-24 object-cover border border-slate-200 rounded-xl shadow-sm' />
                        <button 
                          type='button' 
                          onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm'
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-brand-200 border-dashed rounded-xl bg-brand-50 text-brand-600 cursor-pointer hover:bg-brand-100 transition-colors">
                      {uploadingImage ? (
                        <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-600"></span>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs font-semibold">Tải ảnh</span>
                        </>
                      )}
                      <input 
                        type='file' 
                        accept='image/*' 
                        onChange={handleImageUpload} 
                        disabled={uploadingImage}
                        className='hidden' 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white -mx-6 -mb-6 p-6 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', slug: '', price: 0, discountPrice: '', stock: 0, categoryId: '', images: [] });
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type='submit' 
                  className='flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all' 
                  disabled={uploadingImage}
                >
                  <Save className="w-5 h-5" /> {editingId ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Sản Phẩm</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Giá Bán</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Kho</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Trạng Thái</th>
                <th className='px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider'>Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className='hover:bg-slate-50 transition-colors group'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className='w-full h-full object-cover' />
                        ) : (
                          <PackageSearch className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-sm text-slate-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">${product.price?.toFixed(2)}</span>
                      {product.discountPrice > product.price && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-slate-400 line-through">${Number(product.discountPrice).toFixed(2)}</span>
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            -{Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className="font-medium text-slate-900">{product.stock}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className='p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors' title="Sửa">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors' title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên để bắt đầu!
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
    </div>
  );
}

export default AdminProducts;
