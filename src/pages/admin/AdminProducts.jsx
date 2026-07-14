import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { useStore } from '../../store/store';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, PackageSearch, Save } from 'lucide-react';
import Pagination from '../../components/Pagination';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', price: 0, stock: 0, categoryId: '', images: [] });
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user } = useStore();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get(`/api/products?limit=10&page=${page}`);
        setProducts(res.data.data.products);
        setTotalPages(res.data.data.pages);
      } catch (error) {
        toast.error('Failed to load products');
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
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axiosClient.patch(`/api/products/${editingId}`, formData);
        toast.success('Product updated!');
      } else {
        await axiosClient.post('/api/products', formData);
        toast.success('Product created!');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', price: 0, stock: 0, categoryId: '', images: [] });

      const res = await axiosClient.get(`/api/products?limit=10&page=${page}`);
      setProducts(res.data.data.products);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosClient.delete(`/api/products/${id}`);
      toast.success('Product deleted!');
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || '',
      images: product.images || []
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  return (
    <div className='pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Products</h1>
          <p className="text-slate-500 mt-1">Manage your store's inventory and product details.</p>
        </div>
        <button onClick={() => {
          if (showForm) {
            setEditingId(null);
            setFormData({ name: '', slug: '', price: 0, stock: 0, categoryId: '', images: [] });
          }
          setShowForm(!showForm);
        }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-500/30 hover:-translate-y-0.5'}`}>
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 animate-fade-in'>
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6">{editingId ? 'Edit Product' : 'Create New Product'}</h2>
          
          <form onSubmit={handleSave} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Product Name</label>
                <input type='text' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' placeholder="e.g. Premium Wireless Headphones" required />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>URL Slug</label>
                <input type='text' value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' placeholder="premium-wireless-headphones" required />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Price ($)</label>
                <input type='number' step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' required />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Stock Quantity</label>
                <input type='number' value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' required />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Product Images</label>
              <div className='bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6'>
                <div className='flex flex-wrap items-center gap-4 mb-4'>
                  {formData.images && formData.images.map((img, idx) => (
                    <div key={idx} className='relative group'>
                      <img src={img} alt='Product' className='w-24 h-24 object-cover border border-slate-200 rounded-xl shadow-sm' />
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
                        <span className="text-xs font-semibold">Upload</span>
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

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type='submit' className='flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all' disabled={uploadingImage}>
                <Save className="w-5 h-5" /> {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Product</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Price</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Stock</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider'>Actions</th>
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
                    <span className="font-medium text-slate-900">${product.price?.toFixed(2)}</span>
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
                      {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className='p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors' title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors' title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No products found. Add your first product to get started!
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
