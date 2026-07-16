import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import axiosClient from '../utils/axiosClient';
import { Search, ShoppingCart, Package, LogOut, Menu, X, ChevronDown, Zap } from 'lucide-react';

function Header() {
  const { user, setUser, logout, cart, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Scroll detection for header style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user) setUser(null);
    if (user && !cart) {
      axiosClient.get('/api/cart').then(res => setCart(res.data.data)).catch(() => {});
    }
  }, [user, setUser, cart, setCart]);

  useEffect(() => {
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      setSearch(params.get('search') || '');
    } else {
      setSearch('');
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/shop?search=${encodeURIComponent(search.trim())}` : '/shop');
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100' 
        : 'bg-white/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between gap-4 h-16'>

          {/* Logo */}
          <Link to='/' className='shrink-0 flex items-center gap-2.5 group'>
            <div className='w-9 h-9 bg-gradient-to-br from-brand-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-brand-500/30 group-hover:scale-105 transition-all duration-200'>
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className='font-display font-bold text-xl text-gradient hidden sm:inline'>CD Store</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className='hidden md:flex w-full max-w-md relative'>
            <div className='relative w-full group'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search products...'
                className='w-full bg-slate-100/80 border border-transparent rounded-full pl-11 pr-14 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400'
              />
              <button
                type='submit'
                className='absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors flex items-center justify-center shadow-sm'
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Nav (Desktop) */}
          <nav className='hidden md:flex items-center gap-1 shrink-0'>
            <Link
              to='/'
              className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors'
            >
              Home
            </Link>
            <Link
              to='/shop'
              className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors'
            >
              Shop
            </Link>
            <Link
              to='/about'
              className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors'
            >
              About
            </Link>
            <Link
              to='/contact'
              className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors'
            >
              Contact
            </Link>

            {/* Cart */}
            <Link
              to='/cart'
              className='relative p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors'
              title='Cart'
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className='absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-bounce-short shadow-sm'>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Orders shortcut for logged in users */}
            {user && (
              <Link
                to='/orders'
                className='p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors'
                title='My Orders'
              >
                <Package className="w-5 h-5" />
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className='relative ml-1' ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className='flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-all'
                >
                  <div className='w-7 h-7 bg-gradient-to-br from-brand-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm'>
                    {avatarLetter}
                  </div>
                  <span className='text-sm font-medium text-slate-700 max-w-[80px] truncate hidden lg:block'>{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className='absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 py-2 animate-scale-in origin-top-right z-50'>
                    <div className='px-4 py-3 border-b border-slate-100'>
                      <p className='text-xs text-slate-400 font-medium'>Signed in as</p>
                      <p className='text-sm font-semibold text-slate-900 truncate'>{user.name}</p>
                      <p className='text-xs text-slate-400 truncate'>{user.email}</p>
                    </div>
                    <div className='p-2'>
                      <Link to='/profile' className='flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors' onClick={() => setUserDropdownOpen(false)}>
                        Profile Settings
                      </Link>
                      <Link to='/orders' className='flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors' onClick={() => setUserDropdownOpen(false)}>
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to='/admin' className='flex items-center gap-2 px-3 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 rounded-xl transition-colors' onClick={() => setUserDropdownOpen(false)}>
                          <Zap className='w-4 h-4' />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className='border-t border-slate-100 mt-2 pt-2'>
                        <button onClick={handleLogout} className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors'>
                          <LogOut className='w-4 h-4' />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/auth'
                className='ml-1 bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all active:scale-95'
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile: Cart + Menu */}
          <div className='md:hidden flex items-center gap-2'>
            <Link to='/cart' className='relative p-2 text-slate-600'>
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className='absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5'>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 animate-fade-in">
            <form onSubmit={handleSearch} className='flex relative mb-4'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search products...'
                className='w-full bg-slate-100 rounded-full pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
              />
              <button type='submit' className='absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center'>
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-col gap-1">
              <Link to='/' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors'>Home</Link>
              <Link to='/shop' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors'>Shop All</Link>
              <Link to='/about' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors'>About Us</Link>
              <Link to='/contact' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors'>Contact Us</Link>
              <Link to='/cart' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl flex items-center justify-between'>
                Cart
                {cartItemCount > 0 && <span className='bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full'>{cartItemCount}</span>}
              </Link>
              {user ? (
                <>
                  <Link to='/orders' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl'>My Orders</Link>
                  <Link to='/profile' className='px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl'>Profile</Link>
                  {user.role === 'admin' && (
                    <Link to='/admin' className='px-3 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-xl flex items-center gap-2'>
                      <Zap className='w-4 h-4' />Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className='px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl text-left'>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to='/auth' className='mt-1 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold text-center'>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
