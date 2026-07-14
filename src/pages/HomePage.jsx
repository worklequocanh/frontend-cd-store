import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({ page: 1, pages: 1, total: 0 });
  
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
          total: productsRes.data.data.total
        });
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, categoryQuery, sortQuery, pageQuery]);

  const handleCategoryClick = (categoryId) => {
    const newParams = new URLSearchParams(location.search);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    newParams.delete('page'); // Reset to page 1 on filter change
    navigate(`/?${newParams.toString()}`);
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('sort', e.target.value);
    newParams.delete('page'); // Reset to page 1 on sort change
    navigate(`/?${newParams.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', newPage);
    navigate(`/?${newParams.toString()}`);
    // Scroll to top of products list smoothly
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='bg-slate-50 min-h-screen pb-16'>
      {!searchQuery && !categoryQuery && (
        <div className='relative bg-slate-900 text-white overflow-hidden mb-12'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-b from-brand-600/30 to-transparent rounded-full blur-3xl'></div>
            <div className='absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-t from-violet-600/30 to-transparent rounded-full blur-3xl'></div>
          </div>
          
          <div className='container mx-auto px-4 py-24 relative z-10 flex flex-col items-center text-center'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight'>
              Premium Tech, <br/><span className='text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400'>Unbeatable Prices.</span>
            </h1>
            <p className='text-slate-300 max-w-2xl mx-auto text-lg md:text-xl mb-10'>
              Discover the latest smartphones, powerful laptops, and smart wearables. Elevate your digital lifestyle today.
            </p>
            <button 
              onClick={() => {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className='bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-brand-50 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]'
            >
              Shop Collection
            </button>
          </div>
        </div>
      )}

      <div id="products-section" className='container mx-auto px-4 flex flex-col lg:flex-row gap-8'>
        {/* Sidebar Filters */}
        <div className='w-full lg:w-1/4'>
          <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24'>
            <div className='flex justify-between items-center mb-6 pb-4 border-b border-slate-100'>
              <h2 className='text-lg font-display font-bold text-slate-900'>Filters</h2>
              {(categoryQuery || searchQuery) && (
                <button 
                  onClick={() => navigate('/')}
                  className='text-sm text-brand-600 font-medium hover:underline'
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div>
              <h3 className='font-semibold text-slate-700 mb-4'>Categories</h3>
              <div className='flex flex-col gap-2'>
                <button 
                  onClick={() => handleCategoryClick('')}
                  className={`text-left w-full px-4 py-2.5 rounded-xl transition-all ${!categoryQuery ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className={`text-left w-full px-4 py-2.5 rounded-xl transition-all ${categoryQuery === cat._id ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='w-full lg:w-3/4'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm'>
            <h2 className='text-xl font-display font-semibold text-slate-900 flex items-center gap-2'>
              {searchQuery ? `Search: "${searchQuery}"` : categoryQuery ? 'Category Products' : 'All Products'}
              <span className='bg-slate-100 text-slate-500 text-sm font-medium px-2.5 py-0.5 rounded-full'>
                {pageData.total}
              </span>
            </h2>

            <div className='flex items-center gap-3'>
              <label className='text-slate-500 text-sm font-medium hidden sm:block'>Sort by:</label>
              <select 
                value={sortQuery} 
                onChange={handleSortChange}
                className='bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium cursor-pointer'
              >
                <option value='-createdAt'>Newest Arrivals</option>
                <option value='price'>Price: Low to High</option>
                <option value='-price'>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className='bg-white border border-slate-100 h-[380px] rounded-2xl p-4 flex flex-col animate-pulse'>
                  <div className="w-full h-40 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="w-2/3 h-5 bg-slate-200 rounded mb-2"></div>
                  <div className="w-full h-5 bg-slate-200 rounded mb-6"></div>
                  <div className="mt-auto flex justify-between">
                    <div className="w-1/3 h-6 bg-slate-200 rounded"></div>
                    <div className="w-1/4 h-6 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination 
                currentPage={pageData.page} 
                totalPages={pageData.pages} 
                onPageChange={handlePageChange} 
              />
            </>
          ) : (
            <div className='text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm'>
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-2">No products found</h3>
              <p className='text-slate-500 mb-6'>We couldn't find anything matching your current filters.</p>
              <button 
                onClick={() => navigate('/')}
                className='bg-brand-50 text-brand-600 px-6 py-2 rounded-full font-medium hover:bg-brand-100 transition-colors'
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
