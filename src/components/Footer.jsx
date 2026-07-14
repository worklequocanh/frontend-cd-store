import React from 'react';
import { Package, Mail, MapPin, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='bg-slate-900 text-slate-300 mt-20 pt-16 pb-8 border-t border-slate-800'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12'>
          
          <div className='lg:col-span-2'>
            <Link to='/' className='text-2xl font-bold text-white flex items-center gap-2 mb-6'>
              <Package className="w-8 h-8 text-brand-500" />
              <span>CD Store</span>
            </Link>
            <p className='text-slate-400 mb-6 max-w-sm leading-relaxed'>
              Your premium destination for the latest tech gadgets, smartphones, laptops, and smartwatches. Experience seamless shopping with us.
            </p>
            <div className='flex gap-4'>
              <a href='#' className='bg-slate-800 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-colors'><Globe className="w-5 h-5" /></a>
              <a href='#' className='bg-slate-800 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-colors'><MapPin className="w-5 h-5" /></a>
              <a href='#' className='bg-slate-800 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-colors'><Phone className="w-5 h-5" /></a>
              <a href='#' className='bg-slate-800 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-colors'><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className='font-display font-semibold text-white text-lg mb-6'>Quick Links</h3>
            <ul className='space-y-3'>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>Home</Link></li>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>Shop All</Link></li>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>New Arrivals</Link></li>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>Sale</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='font-display font-semibold text-white text-lg mb-6'>Customer Support</h3>
            <ul className='space-y-3'>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>FAQ</Link></li>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>Returns & Exchanges</Link></li>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>Shipping Info</Link></li>
              <li><Link to='/' className='hover:text-brand-400 transition-colors'>Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='font-display font-semibold text-white text-lg mb-6'>Stay Updated</h3>
            <p className='text-slate-400 text-sm mb-4'>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className='flex flex-col gap-2'>
              <div className='relative'>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-brand-500 text-white text-sm"
                />
              </div>
              <button type="button" className="w-full bg-brand-600 text-white rounded-lg py-2 font-medium hover:bg-brand-700 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className='border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500'>
          <p>&copy; {new Date().getFullYear()} CD Store. All rights reserved.</p>
          <div className='flex gap-6'>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
