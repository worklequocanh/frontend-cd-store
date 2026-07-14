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
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-16 max-w-md'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Forgot Password</h1>
        
        {sent ? (
          <div className='text-center'>
            <p className='mb-6'>An OTP has been sent to <strong>{email}</strong></p>
            <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className='block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>
              Enter OTP
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block font-medium mb-2'>Email Address</label>
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
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <div className='mt-4 text-center'>
              <Link to='/auth' className='text-blue-600 hover:underline'>Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
