import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { useStore } from '../store/store';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({ page: 1, pages: 1, total: 0 });
  const { user } = useStore();
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const pageQuery = parseInt(params.get('page')) || 1;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        toast.error('Please log in first');
        return;
      }

      try {
        const res = await axiosClient.get(`/api/orders?page=${pageQuery}`);
        setOrders(res.data.data.orders);
        setPageData({
          page: res.data.data.page,
          pages: res.data.data.pages,
          total: res.data.data.total
        });
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, pageQuery]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', newPage);
    navigate(`/orders?${newParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className='text-center py-8'>Loading...</div>;

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8'>Order History</h1>

      {orders && orders.length > 0 ? (
        <>
          <div className='space-y-4'>
            {orders.map((order) => (
              <div key={order._id} className='border p-4 rounded hover:shadow-lg'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='font-bold text-lg'>{order.orderNumber}</h3>
                    <p className='text-gray-500 text-sm mt-0.5'>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      Status: {order.orderStatus}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {order.paymentMethod === 'qr' ? 'PAYOS' : 'COD'}: {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className='flex justify-between items-end border-t pt-4 mt-2'>
                  <p className='font-bold text-brand-600'>Total: ${order.total?.toFixed(2)}</p>
                  <Link to={`/orders/${order._id}`} className='text-brand-600 font-semibold hover:underline text-sm inline-block'>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={pageData.page} 
            totalPages={pageData.pages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className='text-center py-8'>
          <p className='text-gray-600 mb-4'>No orders yet</p>
          <Link to='/' className='text-blue-600 hover:underline'>
            Start shopping
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
