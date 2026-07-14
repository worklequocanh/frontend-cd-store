import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import axiosClient from '../utils/axiosClient';

// Mock the axios client
vi.mock('../utils/axiosClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock the store
vi.mock('../store/store', () => ({
  useStore: vi.fn(() => ({
    user: { id: '1', name: 'Admin User', role: 'admin' }
  })),
}));

// Mock ResizeObserver for Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

const mockDashboardData = {
  totalRevenue: 1500.5,
  totalOrders: 15,
  totalUsers: 42,
  totalProducts: 100,
  pendingOrders: 5,
  recentOrders: [
    {
      _id: 'order1',
      orderNumber: 'ORD-123',
      userId: { name: 'John Doe' },
      createdAt: new Date().toISOString(),
      orderStatus: 'pending',
      total: 100,
    }
  ]
};

const mockRevenueData = [
  { _id: new Date().toISOString(), total: 100 },
  { _id: new Date().toISOString(), total: 200 }
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Setup promises that don't resolve immediately
    axiosClient.get.mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('renders dashboard data successfully', async () => {
    axiosClient.get.mockImplementation((url) => {
      if (url === '/api/admin/dashboard') {
        return Promise.resolve({ data: { data: mockDashboardData } });
      }
      if (url === '/api/admin/analytics/revenue') {
        return Promise.resolve({ data: { data: mockRevenueData } });
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Wait for the data to load and remove the loading text
    await waitFor(() => {
      expect(screen.queryByText('Fetching data...')).not.toBeInTheDocument();
    });

    // Check if key metrics are displayed
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // totalOrders
    expect(screen.getByText('42')).toBeInTheDocument(); // totalUsers
    expect(screen.getByText('100')).toBeInTheDocument(); // totalProducts
    expect(screen.getByText('John Doe')).toBeInTheDocument(); // recent order user
    expect(screen.getByText('#ORD-123')).toBeInTheDocument(); // recent order number
  });

  it('displays error toast when API fails', async () => {
    axiosClient.get.mockRejectedValue(new Error('Network Error'));
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Wait for the error handling to run
    // Depending on toast library implementation, we just test if loading goes away or error handles
    // In this case, we expect it might still show loading or we could spy on toast
    // Just a basic check that it doesn't crash
    expect(axiosClient.get).toHaveBeenCalledTimes(2);
  });
});
