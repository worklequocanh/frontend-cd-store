import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { useStore } from '../../store/store';
import toast from 'react-hot-toast';
import { ShoppingCart, Users, PackageSearch, DollarSign, Clock, ArrowRight, TrendingUp, Activity, Package, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const { user } = useStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user || user.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      try {
        const [dashRes, revRes] = await Promise.all([
          axiosClient.get('/api/admin/dashboard'),
          axiosClient.get('/api/admin/analytics/revenue')
        ]);
        
        setDashboard(dashRes.data.data);
        
        // Format revenue data for chart
        const formattedData = [...revRes.data.data].reverse().map(item => ({
          date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: item.total
        }));
        setRevenueData(formattedData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        if (error.response) {
          console.error("Error data:", error.response.data);
        }
        toast.error('Failed to load dashboard data');
      }
    };

    fetchDashboard();
  }, [user]);

  if (!dashboard) return (
    <div className='flex items-center justify-center h-full min-h-[400px]'>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-4 border-brand-500 animate-spin opacity-80"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-violet-500 animate-spin opacity-60 animation-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-b-4 border-emerald-500 animate-spin opacity-40 animation-delay-300"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse tracking-wide">Fetching data...</p>
      </div>
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `$${Number(dashboard.totalRevenue || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: <DollarSign className="w-7 h-7" />, color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20' },
    { title: 'Total Orders', value: dashboard.totalOrders || 0, icon: <ShoppingCart className="w-7 h-7" />, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
    { title: 'Total Users', value: dashboard.totalUsers || 0, icon: <Users className="w-7 h-7" />, color: 'from-violet-500 to-purple-400', shadow: 'shadow-violet-500/20' },
    { title: 'Total Products', value: dashboard.totalProducts || 0, icon: <PackageSearch className="w-7 h-7" />, color: 'from-brand-500 to-indigo-400', shadow: 'shadow-brand-500/20' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className='space-y-8 pb-10 max-w-[1400px] mx-auto'
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-800 tracking-tight'>Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Monitor your store's performance and recent activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-slate-200/60 shadow-sm text-sm font-medium text-slate-600 glass">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live System Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((stat, idx) => (
          <motion.div 
            variants={itemVariants}
            key={idx} 
            className={`relative overflow-hidden rounded-3xl p-6 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default`}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className='text-sm font-semibold text-slate-500 mb-1'>{stat.title}</p>
                <p className='text-3xl font-display font-bold text-slate-800 tracking-tight'>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow}`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> 
              <span className="text-emerald-500">Updated</span> just now
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className='bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm relative overflow-hidden'>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="mb-8 flex items-center justify-between relative z-10">
          <div>
            <h2 className='text-xl font-display font-bold text-slate-800 flex items-center gap-2'>
              <Activity className="w-5 h-5 text-brand-500" /> Revenue Analytics
            </h2>
            <p className="text-sm text-slate-500 mt-1">Daily revenue progression over the last 30 days</p>
          </div>
          <select className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
        
        <div className="h-[380px] w-full relative z-10">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value}`}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#0f172a', fontWeight: '800', fontSize: '16px' }}
                  labelStyle={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}
                  formatter={(value) => [`$${value.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 4, stroke: '#ffffff', fill: '#4f46e5', style: { filter: 'drop-shadow(0px 4px 6px rgba(79, 70, 229, 0.4))' } }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Activity className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Not enough data to generate chart.</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Pending Orders Action Card */}
        <motion.div variants={itemVariants} className='xl:col-span-1'>
          <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-900/10 flex flex-col items-center text-center relative overflow-hidden h-full justify-center min-h-[300px]'>
            {/* Glowing orbs */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/30 rounded-full blur-[64px]"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/30 rounded-full blur-[64px]"></div>
            
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h2 className='text-2xl font-display font-bold text-white mb-2 relative z-10'>Action Required</h2>
            <div className="flex items-end justify-center gap-2 mb-4 relative z-10">
              <p className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400'>{dashboard.pendingOrders || 0}</p>
              <span className="text-slate-400 font-medium pb-2">orders</span>
            </div>
            <p className="text-slate-400 mb-8 font-medium relative z-10 max-w-[250px]">Waiting for confirmation and processing.</p>
            <Link to='/admin/orders?status=pending' className='w-full bg-white text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-100 hover:shadow-lg transition-all flex items-center justify-center gap-2 relative z-10 group'>
              Process Orders <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Recent Orders List */}
        <motion.div variants={itemVariants} className='bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm xl:col-span-2 flex flex-col h-full'>
          <div className="flex items-center justify-between mb-6">
            <h2 className='text-xl font-display font-bold text-slate-800 flex items-center gap-2'>
              <Package className="w-5 h-5 text-brand-500" /> Recent Activity
            </h2>
            <Link to='/admin/orders' className="text-sm font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1">
            {dashboard.recentOrders && dashboard.recentOrders.length > 0 ? (
              <div className='space-y-4'>
                {dashboard.recentOrders.slice(0, 5).map((order) => (
                  <Link to={`/admin/orders/${order._id}`} key={order._id} className='flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group gap-4 cursor-pointer'>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400 border border-slate-100 shadow-sm group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-100 transition-colors shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <span className='font-bold text-slate-800 block text-sm'>#{order.orderNumber}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-500 font-medium truncate max-w-[120px] sm:max-w-[200px]">
                            {order.userId?.name || 'Guest User'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1 pl-16 sm:pl-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                        ${order.orderStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          order.orderStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'}`}
                      >
                        {order.orderStatus}
                      </span>
                      <span className='font-bold text-lg text-slate-800'>${Number(order.total || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8">
                <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No recent orders found.</p>
                <p className="text-slate-400 text-sm mt-1">When customers place orders, they will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
