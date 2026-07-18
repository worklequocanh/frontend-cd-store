import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Mã OTP đã được gửi đến email của bạn');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể gửi mã OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-16 max-w-md'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Quên Mật Khẩu</h1>
        
        {sent ? (
          <div className='text-center'>
            <p className='mb-6'>Mã xác thực OTP đã được gửi đến <strong>{email}</strong></p>
            <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className='block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>
              Nhập Mã OTP
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block font-medium mb-2'>Địa Chỉ Email</label>
              <input
                type='email'
                required
                className='w-full border px-4 py-2 rounded'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400'
            >
              {loading ? 'Đang gửi...' : 'Gửi Mã OTP'}
            </button>
            <div className='mt-4 text-center'>
              <Link to='/auth' className='text-blue-600 hover:underline'>Quay lại Đăng nhập</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
