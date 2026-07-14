# CD Store - Frontend

This is the frontend portion of the CD Store E-Commerce application, built with React, Vite, and Tailwind CSS.

## Features
- **Modern UI/UX:** Responsive design using Tailwind CSS and Glassmorphism effects.
- **State Management:** Zustand for lightweight and fast global state.
- **Routing:** React Router v6 for SPA navigation.
- **API Communication:** Axios with interceptors for JWT token handling.
- **Cart & Checkout:** Smart checkout with pre-filled user details.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Zustand
- React Router DOM
- Axios

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend server running locally

### Installation
1. Clone the repository and navigate to this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the frontend folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```
