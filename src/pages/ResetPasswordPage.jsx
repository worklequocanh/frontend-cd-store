import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = verify OTP, 2 = reset password
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className='container mx-auto px-4 py-16 max-w-md text-center'>
        <p className='mb-4'>Invalid request.</p>
        <Link to='/forgot-password' className='text-blue-600 hover:underline'>Back to Forgot Password</Link>
      </div>
    );
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/api/auth/verify-otp', { email, otp });
      setStep(2);
      toast.success('OTP verified');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/api/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successful! You can now login.');
      navigate('/auth');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-16 max-w-md'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Reset Password</h1>
        
        {step === 1 ? (
          <form onSubmit={handleVerifyOtp}>
            <p className='text-sm text-gray-600 mb-4'>Enter the 6-digit OTP sent to {email}</p>
            <div className='mb-4'>
              <label className='block font-medium mb-2'>OTP</label>
              <input
                type='text'
                required
                maxLength={6}
                className='w-full border px-4 py-2 rounded text-center tracking-widest font-mono text-lg'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400'
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className='mb-4'>
              <label className='block font-medium mb-2'>New Password</label>
              <input
                type='password'
                required
                minLength={6}
                className='w-full border px-4 py-2 rounded'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400'
            >
              {loading ? 'Resetting...' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
