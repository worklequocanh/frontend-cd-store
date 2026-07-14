import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { Users, Shield, User, Mail, Calendar } from 'lucide-react';
import Pagination from '../../components/Pagination';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get(`/api/users?page=${page}&limit=10`);
      setUsers(res.data.data.users);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className='flex items-center justify-center h-64'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
    </div>
  );

  return (
    <div className='pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-display font-bold text-slate-900'>Users</h1>
          <p className="text-slate-500 mt-1">Manage customers and admin accounts.</p>
        </div>
      </div>

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100'>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>User</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Contact</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Role</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider'>Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-600'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {u.email}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-slate-300 mb-4" />
                      <p className="text-lg font-medium text-slate-900">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
