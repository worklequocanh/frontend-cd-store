import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import axiosClient from '../utils/axiosClient';
import { Search, ShoppingCart, User, Package, Settings, LogOut, Menu, X } from 'lucide-react';

function Header() {
  const { user, setUser, logout, cart, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate total items in cart
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user) {
      setUser(null);
    }
    
    if (user && !cart) {
      axiosClient.get('/api/cart').then(res => {
        setCart(res.data.data);
      }).catch(err => console.error(err));
    }
  }, [user, setUser, cart, setCart]);

  // Sync search input with URL if on homepage
  useEffect(() => {
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      setSearch(params.get('search') || '');
    } else {
      setSearch('');
    }
    setMobileMenuOpen(false); // Close menu on navigation
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className='sticky top-0 z-50 glass'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between gap-4'>
          {/* Logo */}
          <Link to='/' className='text-2xl font-bold text-gradient shrink-0 flex items-center gap-2 hover:scale-105 transition-transform'>
            <Package className="w-8 h-8 text-brand-600" />
            <span className="hidden sm:inline">CD Store</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className='hidden md:flex w-full max-w-lg relative group'>
            <input 
              type='text' 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search for premium products...' 
              className='w-full bg-slate-100/50 border border-slate-200 rounded-full pl-5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-inner'
            />
            <button type='submit' className='absolute right-1 top-1 bottom-1 px-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors flex items-center justify-center'>
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation (Desktop) */}
          <nav className='hidden md:flex items-center gap-6 shrink-0'>
            <Link to='/' className='font-medium text-slate-600 hover:text-brand-600 transition-colors'>
              Shop
            </Link>
            
            <Link to='/cart' className='font-medium text-slate-600 hover:text-brand-600 transition-colors relative group flex items-center gap-1'>
              <div className="relative p-2 rounded-full group-hover:bg-brand-50 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className='absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce-short shadow-sm'>
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {user ? (
              <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                <Link to='/orders' className='p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors' title="Orders">
                  <Package className="w-5 h-5" />
                </Link>
                <Link to='/profile' className='p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors flex items-center gap-2' title="Profile">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to='/admin' className='p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors' title="Admin Dashboard">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
                <button onClick={handleLogout} className='p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors' title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to='/auth' className='bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95'>
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-4 pb-2 animate-fade-in">
            <form onSubmit={handleSearch} className='flex w-full relative'>
              <input 
                type='text' 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search products...' 
                className='w-full bg-slate-100 border border-slate-200 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500'
              />
              <button type='submit' className='absolute right-1 top-1 bottom-1 px-3 text-brand-600 flex items-center justify-center'>
                <Search className="w-5 h-5" />
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link to='/' className='px-4 py-2 hover:bg-slate-100 rounded-lg font-medium'>Shop</Link>
              <Link to='/cart' className='px-4 py-2 hover:bg-slate-100 rounded-lg font-medium flex items-center justify-between'>
                Cart
                {cartItemCount > 0 && (
                  <span className='bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full'>{cartItemCount} items</span>
                )}
              </Link>
              
              {user ? (
                <>
                  <Link to='/orders' className='px-4 py-2 hover:bg-slate-100 rounded-lg font-medium'>My Orders</Link>
                  <Link to='/profile' className='px-4 py-2 hover:bg-slate-100 rounded-lg font-medium'>Profile ({user.name})</Link>
                  {user.role === 'admin' && (
                    <Link to='/admin' className='px-4 py-2 hover:bg-slate-100 rounded-lg font-medium text-brand-600'>Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className='px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium'>Logout</button>
                </>
              ) : (
                <Link to='/auth' className='mt-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium text-center'>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
