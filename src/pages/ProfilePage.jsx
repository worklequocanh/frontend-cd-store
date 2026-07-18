import React, { useState } from 'react';
import { useStore } from '../store/store';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Lock, ShoppingBag, Save, Eye, EyeOff } from 'lucide-react';

function ProfilePage() {
  const { user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.put('/api/users/profile', formData);
      setUser(res.data.data);
      toast.success('Đã cập nhật hồ sơ cá nhân!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Đã đổi mật khẩu thành công!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: <User className='w-4 h-4' /> },
    { id: 'security', label: 'Bảo Mật', icon: <Lock className='w-4 h-4' /> },
  ];

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className='min-h-screen bg-slate-50 pb-20'>
      <div className='bg-white border-b border-slate-100'>
        <div className='container mx-auto px-4 py-10'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
            {/* Avatar */}
            <div className='relative'>
              <div className='w-20 h-20 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg shadow-brand-500/30'>
                {avatarLetter}
              </div>
              <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full'></div>
            </div>
            <div>
              <h1 className='text-2xl font-display font-bold text-slate-900'>{user?.name}</h1>
              <p className='text-slate-400 text-sm'>{user?.email}</p>
              <div className='flex items-center gap-4 mt-3'>
                <span className='inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full'>
                  <ShoppingBag className='w-3 h-3' />
                  Thành Viên
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 max-w-3xl'>
        {/* Tab bar */}
        <div className='flex bg-white rounded-2xl border border-slate-100 shadow-sm p-1 mb-8'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8'>
            <h2 className='text-lg font-display font-bold text-slate-900 mb-6'>Thông Tin Cá Nhân</h2>
            <form onSubmit={handleUpdateProfile} className='space-y-5'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Họ và Tên</label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                  <input
                    type='text'
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 transition-colors'
                    placeholder='Nhập họ và tên của bạn'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Địa Chỉ Email</label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300' />
                  <input
                    type='email'
                    value={user?.email}
                    disabled
                    className='w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none placeholder:text-slate-400 opacity-60 cursor-not-allowed'
                  />
                </div>
                <p className='text-xs text-slate-400 mt-1'>Không thể thay đổi địa chỉ email</p>
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Số Điện Thoại</label>
                <div className='relative'>
                  <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 transition-colors'
                    placeholder='Nhập số điện thoại của bạn'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Địa Chỉ Giao Hàng</label>
                <div className='relative'>
                  <MapPin className='absolute left-4 top-4 w-4 h-4 text-slate-400' />
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 transition-colors resize-none'
                    placeholder='Nhập địa chỉ nhận hàng mặc định của bạn'
                  />
                </div>
              </div>
              <button type='submit' disabled={loading} className='btn-primary flex items-center gap-2'>
                <Save className='w-4 h-4' />
                {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </form>
          </div>
        )}

        {/* Security tab */}
        {activeTab === 'security' && (
          <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8'>
            <h2 className='text-lg font-display font-bold text-slate-900 mb-6'>Đổi Mật Khẩu</h2>
            <form onSubmit={handleChangePassword} className='space-y-5'>
              {[
                { id: 'current', label: 'Mật Khẩu Hiện Tại', key: 'currentPassword', placeholder: '••••••••' },
                { id: 'new', label: 'Mật Khẩu Mới', key: 'newPassword', placeholder: 'Ít nhất 6 ký tự' },
                { id: 'confirm', label: 'Xác Nhận Mật Khẩu Mới', key: 'confirmPassword', placeholder: 'Nhập lại mật khẩu mới' },
              ].map(field => (
                <div key={field.id}>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>{field.label}</label>
                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input
                      type={showPw[field.id] ? 'text' : 'password'}
                      value={passwordData[field.key]}
                      onChange={e => setPasswordData({...passwordData, [field.key]: e.target.value})}
                       className='w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 transition-colors'
                      placeholder={field.placeholder}
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowPw({...showPw, [field.id]: !showPw[field.id]})}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                    >
                      {showPw[field.id] ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                </div>
              ))}
              <button type='submit' disabled={loading} className='btn-primary flex items-center gap-2'>
                <Lock className='w-4 h-4' />
                {loading ? 'Đang cập nhật...' : 'Đổi Mật Khẩu'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
