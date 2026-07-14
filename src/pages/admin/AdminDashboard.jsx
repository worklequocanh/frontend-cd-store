import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../../store/store';
import toast from 'react-hot-toast';
import { ShoppingCart, Users, PackageSearch, DollarSign, Clock, ArrowRight, TrendingUp } from 'lucide-react';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const { user } = useStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user || user.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard');
      }
    };

    fetchDashboard();
  }, [user]);

  if (!dashboard) return (
    <div className='flex items-center justify-center h-full'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `$${dashboard.totalRevenue?.toFixed(2) || '0.00'}`, icon: <DollarSign className="w-8 h-8" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', iconBg: 'bg-emerald-100' },
    { title: 'Total Orders', value: dashboard.totalOrders || 0, icon: <ShoppingCart className="w-8 h-8" />, color: 'bg-blue-50 text-blue-600 border-blue-100', iconBg: 'bg-blue-100' },
    { title: 'Total Users', value: dashboard.totalUsers || 0, icon: <Users className="w-8 h-8" />, color: 'bg-purple-50 text-purple-600 border-purple-100', iconBg: 'bg-purple-100' },
    { title: 'Total Products', value: dashboard.totalProducts || 0, icon: <PackageSearch className="w-8 h-8" />, color: 'bg-brand-50 text-brand-600 border-brand-100', iconBg: 'bg-brand-100' },
  ];

  return (
    <div className='space-y-8 pb-10'>
      <div>
        <h1 className='text-3xl font-display font-bold text-slate-900'>Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome to the CD Store admin control panel.</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((stat, idx) => (
          <div key={idx} className={`rounded-3xl p-6 border shadow-sm flex items-center justify-between ${stat.color} transition-transform hover:-translate-y-1`}>
            <div>
              <p className='text-sm font-semibold opacity-80 mb-1'>{stat.title}</p>
              <p className='text-3xl font-display font-bold'>{stat.value}</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Pending Orders Card */}
        <div className='bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center'>
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className='text-xl font-display font-bold text-slate-900 mb-2'>Pending Orders</h2>
          <p className='text-5xl font-bold text-amber-500 mb-4'>{dashboard.pendingOrders || 0}</p>
          <p className="text-slate-500 mb-8">Orders awaiting processing or payment confirmation.</p>
          <Link to='/admin/orders' className='w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2'>
            View Pending <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Orders List */}
        <div className='bg-white rounded-3xl p-8 border border-slate-100 shadow-sm lg:col-span-2'>
          <div className="flex items-center justify-between mb-8">
            <h2 className='text-xl font-display font-bold text-slate-900 flex items-center gap-2'>
              <TrendingUp className="w-5 h-5 text-brand-600" /> Recent Orders
            </h2>
            <Link to='/admin/orders' className="text-sm font-semibold text-brand-600 hover:text-brand-700">View All</Link>
          </div>
          
          {dashboard.recentOrders && dashboard.recentOrders.length > 0 ? (
            <div className='space-y-4'>
              {dashboard.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className='flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors'>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-400">
                      #
                    </div>
                    <div>
                      <span className='font-bold text-slate-900 block'>{order.orderNumber}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase mt-1 inline-block">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className='font-bold text-lg text-brand-600 block'>${order.total?.toFixed(2)}</span>
                    <span className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">No recent orders found.</p>
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-wrap gap-4 pt-4'>
        <Link to='/admin/products' className='bg-brand-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2'>
          <PackageSearch className="w-5 h-5" /> Manage Products
        </Link>
        <Link to='/admin/orders' className='bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2'>
          <ShoppingCart className="w-5 h-5" /> Manage Orders
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
