import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../utils/axiosClient';
import toast from 'react-hot-toast';
import { Star, CheckCircle2, Search, Eye, EyeOff, MessageSquare, User, Package, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'approved', 'hidden'

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/reviews/admin/all');
      setReviews(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await axiosClient.patch(`/api/reviews/admin/${id}/status`, {
        isApproved: newStatus,
      });
      
      // Update local state smoothly
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: newStatus } : r))
      );
      toast.success(newStatus ? 'Review approved and published' : 'Review hidden successfully');
    } catch (error) {
      console.error('Failed to toggle review status:', error);
      toast.error('Failed to update review status');
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter((r) => r.isApproved).length;
    const hidden = total - approved;
    const avgScore = total > 0 
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / total).toFixed(1) 
      : '0.0';
    return { total, approved, hidden, avgScore };
  }, [reviews]);

  // Filter and search
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch = 
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      if (statusFilter === 'approved') return r.isApproved;
      if (statusFilter === 'hidden') return !r.isApproved;
      return true;
    });
  }, [reviews, searchTerm, statusFilter]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Customer Reviews Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor ratings, moderate customer comments, and maintain product reputation.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors self-start md:self-auto shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved (Live)</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hidden / Moderated</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.hidden}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <EyeOff className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Score</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-2xl font-bold text-slate-900">{stats.avgScore}</p>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search comment, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'approved' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:text-green-700'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setStatusFilter('hidden')}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'hidden' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              Hidden ({stats.hidden})
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium text-sm">Loading customer reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No reviews found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search filters or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Rating & Comment</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Customer Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 font-bold flex items-center justify-center shrink-0">
                          {review.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-[140px]">
                            {review.userId?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">
                            {review.userId?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg p-1 border border-slate-100 shrink-0 flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-xs line-clamp-2">
                            {review.productId?.name || 'Deleted Product'}
                          </p>
                          {review.productId?.slug && (
                            <Link
                              to={`/products/${review.productId.slug}`}
                              target="_blank"
                              className="text-[11px] text-brand-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              View page &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Rating & Comment */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-1 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (review.rating || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-1.5">
                          ({review.rating} / 5)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/80">
                        "{review.comment}"
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          review.isApproved
                            ? 'bg-green-50 text-green-700 border border-green-200/80'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}
                      >
                        {review.isApproved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            Approved
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                            Hidden
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(review._id, review.isApproved)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          review.isApproved
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                        }`}
                        title={review.isApproved ? 'Click to hide this review' : 'Click to approve and display'}
                      >
                        {review.isApproved ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            Approve
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
