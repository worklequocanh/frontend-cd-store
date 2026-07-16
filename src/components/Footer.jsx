import React, { useState } from 'react';
import { Package, Mail, Globe, MessageCircle, Send, Truck, ShieldCheck, RefreshCw, Headphones, MapPin, Phone, ChevronRight, Sparkles, CheckCircle2, Heart, ExternalLink, Zap, CreditCard, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
      toast.success('🎉 Đăng ký nhận VIP Voucher 100K thành công!');
    }, 800);
  };

  const trustBadges = [
    {
      icon: <Truck className="w-6 h-6 text-brand-400 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Giao Hàng Siêu Tốc',
      desc: 'Miễn phí đơn từ 500k • Giao nội thành 2h',
      color: 'from-brand-500/20 to-indigo-500/10 border-brand-500/30'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Bảo Mật Tuyệt Đối',
      desc: 'Mã hóa SSL 256-bit • Thanh toán SePay an toàn',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30'
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-amber-400 group-hover:scale-110 group-hover:rotate-180 transition-transform duration-500" />,
      title: 'Đổi Trả Dễ Dàng',
      desc: '1 đổi 1 trong 30 ngày không cần lý do',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30'
    },
    {
      icon: <Headphones className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Hỗ Trợ Tận Tâm 24/7',
      desc: 'Chuyên gia kỹ thuật luôn đồng hành giải đáp',
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Globe, href: '#', bgHover: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' },
    { name: 'Discord', icon: MessageCircle, href: '#', bgHover: 'hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2]' },
    { name: 'Email', icon: Send, href: '#', bgHover: 'hover:bg-brand-600 hover:text-white hover:border-brand-600' }
  ];

  const quickLinks = [
    { label: 'Tất Cả Sản Phẩm', to: '/shop' },
    { label: 'Hàng Mới Về (New Arrivals)', to: '/shop?sort=-createdAt' },
    { label: 'Siêu Giảm Giá (Best Deals)', to: '/shop?sort=price' },
    { label: 'Kiểm Tra Đơn Hàng', to: '/orders' },
    { label: 'Giỏ Hàng Của Bạn', to: '/cart' }
  ];

  const aboutLinks = [
    { label: 'Về CD Store & Đội Ngũ', to: '/about' },
    { label: 'Chính Sách Bảo Hành 5 Sao', to: '/about' },
    { label: 'Hướng Dẫn Mua Hàng', to: '/about' },
    { label: 'Cam Kết Chất Lượng', to: '/about' },
    { label: 'Đồ Án Chuyên Đề Backend', to: '/about' }
  ];

  const supportLinks = [
    { label: 'Trung Tâm Hỗ Trợ 24/7', to: '/contact' },
    { label: 'Gửi Lời Nhắn & Khiếu Nại', to: '/contact' },
    { label: 'Câu Hỏi Thường Gặp (FAQ)', to: '/contact' },
    { label: 'Thanh Toán Ngân Hàng SePay', to: '/contact' },
    { label: 'Bảo Mật Thông Tin Cá Nhân', to: '/contact' }
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden pt-12 border-t border-slate-800/80">
      {/* Background glowing gradient orbs for futuristic aesthetics */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Heroic Floating Newsletter Box */}
        <div className="mb-16">
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950 p-8 md:p-10 border border-slate-800 shadow-2xl shadow-black/50 overflow-hidden group">
            {/* Decorative background rays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> ĐẶC QUYỀN THÀNH VIÊN VIP
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                  Đăng ký nhận thông tin & Voucher <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">giảm ngay 100K</span>
                </h2>
                <p className="text-slate-300 text-sm md:text-base max-w-xl">
                  Nhận sớm nhất thông báo về các đợt mở bán siêu phẩm công nghệ, mã giảm giá độc quyền và bí kíp tối ưu thiết bị số từ chuyên gia CD Store.
                </p>
              </div>

              <div className="lg:col-span-5">
                {subscribed ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center animate-fade-in">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                    <h3 className="text-lg font-bold text-white">Đăng ký thành công!</h3>
                    <p className="text-xs text-emerald-300 mt-1">Kiểm tra hộp thư email của bạn để nhận mã Voucher 100K ngay nhé.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập địa chỉ email của bạn..."
                          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
                      >
                        {loading ? (
                          <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                        ) : (
                          <>
                            <span>Đăng Ký</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pl-1">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Miễn phí 100%</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hủy đăng ký bất kỳ lúc nào</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bảo mật thông tin</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Stripe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-16 border-b border-slate-800/80">
          {trustBadges.map((badge, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-2xl bg-gradient-to-br ${badge.color} border bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 group flex items-start gap-4 shadow-sm`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-md">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-brand-300 transition-colors">{badge.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Navigation & Brand Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-slate-800/80">
          
          {/* Brand Col (Span 4) */}
          <div className="lg:col-span-4 space-y-6 pr-0 lg:pr-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white tracking-tight">CD Store</span>
                <span className="block text-[10px] uppercase font-semibold text-brand-400 tracking-widest -mt-1">Premium Tech & Audio</span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Hệ thống bán lẻ thiết bị công nghệ & âm thanh cao cấp thuộc môn học <strong className="text-slate-200 font-semibold">Chuyên Đề Backend</strong>. Chúng tôi cam kết mang lại sản phẩm chính hãng 100%, trải nghiệm thanh toán tự động vượt trội cùng dịch vụ chăm sóc tận tâm.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Khoa CNTT - Đại học, TP. Hồ Chí Minh, Việt Nam</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline hỗ trợ: <strong className="text-white">0909.888.999</strong> (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Email liên hệ: <strong className="text-white">anhlq1208@gmail.com</strong></span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kết nối với chúng tôi</p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-200 ${s.bgHover} hover:-translate-y-1 hover:shadow-lg`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links Col (Span 2) */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-brand-500 rounded-full inline-block"></span> Khám Phá & Mua Sắm
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center text-slate-400 hover:text-brand-400 transition-colors py-0.5"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-brand-400 transition-all duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Legal Col (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-violet-500 rounded-full inline-block"></span> Về Chúng Tôi
            </h3>
            <ul className="space-y-3 text-sm">
              {aboutLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center text-slate-400 hover:text-violet-400 transition-colors py-0.5"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-violet-400 transition-all duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Col (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-white text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block"></span> Hỗ Trợ 24/7
            </h3>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center text-slate-400 hover:text-emerald-400 transition-colors py-0.5"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-emerald-400 transition-all duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright, Status & Payment Methods */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center md:text-left">
            <p>© {new Date().getFullYear()} <strong className="text-slate-300 font-semibold">CD Store</strong> — Đồ án Chuyên Đề Backend.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p className="flex items-center gap-1">
              Phát triển với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse" /> bởi <strong className="text-slate-300">Lê Quốc Anh</strong>
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300">Hệ thống ổn định</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px] text-brand-400">v2.4.0-PRO</span>
          </div>

          {/* Payment method pills */}
          <div className="flex items-center flex-wrap justify-center gap-2">
            <span className="text-slate-400 mr-1 font-medium">Thanh toán an toàn:</span>
            {[
              { label: 'SePay QR', color: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400 font-bold' },
              { label: 'Visa', color: 'bg-blue-950/60 border-blue-800/80 text-blue-400 font-bold' },
              { label: 'Mastercard', color: 'bg-amber-950/60 border-amber-800/80 text-amber-400 font-bold' },
              { label: 'MoMo', color: 'bg-pink-950/60 border-pink-800/80 text-pink-400 font-bold' },
              { label: 'ZaloPay', color: 'bg-sky-950/60 border-sky-800/80 text-sky-400 font-bold' },
            ].map((pm, idx) => (
              <span 
                key={idx} 
                className={`px-2.5 py-1 rounded-lg border text-[10px] tracking-wide shadow-sm hover:scale-105 transition-transform cursor-default ${pm.color}`}
              >
                {pm.label}
              </span>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
