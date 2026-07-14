<div align="center">
  <img src="https://images.unsplash.com/photo-1550009158-9effec7682a2?q=80&w=2000&auto=format&fit=crop" alt="CD Store Banner" width="100%" height="300" style="object-fit: cover; border-radius: 12px; margin-bottom: 20px;">
  
  # 🛒 CD Store - Premium Tech E-Commerce (Frontend)
  
  <p>A modern, responsive, and high-performance e-commerce platform built for the web.</p>
  
  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State_Management-black?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
</div>

<br />

## ✨ Features

- **🛍️ Complete Shopping Experience**: Browse products, search, filter by categories, and sort by price or ratings.
- **🔐 Secure Authentication**: JWT-based login, registration, and password recovery via OTP.
- **🛒 Smart Cart System**: Persistent cart state, dynamic price calculation, and seamless checkout flow.
- **💳 Payment Integration**: Supports Cash on Delivery (COD) and QR Code payments (PayOS).
- **🛡️ Admin Dashboard**: A fully protected, dedicated portal for administrators to manage products, users, orders, and coupons.
- **📱 Fully Responsive**: Carefully crafted with TailwindCSS to look stunning on desktops, tablets, and mobile devices.
- **⚡ Blazing Fast**: Powered by Vite for instant server start and lightning-fast HMR.

## 🛠️ Tech Stack

- **Framework**: [React.js](https://reactjs.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/worklequocanh/frontend-cd-store.git
   cd frontend-cd-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note: If you encounter an `EBADPLATFORM` error regarding `esbuild` on Windows, try running `npm install --force`)*

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`.

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI components (ProductCard, Header, Footer)
├── pages/            # Page components
│   ├── admin/        # Admin dashboard pages (Orders, Products, Users)
│   └── ...           # Client pages (Home, Shop, Cart, Profile)
├── store/            # Global state management (Zustand)
├── utils/            # Helper functions and Axios interceptors
├── App.jsx           # Main application routing
└── main.jsx          # Entry point
```

## 🔐 Role-Based Access

The application implements strict client-side routing protection:
- **Guest Routes**: `/auth`, `/forgot-password`, `/reset-password` (Accessible only to unauthenticated users)
- **Protected Routes**: `/profile`, `/orders`, `/cart`, `/checkout` (Requires login)
- **Admin Routes**: `/admin/*` (Requires an account with the `admin` role)

## 🎨 UI/UX Highlights
- **Micro-animations**: Smooth hover effects and transitions using Tailwind classes (`animate-fade-in-up`, `hover:scale-105`).
- **Glassmorphism**: Modern frosted glass effects on navigation bars and floating cards.
- **Smart Redirects**: Automatically remembers your previous page when prompted to log in (e.g., adding to cart while logged out).

---
<div align="center">
  <i>Built with ❤️ for a seamless shopping experience.</i>
</div>
