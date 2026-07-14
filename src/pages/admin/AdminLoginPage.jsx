import React, { useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/store';
import toast from 'react-hot-toast';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosClient.post('/api/admin/auth/login', formData);

      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data.user);
      toast.success('Admin authentication successful');
      
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
      </div>

      <div className='w-full max-w-md relative z-10'>
        <div className='bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl'>
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-600">
              <Shield className="w-8 h-8 text-brand-500" />
            </div>
            <h1 className='text-3xl font-display font-bold text-white mb-2'>
              Admin Portal
            </h1>
            <p className="text-slate-400">
              Authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type='email' 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-slate-600' 
                  placeholder="admin@cdstore.com"
                  required 
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type='password' 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-slate-600' 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type='submit' 
              disabled={loading} 
              className='w-full flex justify-center items-center gap-2 bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4'
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white/20 border-t-white"></span>
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-500">
              Return to <a href="/" className="text-brand-500 hover:text-brand-400 font-medium">Storefront</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
