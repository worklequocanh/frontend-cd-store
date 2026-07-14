import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../store/store';
import { LayoutDashboard, PackageSearch, ShoppingCart, Users, LogOut, Package, Menu, X, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminLayout() {
  const { user } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <PackageSearch className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Ticket className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  const NavLinks = ({ onClick }) => (
    <>
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={`relative flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-300 group overflow-hidden ${
              active 
                ? 'text-white shadow-md shadow-brand-500/20' 
                : 'text-slate-500 hover:bg-white hover:text-brand-600 hover:shadow-sm'
            }`}
          >
            {active && (
              <motion.div 
                layoutId="active-nav-bg"
                className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className={`relative z-10 flex items-center justify-center ${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-500 transition-colors'}`}>
              {item.icon}
            </div>
            {!sidebarCollapsed && (
              <span className={`relative z-10 font-medium whitespace-nowrap transition-opacity duration-300 ${active ? 'text-white' : ''}`}>
                {item.name}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: sidebarCollapsed ? 88 : 280 }}
        className="hidden md:flex flex-col bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20 flex-shrink-0"
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between">
          <Link to='/' className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${sidebarCollapsed ? 'mx-auto' : ''}`}>
            <div className="bg-brand-50 p-2 rounded-xl text-brand-600">
              <Package className="w-7 h-7" />
            </div>
            {!sidebarCollapsed && <span className="font-display font-bold text-xl text-slate-800 tracking-tight">CD Admin</span>}
          </Link>
        </div>
        
        <div className={`p-6 border-b border-slate-100 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-violet-500 rounded-full flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                <p className="text-xs font-medium text-slate-400">Welcome back,</p>
                <p className="font-bold text-slate-800 truncate w-36">{user?.name}</p>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar-light">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3.5 top-24 bg-white border border-slate-200 text-slate-400 p-1.5 rounded-full hover:text-brand-600 hover:border-brand-300 shadow-sm transition-colors z-30"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 z-30 shadow-sm">
          <div className='flex items-center gap-2'>
            <div className="bg-brand-50 p-1.5 rounded-lg text-brand-600">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-slate-800">Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute inset-x-0 top-16 bg-white border-b border-slate-200 z-30 shadow-xl flex flex-col"
            >
              <nav className="p-4 space-y-1">
                <NavLinks onClick={() => setMobileMenuOpen(false)} />
              </nav>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area with Page Transitions */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10 custom-scrollbar-light">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
