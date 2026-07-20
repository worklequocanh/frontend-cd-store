import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axiosClient from './utils/axiosClient';
import { useStore } from './store/store';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminContacts from './pages/admin/AdminContacts';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import ClientRoute from './components/ClientRoute';
import ScrollToTop from './components/ScrollToTop';

function ClientLayout() {
  return (
    <ClientRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ClientRoute>
  );
}

function App() {
  const { setUser, setAuthLoading } = useStore();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosClient.get('/api/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to authenticate user', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
          }
        } finally {
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, [setUser, setAuthLoading]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" />
      <Routes>
        {/* Client Routes wrapped with Header and Footer */}
        <Route element={<ClientLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/products/:slug' element={<ProductPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />
          
          {/* Guest Only Routes */}
          <Route path='/auth' element={
            <GuestRoute>
              <AuthPage />
            </GuestRoute>
          } />
          <Route path='/login' element={
            <GuestRoute>
              <AuthPage initialMode="login" />
            </GuestRoute>
          } />
          <Route path='/register' element={
            <GuestRoute>
              <AuthPage initialMode="register" />
            </GuestRoute>
          } />
          <Route path='/forgot-password' element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          } />
          <Route path='/reset-password' element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          } />

          {/* Protected User Routes */}
          <Route path='/cart' element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path='/checkout' element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path='/orders' element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />
          <Route path='/orders/:id' element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Login - Isolated from Client and Admin Layout */}
        <Route path='/admin/login' element={
          <GuestRoute>
            <AdminLoginPage />
          </GuestRoute>
        } />

        {/* Admin Routes - No global Header/Footer */}
        <Route path='/admin' element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='orders/:id' element={<AdminOrderDetails />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='coupons' element={<AdminCoupons />} />
          <Route path='campaigns' element={<AdminCampaigns />} />
          <Route path='reviews' element={<AdminReviews />} />
          <Route path='contacts' element={<AdminContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
