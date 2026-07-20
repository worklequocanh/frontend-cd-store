import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Trash2, Eye, CheckCircle2, Clock, Mail, Phone, User, Calendar, X, Save, Filter, AlertCircle, Send } from 'lucide-react';

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [modalStatus, setModalStatus] = useState('unread');
  const [isUpdating, setIsUpdating] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/admin/contacts?limit=100');
      setContacts(res.data.data?.contacts || []);
    } catch (error) {
      console.error('Failed to fetch contact inquiries:', error);
      toast.error('Không thể tải danh sách lời nhắn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenDetail = async (contact) => {
    setSelectedContact(contact);
    setAdminNotes(contact.adminNotes || '');
    setModalStatus(contact.status || 'unread');
    setReplySubject(`[CD Store] Phản hồi yêu cầu hỗ trợ: ${contact.subject}`);
    setReplyMessage('');
    setShowReplyForm(false);

    // Auto mark as read if currently unread
    if (contact.status === 'unread') {
      try {
        const res = await axiosClient.patch(`/api/admin/contacts/${contact._id}/status`, { status: 'read' });
        const updated = res.data.data;
        setContacts((prev) => prev.map((c) => (c._id === contact._id ? updated : c)));
        setSelectedContact(updated);
        setModalStatus('read');
      } catch (error) {
        console.error('Failed to auto-mark as read:', error);
      }
    }
  };

  // Update status / notes in modal
  const handleSaveModal = async () => {
    if (!selectedContact) return;
    setIsUpdating(true);
    try {
      const res = await axiosClient.patch(`/api/admin/contacts/${selectedContact._id}/status`, {
        status: modalStatus,
        adminNotes: adminNotes,
      });
      const updated = res.data.data;
      setContacts((prev) => prev.map((c) => (c._id === selectedContact._id ? updated : c)));
      setSelectedContact(updated);
      toast.success('Đã cập nhật trạng thái và ghi chú xử lý');
    } catch (error) {
      console.error('Failed to update contact inquiry:', error);
      toast.error('Lỗi khi cập nhật lời nhắn');
    } finally {
      setIsUpdating(false);
    }
  };

  // Send email reply directly to customer
  const handleSendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) {
      toast.error('Vui lòng nhập nội dung email phản hồi');
      return;
    }
    setIsSendingReply(true);
    try {
      const res = await axiosClient.post(`/api/admin/contacts/${selectedContact._id}/reply`, {
        subject: replySubject,
        replyMessage: replyMessage,
      });
      const updated = res.data.data;
      setContacts((prev) => prev.map((c) => (c._id === selectedContact._id ? updated : c)));
      setSelectedContact(updated);
      setAdminNotes(updated.adminNotes || '');
      setModalStatus(updated.status || 'replied');
      setReplyMessage('');
      setShowReplyForm(false);
      toast.success('Đã gửi email phản hồi trực tiếp cho khách hàng!');
    } catch (error) {
      console.error('Error sending reply email:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi email phản hồi');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Quick status change from table
  const handleQuickStatus = async (id, status, e) => {
    e.stopPropagation();
    try {
      const res = await axiosClient.patch(`/api/admin/contacts/${id}/status`, { status });
      const updated = res.data.data;
      setContacts((prev) => prev.map((c) => (c._id === id ? updated : c)));
      toast.success(`Đã chuyển trạng thái sang: ${status === 'replied' ? 'Đã phản hồi' : status === 'read' ? 'Đã đọc' : 'Chưa đọc'}`);
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  // Delete contact
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa lời nhắn liên hệ này không?')) return;

    try {
      await axiosClient.delete(`/api/admin/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (selectedContact?._id === id) setSelectedContact(null);
      toast.success('Đã xóa lời nhắn');
    } catch (error) {
      toast.error('Lỗi khi xóa lời nhắn');
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = contacts.length;
    const unread = contacts.filter((c) => c.status === 'unread').length;
    const read = contacts.filter((c) => c.status === 'read').length;
    const replied = contacts.filter((c) => c.status === 'replied').length;
    return { total, unread, read, replied };
  }, [contacts]);

  // Filter & Search
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [contacts, statusFilter, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Chưa đọc
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Đã đọc
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã phản hồi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 flex items-center gap-2.5">
            <MessageSquare className="w-8 h-8 text-brand-600" />
            <span>Quản Lý Lời Nhắn Khách Hàng</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi, phản hồi và ghi chú yêu cầu hỗ trợ từ trang Contact</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng số lời nhắn', count: stats.total, color: 'from-slate-700 to-slate-900', textColor: 'text-white' },
          { label: 'Chưa đọc (Mới)', count: stats.unread, color: 'from-red-500 to-rose-600', textColor: 'text-white' },
          { label: 'Đang xử lý (Đã đọc)', count: stats.read, color: 'from-amber-500 to-orange-500', textColor: 'text-white' },
          { label: 'Đã hoàn tất phản hồi', count: stats.replied, color: 'from-emerald-600 to-teal-700', textColor: 'text-white' },
        ].map((item, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${item.color} ${item.textColor} p-5 rounded-2xl shadow-md`}>
            <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">{item.label}</p>
            <p className="text-3xl font-display font-extrabold mt-1">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unread', label: 'Chưa đọc' },
            { id: 'read', label: 'Đã đọc' },
            { id: 'replied', label: 'Đã phản hồi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email, chủ đề..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải lời nhắn...</span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <p className="font-semibold text-slate-600">Không tìm thấy lời nhắn nào</p>
            <p className="text-xs text-slate-400">Thử thay đổi từ khóa hoặc bộ lọc trạng thái</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Người Gửi</th>
                  <th className="py-3.5 px-4">Chủ Đề & Nội Dung</th>
                  <th className="py-3.5 px-4">Thời Gian</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    onClick={() => handleOpenDetail(contact)}
                    className={`hover:bg-brand-50/40 transition-colors cursor-pointer ${
                      contact.status === 'unread' ? 'bg-red-50/20 font-medium' : ''
                    }`}
                  >
                    <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(contact.status)}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{contact.name}</div>
                      <div className="text-xs text-slate-500">{contact.email}</div>
                      {contact.phone && <div className="text-xs text-slate-400">{contact.phone}</div>}
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-semibold text-slate-800 truncate">{contact.subject}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{contact.message}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {contact.status !== 'replied' && (
                          <button
                            onClick={(e) => handleQuickStatus(contact._id, 'replied', e)}
                            title="Đánh dấu đã phản hồi"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(contact)}
                          title="Xem chi tiết"
                          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(contact._id, e)}
                          title="Xóa lời nhắn"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(selectedContact.status)}
                    <span className="text-xs text-slate-400">
                      ID: #{selectedContact._id?.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl">{selectedContact.subject}</h3>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar-light">
                {/* Sender Info Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Người gửi:</p>
                      <p className="font-bold text-slate-800">{selectedContact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-violet-600 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Email:</p>
                      <a href={`mailto:${selectedContact.email}`} className="font-bold text-brand-600 hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 font-semibold">Số điện thoại:</p>
                        <a href={`tel:${selectedContact.phone}`} className="font-bold text-slate-800">
                          {selectedContact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Ngày gửi:</p>
                      <p className="font-bold text-slate-800">
                        {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nội Dung Chi Tiết</h4>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>

                {/* Email Reply Box */}
                <div className="bg-brand-50/60 rounded-2xl p-5 border border-brand-200/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-brand-600" />
                      <h4 className="font-display font-bold text-slate-800">
                        Gửi Email Phản Hồi Trực Tiếp Cho Khách
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-brand-200 transition-colors"
                    >
                      {showReplyForm ? 'Ẩn form trả lời' : 'Soạn Email Phản Hồi'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showReplyForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 overflow-hidden"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Người nhận: <span className="font-bold text-slate-800">{selectedContact.name} ({selectedContact.email})</span>
                          </label>
                          <input
                            type="text"
                            value={replySubject}
                            onChange={(e) => setReplySubject(e.target.value)}
                            placeholder="Tiêu đề email..."
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <textarea
                            rows={5}
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Nhập nội dung câu trả lời/giải quyết yêu cầu của khách hàng..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                          ></textarea>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleSendReply}
                            disabled={isSendingReply}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all"
                          >
                            {isSendingReply ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Đang Gửi Email...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Gửi Email Trả Lời Ngay</span>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status & Admin Notes Management */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Trạng Thái Xử Lý
                      </label>
                      <select
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="unread">🔴 Chưa đọc</option>
                        <option value="read">🟡 Đang xử lý (Đã đọc)</option>
                        <option value="replied">🟢 Đã hoàn tất phản hồi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Ghi Chú Xử Lý Nội Bộ (chỉ Admin thấy)
                    </label>
                    <textarea
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Ghi chú về việc đã gọi điện/phản hồi email cho khách hàng..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleSaveModal}
                    disabled={isUpdating}
                    className="bg-brand-600 text-white font-bold text-sm px-6 py-2 rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20 flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <span>Đang lưu...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Lưu Thay Đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminContacts;
