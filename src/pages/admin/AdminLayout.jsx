import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../store/store';
import { LayoutDashboard, PackageSearch, ShoppingCart, Users, LogOut, Package, Menu, X } from 'lucide-react';

function AdminLayout() {
  const { user } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <PackageSearch className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  ];

  const NavLinks = ({ onClick }) => (
    <>
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              active 
                ? 'bg-brand-600 text-white font-medium shadow-md shadow-brand-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-400 transition-colors'}`}>
              {item.icon}
            </div>
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden md:flex relative z-20 shadow-xl">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link to='/' className='flex items-center gap-2 hover:scale-105 transition-transform'>
            <Package className="w-8 h-8 text-brand-500" />
            <span className="font-display font-bold text-xl tracking-wide">CD Admin</span>
          </Link>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Welcome back,</p>
              <p className="font-bold text-white truncate w-36">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar-dark">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors group">
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-30 shadow-md">
          <div className='flex items-center gap-2'>
            <Package className="w-6 h-6 text-brand-500" />
            <span className="font-display font-bold">Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-white transition-colors">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-16 bg-slate-900 border-t border-slate-800 z-30 shadow-2xl animate-fade-in flex flex-col">
            <nav className="p-4 space-y-2">
              <NavLinks onClick={() => setMobileMenuOpen(false)} />
            </nav>
            <div className="p-4 border-t border-slate-800">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors group">
                <LogOut className="w-5 h-5 group-hover:text-red-400" />
                <span>Exit Admin</span>
              </Link>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
