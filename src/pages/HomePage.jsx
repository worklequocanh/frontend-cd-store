import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Sparkles, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

// Floating product card for hero decoration
function HeroFloatCard({ style, emoji, name, price, delay }) {
  return (
    <div
      className='absolute hidden xl:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl animate-float'
      style={{ ...style, animationDelay: delay }}
    >
      <span className='text-3xl'>{emoji}</span>
      <div>
        <p className='text-white/90 text-xs font-semibold leading-tight'>{name}</p>
        <p className='text-brand-300 text-sm font-bold'>${price}</p>
      </div>
    </div>
  );
}

// Skeleton card
function SkeletonCard() {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse'>
      <div className='aspect-square shimmer-bg'></div>
      <div className='p-4 space-y-3'>
        <div className='h-3 w-16 bg-slate-200 rounded-full'></div>
        <div className='h-4 w-full bg-slate-200 rounded-lg'></div>
        <div className='h-4 w-3/4 bg-slate-200 rounded-lg'></div>
        <div className='flex justify-between pt-3 border-t border-slate-50'>
          <div className='h-5 w-16 bg-slate-200 rounded'></div>
          <div className='h-5 w-10 bg-slate-200 rounded'></div>
        </div>
      </div>
    </div>
  );
}

// Trust bar item
function TrustItem({ icon, title, desc }) {
  return (
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0'>
        {icon}
      </div>
      <div>
        <p className='text-sm font-semibold text-slate-900'>{title}</p>
        <p className='text-xs text-slate-500'>{desc}</p>
      </div>
    </div>
  );
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosClient.get(`/api/products?limit=8`),
          axiosClient.get('/api/categories'),
        ]);
        setProducts(productsRes.data.data.products);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='min-h-screen'>

      {/* ─── Hero Section ─── */}
      <section className='relative hero-bg text-white overflow-hidden'>
        {/* Ambient glows */}
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/30 rounded-full blur-[150px] pointer-events-none' />

        {/* Floating decoration cards */}
        <HeroFloatCard style={{ top: '15%', left: '5%' }} emoji="⌚" name="Apple Watch Ultra" price="799" delay="0s" />
        <HeroFloatCard style={{ top: '60%', left: '3%' }} emoji="🎧" name="AirPods Pro" price="249" delay="2s" />
        <HeroFloatCard style={{ top: '15%', right: '5%' }} emoji="📱" name="iPhone 15 Pro" price="999" delay="1s" />
        <HeroFloatCard style={{ top: '60%', right: '3%' }} emoji="💻" name="MacBook Air M2" price="1299" delay="3s" />

        {/* Hero content */}
        <div className='relative z-10 container mx-auto px-4 py-28 md:py-36 flex flex-col items-center text-center'>
          <div className='inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in'>
            <Sparkles className='w-4 h-4 text-brand-300' />
            <span className='text-sm font-medium text-white/90'>New arrivals every week</span>
          </div>

          <h1 className='text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6 leading-[1.1] animate-fade-in-up'>
            Premium Tech,<br />
            <span className='text-gradient-light'>Unbeatable Prices.</span>
          </h1>

          <p className='text-slate-300 max-w-xl mx-auto text-lg md:text-xl mb-10 leading-relaxed animate-fade-in-up animate-delay-100'>
            Discover the latest smartphones, laptops, and smart wearables. Elevate your digital lifestyle today.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-200'>
            <button
              onClick={() => navigate('/shop')}
              className='bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-50 hover:scale-105 transition-all shadow-2xl shadow-white/10 animate-pulse-glow'
            >
              Shop Collection
            </button>
            <button
              onClick={() => navigate('/shop?sort=price')}
              className='border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm'
            >
              View Best Deals
            </button>
          </div>

          {/* Stats */}
          <div className='flex flex-wrap justify-center gap-8 mt-16 animate-fade-in-up animate-delay-300'>
            {[
              { value: '10K+', label: 'Products' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Avg Rating' },
              { value: 'Free', label: 'Shipping' },
            ].map((stat) => (
              <div key={stat.label} className='text-center'>
                <p className='text-2xl font-display font-bold text-white'>{stat.value}</p>
                <p className='text-sm text-slate-400'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className='relative z-10 h-16 bg-gradient-to-b from-transparent to-slate-50' />
      </section>

      {/* ─── Trust Bar ─── */}
      <section className='bg-white border-b border-slate-100'>
        <div className='container mx-auto px-4 py-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <TrustItem icon={<Truck className="w-5 h-5" />} title="Free Shipping" desc="On orders over $50" />
            <TrustItem icon={<Shield className="w-5 h-5" />} title="Secure Payment" desc="100% protected" />
            <TrustItem icon={<RotateCcw className="w-5 h-5" />} title="Easy Returns" desc="30-day policy" />
            <TrustItem icon={<Headphones className="w-5 h-5" />} title="24/7 Support" desc="Here to help" />
          </div>
        </div>
      </section>

      {/* ─── Category Pills ─── */}
      {categories.length > 0 && (
        <section className='bg-slate-50 pt-10 pb-6'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-display font-bold text-slate-900'>Browse by Category</h2>
            </div>
            <div className='flex flex-wrap gap-2 justify-center'>
              <button
                onClick={() => navigate('/shop')}
                className='px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/shop?category=${cat._id}`)}
                  className='px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50'
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Products Section ─── */}
      <section className='bg-slate-50 pb-20 pt-4'>
        <div className='container mx-auto px-4'>

          {/* Toolbar */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
            <div className='flex items-center gap-3 flex-wrap'>
              <h2 className='text-3xl font-display font-bold text-slate-900'>
                Featured Products
              </h2>
            </div>
            
            <button 
              onClick={() => navigate('/shop')}
              className='text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 transition-colors'
            >
              View Full Shop <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {products.map((product, i) => (
                <div key={product._id} className='animate-fade-in-up' style={{ animationDelay: `${i * 40}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm'>
              <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl'>🔍</div>
              <h3 className='text-2xl font-display font-bold text-slate-900 mb-3'>No products found</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
