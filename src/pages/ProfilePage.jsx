import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const res = await axiosClient.get('/api/auth/me');
        setProfile(res.data.data);
        setFormData(res.data.data);
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.patch(`/api/users/${user._id || user.id}`, formData);
      setProfile(formData);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <div className='text-center py-8'>Loading...</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>My Profile</h1>

      <div className='max-w-2xl'>
        {editing ? (
          <form onSubmit={handleSave} className='border p-6 rounded'>
            <div className='mb-4'>
              <label className='block font-semibold mb-2'>Name</label>
              <input type='text' value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-full border rounded px-4 py-2' />
            </div>

            <div className='mb-4'>
              <label className='block font-semibold mb-2'>Email</label>
              <input type='email' value={formData.email || ''} disabled className='w-full border rounded px-4 py-2 bg-gray-100' />
            </div>

            <div className='mb-4'>
              <label className='block font-semibold mb-2'>Phone</label>
              <input type='tel' value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className='w-full border rounded px-4 py-2' />
            </div>

            <div className='mb-6'>
              <label className='block font-semibold mb-2'>Address</label>
              <textarea value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className='w-full border rounded px-4 py-2' rows="3"></textarea>
            </div>

            <div className='flex gap-4'>
              <button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'>
                Save
              </button>
              <button type='button' onClick={() => setEditing(false)} className='bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500'>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className='border p-6 rounded'>
            <div className='mb-4'>
              <span className='font-semibold text-gray-600'>Name:</span>
              <p className='text-lg'>{profile.name}</p>
            </div>
            <div className='mb-4'>
              <span className='font-semibold text-gray-600'>Email:</span>
              <p className='text-lg'>{profile.email}</p>
            </div>
            <div className='mb-4'>
              <span className='font-semibold text-gray-600'>Phone:</span>
              <p className='text-lg'>{profile.phone || 'Not provided'}</p>
            </div>
            <div className='mb-6'>
              <span className='font-semibold text-gray-600'>Address:</span>
              <p className='text-lg'>{profile.address || 'Not provided'}</p>
            </div>
            <button onClick={() => setEditing(true)} className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
