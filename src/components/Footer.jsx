import React from 'react';
import { Package, Mail, Globe, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='bg-slate-900 text-slate-400'>
      {/* Trust stripe */}
      <div className='border-b border-slate-800'>
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              { emoji: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { emoji: '🔒', title: 'Secure Payment', desc: '100% SSL protected' },
              { emoji: '↩️', title: '30-Day Returns', desc: 'No questions asked' },
              { emoji: '🎧', title: '24/7 Support', desc: 'Always here to help' },
            ].map(item => (
              <div key={item.title} className='flex items-center gap-3'>
                <span className='text-2xl'>{item.emoji}</span>
                <div>
                  <p className='text-sm font-semibold text-white'>{item.title}</p>
                  <p className='text-xs text-slate-500'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className='container mx-auto px-4 pt-16 pb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12'>

          {/* Brand */}
          <div className='lg:col-span-2'>
            <Link to='/' className='inline-flex items-center gap-2.5 mb-6'>
              <div className='w-9 h-9 bg-gradient-to-br from-brand-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg'>
                <Package className='w-5 h-5 text-white' />
              </div>
              <span className='font-display font-bold text-xl text-white'>CD Store</span>
            </Link>
            <p className='text-slate-400 mb-6 max-w-sm leading-relaxed text-sm'>
              Your premium destination for the latest tech gadgets, smartphones, laptops, and smartwatches. Experience seamless shopping with guaranteed quality.
            </p>
            {/* Social links */}
            <div className='flex gap-3'>
              {[
                { Icon: Globe, href: '#', label: 'Website' },
                { Icon: MessageCircle, href: '#', label: 'Chat' },
                { Icon: Send, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all duration-200 hover:scale-110'
                >
                  <Icon className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-display font-bold text-white text-base mb-5'>Shop & About</h3>
            <ul className='space-y-3 text-sm'>
              {[
                { label: 'All Products', to: '/shop' },
                { label: 'About Us', to: '/about' },
                { label: 'New Arrivals', to: '/shop?sort=-createdAt' },
                { label: 'Best Deals', to: '/shop?sort=price' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className='hover:text-brand-400 transition-colors'>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='font-display font-bold text-white text-base mb-5'>Support</h3>
            <ul className='space-y-3 text-sm'>
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'FAQ', to: '/contact' },
                { label: 'Track Order', to: '/orders' },
                { label: 'Returns & Exchanges', to: '/contact' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className='hover:text-brand-400 transition-colors'>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='font-display font-bold text-white text-base mb-5'>Stay Updated</h3>
            <p className='text-slate-400 text-sm mb-4'>Get the latest deals and new arrivals straight to your inbox.</p>
            <form className='flex flex-col gap-2' onSubmit={e => e.preventDefault()}>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
                <input
                  type='email'
                  placeholder='your@email.com'
                  className='w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors'
                />
              </div>
              <button
                type='button'
                className='w-full bg-brand-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-slate-500'>© {new Date().getFullYear()} CD Store. All rights reserved.</p>
          <div className='flex items-center gap-6 text-sm'>
            <a href='#' className='text-slate-500 hover:text-slate-300 transition-colors'>Privacy Policy</a>
            <a href='#' className='text-slate-500 hover:text-slate-300 transition-colors'>Terms of Service</a>
          </div>
          {/* Accepted payments */}
          <div className='flex items-center gap-2 text-slate-500 text-xs'>
            <span>We accept:</span>
            {['💳', '🏦', '📱', '💰'].map(e => (
              <span key={e} className='text-base'>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
