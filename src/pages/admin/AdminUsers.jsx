import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { Users, Shield, User as UserIcon, Mail, Calendar, Trash2, Edit, Search, Filter, AlertCircle, X, ChevronDown, Save, MapPin, Phone, Download } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { useStore } from '../../store/store';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Confirm Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger', confirmText = 'Xác nhận' }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
          >
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                  {type === 'danger' ? <AlertCircle className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500">{message}</p>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200/50 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-sm transition-all ${
                  type === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Edit User Modal Component
const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Vui lòng nhập tên");
    
    setLoading(true);
    try {
      await onSave(user._id, formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-800">Chỉnh Sửa Thông Tin</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-slate-50/50 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và Tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số Điện Thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                    placeholder="0912 345 678"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa Chỉ</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm resize-none min-h-[80px]"
                    placeholder="123 Đường A, Quận B, TP HCM"
                  />
                </div>
              </div>
              
              <div className="pt-2 flex justify-end gap-3 mt-4 shrink-0">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200/50 transition-colors bg-white border border-slate-200 shadow-sm"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};


// Skeleton Row Component
const SkeletonRow = () => (
  <div className="flex items-center gap-6 px-6 py-5 border-b border-slate-100 animate-pulse">
    <div className="flex items-center gap-4 w-[35%]">
      <div className="w-11 h-11 bg-slate-200 rounded-2xl flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
      </div>
    </div>
    <div className="w-[20%]">
      <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
    </div>
    <div className="w-[25%]">
      <div className="w-24 h-4 bg-slate-100 rounded"></div>
    </div>
    <div className="w-[20%] flex justify-end gap-2">
      <div className="w-9 h-9 bg-slate-100 rounded-xl"></div>
      <div className="w-9 h-9 bg-slate-100 rounded-xl"></div>
      <div className="w-9 h-9 bg-slate-100 rounded-xl"></div>
    </div>
  </div>
);

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Modal states
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', userId: null, currentRole: null });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  
  const { user: currentUser } = useStore();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/users?page=${page}&limit=10`);
      setUsers(res.data.data.users);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      toast.error('Tải danh sách người dùng thất bại');
    } finally {
      // Small delay to let skeleton animation play smoothly visually
      setTimeout(() => setLoading(false), 400);
    }
  };

  const executeRoleChange = async () => {
    const { userId, currentRole } = modalConfig;
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axiosClient.patch(`/api/users/${userId}/role`, { role: newRole });
      toast.success('Đã cập nhật vai trò người dùng!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật vai trò thất bại');
    }
  };

  const executeDelete = async () => {
    const { userId } = modalConfig;
    try {
      await axiosClient.delete(`/api/users/${userId}`);
      toast.success('Đã xóa người dùng!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa người dùng thất bại');
    }
  };

  const handleUpdateUser = async (userId, data) => {
    try {
      await axiosClient.patch(`/api/users/${userId}`, data);
      toast.success('Đã cập nhật thông tin người dùng!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
  };

  const openRoleModal = (u) => {
    if (u._id === currentUser.id) {
      toast.error('Bạn không thể tự thay đổi vai trò của chính mình.');
      return;
    }
    setModalConfig({
      isOpen: true,
      action: 'role',
      type: 'warning',
      userId: u._id,
      currentRole: u.role,
      title: 'Thay Đổi Vai Trò',
      message: `Bạn có chắc chắn muốn chuyển quyền của ${u.name} thành ${u.role === 'admin' ? 'NGƯỜI DÙNG' : 'QUẢN TRỊ VIÊN'} không?`,
      confirmText: 'Đổi Quyền'
    });
  };

  const openDeleteModal = (u) => {
    if (u._id === currentUser.id) {
      toast.error('Bạn không thể tự xóa tài khoản của chính mình.');
      return;
    }
    setModalConfig({
      isOpen: true,
      action: 'delete',
      type: 'danger',
      userId: u._id,
      title: 'Xóa Tài Khoản',
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn ${u.name}? Thao tác này không thể khôi phục.`,
      confirmText: 'Xóa Tài Khoản'
    });
  };
  
  const openEditModal = (u) => {
    setEditModal({
      isOpen: true,
      user: u
    });
  };

  const handleModalConfirm = () => {
    if (modalConfig.action === 'role') executeRoleChange();
    if (modalConfig.action === 'delete') executeDelete();
  };

  const handleExport = async (format = 'xlsx') => {
    try {
      const toastId = toast.loading(`Đang xuất danh sách người dùng ${format.toUpperCase()}...`);
      const response = await axiosClient.get(`/api/admin/export/users?format=${format}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DanhSachNguoiDung_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success(`Xuất danh sách người dùng ${format.toUpperCase()} thành công!`);
    } catch (error) {
      toast.error(`Lỗi xuất file ${format.toUpperCase()}`);
    }
  };

  // Client-side filtering
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className='pb-10 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-800 tracking-tight'>Quản Lý Người Dùng</h1>
          <p className="text-slate-500 mt-1">Quản lý khách hàng, nhân viên và quản trị viên hệ thống.</p>
        </div>
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport('xlsx')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Xuất Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Xuất CSV (.csv)
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm người dùng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản Trị Viên</option>
              <option value="user">Khách Hàng</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className='bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50/50 border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]'>Thông Tin Người Dùng</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]'>Vai Trò</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]'>Ngày Tham Gia</th>
                <th className='px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]'>Thao Tác</th>
              </tr>
            </thead>
            
            {loading ? (
              <tbody>
                <tr><td colSpan="4"><SkeletonRow /></td></tr>
                <tr><td colSpan="4"><SkeletonRow /></td></tr>
                <tr><td colSpan="4"><SkeletonRow /></td></tr>
                <tr><td colSpan="4"><SkeletonRow /></td></tr>
                <tr><td colSpan="4"><SkeletonRow /></td></tr>
              </tbody>
            ) : (
              <motion.tbody 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-50"
              >
                {filteredUsers.map((u) => (
                  <motion.tr variants={itemVariants} key={u._id} className='group hover:bg-slate-50/80 transition-colors duration-200'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-display font-bold text-lg shadow-sm shrink-0 ${
                          u.role === 'admin' 
                            ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-purple-500/20' 
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 border border-slate-200/50'
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{u.name}</div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {u.email}
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                              <Phone className="w-3 h-3 text-slate-300" />
                              {u.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100/50' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {u.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                        {u.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(u.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right'>
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-500/20 transition-all"
                          title="Sửa thông tin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openRoleModal(u)}
                          disabled={u._id === currentUser.id}
                          className="p-2.5 text-brand-600 bg-brand-50 rounded-xl hover:bg-brand-600 hover:text-white hover:shadow-md hover:shadow-brand-500/20 transition-all disabled:opacity-30 disabled:hover:bg-brand-50 disabled:hover:text-brand-600 disabled:cursor-not-allowed"
                          title="Đổi vai trò"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(u)}
                          disabled={u._id === currentUser.id}
                          className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/20 transition-all disabled:opacity-30 disabled:hover:bg-red-50 disabled:hover:text-red-600 disabled:cursor-not-allowed"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                
                {!loading && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-lg font-bold text-slate-700">Không tìm thấy người dùng nào</p>
                        <p className="text-slate-500 mt-1">Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            )}
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleModalConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
      />
      
      <EditUserModal 
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        onSave={handleUpdateUser}
        user={editModal.user}
      />
    </div>
  );
}

export default AdminUsers;
