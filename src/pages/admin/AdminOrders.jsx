import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { useStore } from '../../store/store';
import toast from 'react-hot-toast';
import { ShoppingCart, Eye, Package, Truck, CheckCircle2, Clock, XCircle, Filter, Download } from 'lucide-react';
import Pagination from '../../components/Pagination';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useStore();

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Yêu cầu quyền Quản trị viên');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get(`/api/admin/orders?limit=10&page=${page}${filter ? `&status=${filter}` : ''}`);
        setOrders(res.data.data.orders);
        setTotalPages(res.data.data.pages);
      } catch (error) {
        toast.error('Tải danh sách đơn hàng thất bại');
      }
    };

    fetchOrders();
  }, [user, filter, page]);

  const handleExport = async (format = 'xlsx') => {
    try {
      const toastId = toast.loading(`Đang xuất file ${format.toUpperCase()}...`);
      const response = await axiosClient.get(`/api/admin/export/orders?format=${format}&status=${filter || 'all'}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DonHang_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success(`Xuất file ${format.toUpperCase()} thành công!`);
    } catch (error) {
      toast.error(`Lỗi xuất file ${format.toUpperCase()}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.patch(
        `/api/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      toast.success('Đã cập nhật trạng thái đơn hàng!');

      setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
    } catch (error) {
      toast.error('Cập nhật trạng thái đơn hàng thất bại');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'confirmed': return <Package className="w-3.5 h-3.5" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const filters = [
    { id: '', label: 'Tất Cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'confirmed', label: 'Đã xác nhận' },
    { id: 'shipped', label: 'Đang giao' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className='pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Quản Lý Đơn Hàng</h1>
          <p className="text-slate-500 mt-1">Quản lý, theo dõi và cập nhật trạng thái đơn hàng.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('xlsx')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Xuất Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Xuất CSV (.csv)
          </button>
        </div>
      </div>

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8'>
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Filter className="w-5 h-5 text-slate-400" />
            <span>Lọc trạng thái:</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === f.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-white border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Mã Đơn</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Khách Hàng</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Tổng Tiền</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Thanh Toán</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Trạng Thái</th>
                <th className='px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider'>Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id} className='hover:bg-slate-50 transition-colors group'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className="font-medium text-slate-900">{order.userId?.name || 'Khách vãng lai'}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className="font-bold text-brand-600">${order.total?.toFixed(2)}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 uppercase">{order.paymentMethod === 'qr' ? 'Chuyển khoản (SePay)' : 'Tiền mặt (COD)'}</span>
                      <span className={`text-xs font-bold mt-0.5 ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                        {order.paymentStatus === 'completed' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center gap-2">
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)} 
                        className={`text-sm font-semibold rounded-full px-3 py-1.5 border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <Link 
                      to={`/admin/orders/${order._id}`} 
                      className='inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm'
                    >
                      <Eye className="w-4 h-4" /> Chi Tiết
                    </Link>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-900">Không tìm thấy đơn hàng nào</p>
                      <p>Không có đơn hàng nào khớp với bộ lọc hiện tại.</p>
                    </div>
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

export default AdminOrders;
