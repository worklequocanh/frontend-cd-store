import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { X } from 'lucide-react';

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

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({ page: 1, pages: 1, total: 0 });
  const [filterOpen, setFilterOpen] = useState(false);
  const productsRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('search') || '';
  const categoryQuery = params.get('category') || '';
  const sortQuery = params.get('sort') || '-createdAt';
  const pageQuery = parseInt(params.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (categoryQuery) queryParams.append('category', categoryQuery);
        if (sortQuery) queryParams.append('sort', sortQuery);
        queryParams.append('page', pageQuery);

        const [productsRes, categoriesRes] = await Promise.all([
          axiosClient.get(`/api/products?${queryParams.toString()}`),
          axiosClient.get('/api/categories'),
        ]);
        setProducts(productsRes.data.data.products);
        setPageData({
          page: productsRes.data.data.page,
          pages: productsRes.data.data.pages,
          total: productsRes.data.data.total,
        });
        setCategories(categoriesRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, categoryQuery, sortQuery, pageQuery]);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(location.search);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    navigate(`/shop?${p.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const p = new URLSearchParams(location.search);
    p.set('page', newPage);
    navigate(`/shop?${p.toString()}`);
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFilters = [
    searchQuery && { key: 'search', label: `"${searchQuery}"` },
    categoryQuery && { key: 'category', label: categories.find(c => c._id === categoryQuery)?.name || 'Category' },
  ].filter(Boolean);

  return (
    <div className='min-h-screen pt-8'>
      {/* ─── Category Pills ─── */}
      {categories.length > 0 && (
        <section className={`bg-slate-50 pb-6`}>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl md:text-4xl font-display font-bold text-slate-900'>Shop</h1>
              <p className='text-slate-500 mt-2'>Find exactly what you're looking for</p>
            </div>
            <div className='flex flex-wrap gap-2 justify-center md:justify-start'>
              <button
                onClick={() => updateParam('category', '')}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  !categoryQuery
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParam('category', cat._id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    categoryQuery === cat._id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Products Section ─── */}
      <section ref={productsRef} id="products-section" className='bg-slate-50 pb-20 pt-4'>
        <div className='container mx-auto px-4'>

          {/* Toolbar */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
            <div className='flex items-center gap-3 flex-wrap'>
              <h2 className='text-xl font-display font-bold text-slate-900'>
                {searchQuery ? `Results for "${searchQuery}"` : categoryQuery ? (categories.find(c => c._id === categoryQuery)?.name || 'Products') : 'All Products'}
              </h2>
              <span className='bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full'>
                {pageData.total} items
              </span>
              {/* Active filters */}
              {activeFilters.map(f => (
                <button
                  key={f.key}
                  onClick={() => updateParam(f.key, '')}
                  className='flex items-center gap-1 bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors'
                >
                  {f.label} <X className="w-3 h-3" />
                </button>
              ))}
            </div>

            <div className='flex items-center gap-3'>
              <label className='text-sm font-medium text-slate-500'>Sort:</label>
              <select
                value={sortQuery}
                onChange={(e) => updateParam('sort', e.target.value)}
                className='bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium cursor-pointer shadow-sm'
              >
                <option value='-createdAt'>Newest</option>
                <option value='price'>Price: Low → High</option>
                <option value='-price'>Price: High → Low</option>
                <option value='-rating'>Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {products.map((product, i) => (
                  <div key={product._id} className='animate-fade-in-up' style={{ animationDelay: `${i * 40}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className='mt-12'>
                <Pagination currentPage={pageData.page} totalPages={pageData.pages} onPageChange={handlePageChange} />
              </div>
            </>
          ) : (
            <div className='text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm'>
              <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl'>🔍</div>
              <h3 className='text-2xl font-display font-bold text-slate-900 mb-3'>No products found</h3>
              <p className='text-slate-500 mb-8 max-w-sm mx-auto'>We couldn't find anything matching your current filters. Try adjusting your search.</p>
              <button
                onClick={() => navigate('/')}
                className='btn-primary'
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ShopPage;
