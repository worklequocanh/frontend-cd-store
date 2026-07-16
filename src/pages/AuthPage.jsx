import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, ArrowRight, Package } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function AuthPage({ initialMode }) {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(() => {
    if (initialMode === 'register' || location.pathname === '/register') return false;
    return true;
  });

  useEffect(() => {
    if (initialMode === 'register' || location.pathname === '/register') {
      setIsLogin(false);
    } else if (initialMode === 'login' || location.pathname === '/login') {
      setIsLogin(true);
    }
  }, [initialMode, location.pathname]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser, setCart } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axiosClient.post(endpoint, formData);

      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data.user);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      
      const from = location.state?.from || '/';
      const pendingCartItem = location.state?.pendingCartItem;

      if (pendingCartItem) {
        try {
          const cartRes = await axiosClient.post('/api/cart/items', pendingCartItem, {
            headers: { Authorization: `Bearer ${res.data.data.token}` }
          });
          setCart(cartRes.data.data);
          toast.success('Item added to cart!');
        } catch (err) {
          toast.error('Failed to add pending item to cart');
        }
      }

      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/api/auth/google', {
        credential: credentialResponse.credential
      });

      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data.user);
      toast.success(res.data.data.isNewUser ? '🎉 Tạo tài khoản bằng Google thành công!' : '🎉 Đăng nhập Google thành công!');
      
      const from = location.state?.from || '/';
      const pendingCartItem = location.state?.pendingCartItem;

      if (pendingCartItem) {
        try {
          const cartRes = await axiosClient.post('/api/cart/items', pendingCartItem, {
            headers: { Authorization: `Bearer ${res.data.data.token}` }
          });
          setCart(cartRes.data.data);
          toast.success('Item added to cart!');
        } catch (err) {
          toast.error('Failed to add pending item to cart');
        }
      }

      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Đăng nhập Google thất bại hoặc bị hủy');
  };

  return (
    <div className='min-h-screen bg-white flex'>
      {/* Left side - Image/Branding (Hidden on mobile) */}
      <div className='hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <img 
            src="https://images.unsplash.com/photo-1550009158-9effec7682a2?q=80&w=2000&auto=format&fit=crop" 
            alt="Abstract Technology" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent'></div>
        </div>
        
        <div className='relative z-10 flex flex-col justify-between p-12 lg:p-20 w-full'>
          <Link to='/' className='text-3xl font-bold flex items-center gap-2 hover:scale-105 transition-transform w-fit'>
            <Package className="w-10 h-10 text-brand-500" />
            <span>CD Store</span>
          </Link>
          
          <div className="mt-auto max-w-lg">
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Elevate your digital lifestyle with premium tech.
            </h2>
            <p className="text-lg text-slate-300">
              Join thousands of satisfied customers and get access to exclusive deals, fast checkout, and easy order tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12'>
        <div className='w-full max-w-md'>
          <div className="mb-10 text-center lg:text-left">
            <Link to='/' className='lg:hidden flex justify-center items-center gap-2 mb-8 text-slate-900 font-bold text-2xl'>
              <Package className="w-8 h-8 text-brand-600" />
              <span>CD Store</span>
            </Link>
            <h1 className='text-3xl font-display font-bold text-slate-900 mb-2'>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-slate-500">
              {isLogin ? 'Enter your credentials to access your account' : 'Sign up to start shopping premium tech'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type='text' 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' 
                    placeholder="John Doe"
                    required={!isLogin} 
                  />
                </div>
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type='email' 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' 
                  placeholder="you@example.com"
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className='block text-sm font-medium text-slate-700'>Password</label>
                {isLogin && <Link to="/forgot-password" className="text-sm text-brand-600 font-medium hover:underline">Forgot password?</Link>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type='password' 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className='w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors' 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type='submit' 
              disabled={loading} 
              className='w-full flex justify-center items-center gap-2 bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4'
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hoặc tiếp tục với</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
              text={isLogin ? 'signin_with' : 'signup_with'}
            />
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '' });
                }} 
                className='text-brand-600 font-bold hover:underline ml-1'
              >
                {isLogin ? 'Sign up now' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
