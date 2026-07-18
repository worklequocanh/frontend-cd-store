import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import axiosClient from '../utils/axiosClient';
import { 
  Search, ShoppingCart, Package, LogOut, Menu, X, ChevronDown, Zap, 
  Grid, Headphones, Watch, Keyboard, Speaker, Smartphone, Sparkles, 
  TrendingUp, Phone, ShieldCheck, ChevronRight, CheckCircle2, Flame, Award
} from 'lucide-react';

function Header() {
  const { user, setUser, logout, cart, setCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const searchContainerRef = useRef(null);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Scroll detection for header style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts (Ctrl+K or / to search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        const inputEl = searchContainerRef.current?.querySelector('input');
        if (inputEl) {
          inputEl.focus();
          setSearchFocused(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user) setUser(null);
    if (user && !cart) {
      axiosClient.get('/api/cart').then(res => setCart(res.data.data)).catch(() => {});
    }
  }, [user, setUser, cart, setCart]);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/shop') {
      const params = new URLSearchParams(location.search);
      setSearch(params.get('search') || '');
    } else {
      setSearch('');
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoryDropdownOpen(false);
    setSearchFocused(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchFocused(false);
    navigate(search.trim() ? `/shop?search=${encodeURIComponent(search.trim())}` : '/shop');
  };

  const handleKeywordSelect = (keyword) => {
    setSearch(keyword);
    setSearchFocused(false);
    navigate(`/shop?search=${encodeURIComponent(keyword)}`);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';

  const categories = [
    { name: 'Tai Nghe & Âm Thanh', icon: Headphones, to: '/shop?category=audio', desc: 'Tai nghe Bluetooth, Over-ear' },
    { name: 'Loa Di Động & Bluetooth', icon: Speaker, to: '/shop?category=audio', desc: 'Âm thanh vòm, Loa Marshall' },
    { name: 'Thiết Bị Đeo & Smartwatch', icon: Watch, to: '/shop?category=wearable', desc: 'Đồng hồ thông minh cao cấp' },
    { name: 'Bàn Phím & Chuột Gaming', icon: Keyboard, to: '/shop?category=gaming', desc: 'Bàn phím cơ, Chuột không dây' },
    { name: 'Phụ Kiện Điện Tử', icon: Smartphone, to: '/shop?category=accessories', desc: 'Sạc nhanh, Cáp chuyển đổi' },
    { name: 'Tất Cả Sản Phẩm', icon: Grid, to: '/shop', desc: 'Khám phá trọn bộ gian hàng' },
  ];

  const trendingKeywords = [
    'Tai nghe Bluetooth', 'Loa Marshall', 'Đồng hồ thông minh', 'Bàn phím cơ', 'Sạc dự phòng', 'Sony WH-1000XM5'
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* 1. Top Announcement Bar */}
      {!announcementClosed && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-indigo-900/50 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none"></div>
          <div className="container mx-auto flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 font-bold uppercase tracking-wider text-[10px] shrink-0 animate-pulse">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Ưu Đãi VIP
              </span>
              <p className="truncate text-slate-200 font-medium">
                Nhập mã <strong className="text-brand-300 font-bold underline">VIP100</strong> giảm ngay <strong className="text-emerald-400">100.000₫</strong> cho đơn hàng từ 1 Triệu • Miễn phí vận chuyển hỏa tốc 2H
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link to="/shop?sort=price" className="hidden sm:inline-flex items-center gap-1 text-brand-300 hover:text-white font-semibold transition-colors">
                <span>Khám phá ngay</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
              <button 
                onClick={() => setAnnouncementClosed(true)} 
                aria-label="Đóng thông báo"
                className="text-slate-400 hover:text-white transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header Bar */}
      <header className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100' 
          : 'bg-white/85 backdrop-blur-md border-b border-slate-100/60'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 lg:gap-6 h-16 md:h-18">

            {/* Logo & Category Button Container */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/40 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-900 hidden sm:block leading-none">
                    CD Store
                  </span>
                  <span className="hidden sm:block text-[9px] uppercase tracking-widest font-bold text-brand-600 mt-0.5">
                    Tech & Audio
                  </span>
                </div>
              </Link>

              {/* Mega Menu Categories Dropdown Toggle (Desktop) */}
              <div className="relative hidden lg:block ml-2" ref={categoryRef}>
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    categoryDropdownOpen 
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' 
                      : 'bg-slate-100/80 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-transparent hover:border-brand-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Danh Mục</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Mega Dropdown */}
                {categoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-3 w-[440px] bg-white rounded-3xl shadow-2xl shadow-slate-900/15 border border-slate-100 p-6 animate-scale-in origin-top-left z-50">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Khám phá danh mục nổi bật
                      </span>
                      <Link 
                        to="/shop" 
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <span>Xem tất cả</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat, idx) => {
                        const IconComponent = cat.icon;
                        return (
                          <Link
                            key={idx}
                            to={cat.to}
                            onClick={() => setCategoryDropdownOpen(false)}
                            className="flex items-start gap-3 p-3 rounded-2xl hover:bg-brand-50/70 border border-transparent hover:border-brand-100 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-600 flex items-center justify-center shrink-0 text-slate-600 group-hover:text-white transition-colors shadow-sm">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-snug">
                                {cat.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Quick Promotional Footer inside Mega Menu */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>100% Chính Hãng • Bảo hành 1 đổi 1 trong 30 ngày</span>
                      </div>
                      <Link 
                        to="/shop?sort=-createdAt" 
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-xs font-bold text-brand-600 hover:underline shrink-0"
                      >
                        Hàng Mới Về ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Smart Search Bar (Desktop & Tablet) */}
            <div className="hidden md:block flex-1 max-w-lg transition-all duration-300 relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  searchFocused ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-500'
                }`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder={searchFocused ? "Gõ tên sản phẩm cần tìm..." : "Tìm kiếm sản phẩm, tai nghe, loa..."}
                  className={`w-full bg-slate-100/90 border rounded-full pl-11 py-2.5 text-sm focus:outline-none transition-all placeholder:text-slate-400 ${
                    !searchFocused && !search ? 'pr-28' : 'pr-20'
                  } ${
                    searchFocused 
                      ? 'bg-white border-brand-400 ring-4 ring-brand-500/15 shadow-md text-slate-900' 
                      : 'border-transparent hover:border-slate-200 text-slate-700'
                  }`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {search && (
                    <button
                      type="button"
                      onClick={() => { setSearch(''); searchContainerRef.current?.querySelector('input')?.focus(); }}
                      className="w-6 h-6 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!searchFocused && !search && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const inputEl = searchContainerRef.current?.querySelector('input');
                        if (inputEl) {
                          inputEl.focus();
                          setSearchFocused(true);
                        }
                      }}
                      className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-200/80 hover:bg-brand-100 hover:text-brand-600 hover:border-brand-300 text-slate-500 rounded border border-slate-300/50 shadow-2xs transition-all cursor-pointer"
                      title="Bấm hoặc nhấn phím Ctrl + K để tìm kiếm"
                    >
                      Ctrl K
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-8 h-8 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Trending Keywords Popover */}
              {searchFocused && (
                <div className="absolute left-0 right-0 top-full mt-2.5 bg-white rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-100 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-500" /> Từ khóa tìm kiếm phổ biến
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingKeywords.map((kw, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleKeywordSelect(kw)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-slate-200/80 hover:border-brand-200 text-xs font-medium transition-all flex items-center gap-1.5"
                      >
                        <Search className="w-3 h-3 text-slate-400" />
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              <Link
                to="/"
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  location.pathname === '/' 
                    ? 'text-brand-600 bg-brand-50/80' 
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-100/70'
                }`}
              >
                Trang Chủ
              </Link>
              <Link
                to="/shop"
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  location.pathname === '/shop' 
                    ? 'text-brand-600 bg-brand-50/80' 
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-100/70'
                }`}
              >
                Cửa Hàng
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  location.pathname === '/about' 
                    ? 'text-brand-600 bg-brand-50/80' 
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-100/70'
                }`}
              >
                Giới Thiệu
              </Link>
              <Link
                to="/contact"
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  location.pathname === '/contact' 
                    ? 'text-brand-600 bg-brand-50/80' 
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-100/70'
                }`}
              >
                Liên Hệ
              </Link>
            </nav>

            {/* Hotline Badge (Extra Large Desktop) */}
            <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-slate-200/80 shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                <Phone className="w-4 h-4 animate-bounce-short" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-400 leading-none">Hỗ trợ 24/7</span>
                <span className="text-xs font-extrabold text-slate-800 tracking-wide">1900.888.999</span>
              </div>
            </div>

            {/* 5. User & Cart Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Cart Icon Button */}
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-700 hover:text-brand-600 bg-slate-100/80 hover:bg-brand-50 rounded-2xl transition-all border border-transparent hover:border-brand-200 flex items-center justify-center shadow-sm"
                title="Giỏ Hàng Của Bạn"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-extrabold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 animate-bounce-short shadow-md border-2 border-white">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Orders shortcut for logged in users */}
              {user && (
                <Link
                  to="/orders"
                  className="hidden sm:flex p-2.5 text-slate-700 hover:text-brand-600 bg-slate-100/80 hover:bg-brand-50 rounded-2xl transition-all border border-transparent hover:border-brand-200 items-center justify-center shadow-sm"
                  title="Đơn Hàng Của Tôi"
                >
                  <Package className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown / Login Button */}
              {user ? (
                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-2xl bg-slate-100/80 hover:bg-brand-50 border border-transparent hover:border-brand-200 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                      {avatarLetter}
                    </div>
                    <div className="text-left hidden lg:block">
                      <span className="block text-xs font-bold text-slate-800 max-w-[100px] truncate leading-tight">{user.name}</span>
                      <span className="block text-[10px] font-semibold text-brand-600">
                        {user.role === 'admin' ? 'Quản Trị Viên' : 'Thành Viên VIP'}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-brand-600' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-3xl shadow-2xl shadow-slate-900/15 border border-slate-100 py-3 animate-scale-in origin-top-right z-50">
                      <div className="px-5 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            <Award className="w-3 h-3" /> {user.role === 'admin' ? 'Quản Trị Viên' : 'Tài Khoản VIP'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition-colors"
                        >
                          <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">👤</span>
                          <span>Hồ Sơ & Bảo Mật</span>
                        </Link>
                        <Link 
                          to="/orders" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-2xl transition-colors"
                        >
                          <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">📦</span>
                          <span>Đơn Hàng Của Tôi</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-brand-600 bg-brand-50/60 hover:bg-brand-100/80 rounded-2xl transition-colors"
                          >
                            <span className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                              <Zap className="w-4 h-4" />
                            </span>
                            <span>Vào Trang Quản Trị</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                        <button 
                          onClick={handleLogout} 
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors text-left"
                        >
                          <span className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <LogOut className="w-4 h-4" />
                          </span>
                          <span>Đăng Xuất Tài Khoản</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="ml-1 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all active:scale-95 shrink-0"
                >
                  Đăng Nhập
                </Link>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                aria-label="Mở Menu Di Động"
                className="md:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-200/80"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 6. Mobile Slide-Out Drawer Overlay & Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Slide Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-slide-left">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <Package className="w-5 h-5" />
                </div>
                <span className="font-display font-extrabold text-xl text-slate-900">CD Store</span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto">
              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full bg-slate-100 rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-600 text-white rounded-xl flex items-center justify-center">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Điều Hướng</p>
                <div className="space-y-1">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <span>Trang Chủ</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <span>Cửa Hàng</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <span>Giới Thiệu</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <span>Liên Hệ</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    <span>Giỏ Hàng Của Bạn</span>
                    {cartItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartItemCount}</span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Mobile Categories Accordion */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Danh Mục Nổi Bật</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {categories.map((cat, idx) => {
                    const IconComponent = cat.icon;
                    return (
                      <Link
                        key={idx}
                        to={cat.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile User Actions */}
              {user ? (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Tài Khoản</p>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-slate-100">
                    <span>👤 Hồ Sơ & Bảo Mật</span>
                  </Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-slate-100">
                    <span>📦 Đơn Hàng Của Tôi</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-3 rounded-2xl text-sm font-bold text-brand-600 bg-brand-50">
                      <Zap className="w-4 h-4" />
                      <span>Vào Trang Quản Trị</span>
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-3.5 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-center py-3.5 rounded-2xl font-bold shadow-lg shadow-brand-500/25"
                  >
                    Đăng Nhập Tài Khoản
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer Hotline */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Hotline hỗ trợ 24/7</span>
                  <p className="text-sm font-extrabold text-slate-900">1900.888.999</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

