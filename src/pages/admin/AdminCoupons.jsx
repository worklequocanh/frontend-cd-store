import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { Ticket, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

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
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/coupons', formData);
      toast.success('Coupon created successfully');
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axiosClient.delete(`/api/coupons/${id}`);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axiosClient.patch(`/api/coupons/${id}`, { isActive: !currentStatus });
      toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update coupon status');
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
          <h1 className='text-3xl font-display font-bold text-slate-900'>Coupons & Discounts</h1>
          <p className="text-slate-500 mt-1">Manage promotional codes for your store.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Coupon
        </button>
      </div>

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Code</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Discount</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Usage Limit</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Expires</th>
                <th className='px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => {
                const isExpired = new Date(c.expiredAt) < new Date();
                return (
                  <tr key={c._id} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <span className='font-bold text-slate-900 font-mono'>{c.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className="font-bold text-brand-600">
                        {c.type === 'percent' ? `${c.value}% OFF` : `$${c.value} OFF`}
                      </span>
                      {c.maxDiscount > 0 && <span className="block text-xs text-slate-500">Up to ${c.maxDiscount}</span>}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className="text-sm font-medium text-slate-700">
                        {c.usedCount} / {c.maxUsage}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${Math.min((c.usedCount / c.maxUsage) * 100, 100)}%` }}></div>
                      </div>
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
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                      {isExpired && <span className="block text-xs text-red-500 font-semibold mt-1">Expired</span>}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium'>
                      {new Date(c.expiredAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right'>
                      <button 
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Delete Coupon"
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
                    <p className="text-lg font-medium text-slate-900">No coupons created yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900">Create New Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Coupon Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono uppercase font-bold"
                    placeholder="SUMMER50"
                  />
                  <button type="button" onClick={generateRandomCode} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                    Random
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Value</label>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Min Order Value ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({...formData, minOrderValue: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Max Discount ($) *percent only</label>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Usage Limit</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({...formData, maxUsage: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Expiration Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.expiredAt}
                    onChange={(e) => setFormData({...formData, expiredAt: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors">
                  Create Coupon
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
