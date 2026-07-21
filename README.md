<div align="center">
  <div style="background: linear-gradient(135deg, #312e81 0%, #4338ca 100%); padding: 40px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
    <h1 style="color: white; margin: 0; font-size: 2.6rem; font-weight: 800;">🛒 CD Store - Frontend Enterprise UI</h1>
    <p style="color: #e0e7ff; font-size: 1.1rem; margin-top: 10px;">Đồ án Môn học Chuyên đề Backend • SPA React.js, Vite & Tailwind CSS</p>
  </div>
  
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-Global_State-black?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
  [![Recharts](https://img.shields.io/badge/Recharts-Data_Visualization-FF6384?style=for-the-badge)](https://recharts.org/)
</div>

---

## 🔗 Live Demo & Source Code

- **🌐 Live Frontend App (Fly.io):** [https://cd-store-frontend.fly.dev/](https://cd-store-frontend.fly.dev/)
- **💻 Frontend Repository:** [https://github.com/worklequocanh/frontend-cd-store](https://github.com/worklequocanh/frontend-cd-store)
- **🚀 Live Backend API:** [https://cd-store-backend.fly.dev/](https://cd-store-backend.fly.dev/)
- **💻 Backend Repository:** [https://github.com/worklequocanh/backend-cd-store](https://github.com/worklequocanh/backend-cd-store)

---

## 🌟 Tổng Quan Trang Giao Diện (`Frontend Overview`)

**CD Store Frontend UI** là ứng dụng trang đơn (SPA - Single Page Application) thế hệ mới được tối ưu hóa toàn diện về tốc độ tải trang, trải nghiệm tương tác mượt mà và giao diện thẩm mỹ cao cấp. Sử dụng **React 18** và công cụ build siêu tốc **Vite 5**, kết hợp cùng bộ tạo kiểu **Tailwind CSS** theo phong cách **Glassmorphism** sang trọng.

Hệ thống không chỉ dành cho khách hàng mua sắm với quy trình **Smart Checkout & SePay VietQR tự động** mà còn tích hợp một **Portal Quản Trị Viên (Admin Dashboard) chuyên nghiệp** được trang bị các tính năng Enterprise cao cấp như Biểu đồ tương tác thời gian thực (`Recharts`), Kiểm toán lịch sử biến động kho (`Stock Ledger`), và xuất báo cáo bảng tính một chạm (`Excel/CSV Export`).

---

## ✨ Điểm Nhấn Tính Năng (`Key Features`)

### 🛍️ 1. Trải Nghiệm Mua Sắm Khách Hàng (`Customer Experience`)
- **Khám phá & Bộ lọc sản phẩm**: Trang `ShopPage.jsx` cho phép lọc nhanh theo danh mục, khoảng giá, và sắp xếp theo độ phổ biến hoặc đánh giá sao vàng tức thì mà không cần reload trang.
- **Chi tiết Sản phẩm & Đánh giá**: Trang `ProductPage.jsx` tích hợp nhúng thẻ dữ liệu cấu trúc **JSON-LD Rich Snippets** giúp Google hiển thị sao đánh giá và giá bán trên trang kết quả tìm kiếm, kèm cơ chế gửi đánh giá trực tiếp.
- **Giỏ hàng Thông minh (`CartStore`)**: Quản lý toàn bộ trạng thái giỏ hàng global qua `Zustand`, tính toán tự động mã giảm giá (Coupon Flow) trừ tiền ngay trên giao diện.
- **Quy trình Smart Checkout & SePay VietQR**: Tự động điền sẵn (pre-fill) thông tin giao hàng từ Profile người dùng, hỗ trợ thanh toán chuyển khoản **SePay VietQR tự động hóa 100%** hoặc Thanh toán khi nhận hàng (COD).

### 🛡️ 2. Hệ Thống Quản Trị Enterprise (`Admin Dashboard & Analytics`)
- **Biểu Đồ Trực Quan (`Recharts Engine`)**:
  - **Biểu đồ Vùng (`AreaChart`)**: Thể hiện xu hướng doanh thu và số lượng đơn hàng 30 ngày qua với dải màu gradient sống động.
  - **Biểu đồ Cột (`BarChart`)**: Thống kê Top 5 sản phẩm bán chạy nhất giúp đưa ra quyết định nhập hàng.
  - **Biểu đồ Tròn (`PieChart`)**: Phân bổ tỷ trọng các trạng thái đơn hàng (Giao thành công, Đang xử lý, Hủy).
- **Tab Kiểm Toán Lịch Sử Kho (`Stock Ledger`)**: Trang `AdminProducts.jsx` bổ sung tab tra cứu toàn bộ dấu vết kiểm toán (`StockLog`), minh bạch hóa từng giao dịch nhập/xuất kho của hệ thống.
- **Cảnh Báo Tồn Kho & Nhập Kho Nhanh**: Khu vực riêng hiển thị các sản phẩm sắp hết hàng (`stock <= 10`), tích hợp Modal panel **"Nhập Kho Nhanh"** cộng số lượng tức thì chỉ trong 1 thao tác click.
- **Xuất Báo Cáo Kế Toán (`Excel/CSV Export`)**: Nút xuất file bảng tính trực tiếp trên thanh công cụ của các trang Quản lý Đơn hàng, Sản phẩm và Khách hàng.

### 🎨 3. Thẩm Mỹ & Trải Nghiệm Người Dùng (`UI/UX Design`)
- **Glassmorphism & Bo Góc Hiện Đại**: Sử dụng các lớp hiệu ứng kính mờ (`backdrop-blur-md`), bảng màu trung tính `slate-50` kết hợp điểm nhấn `indigo-violet`, bo góc mềm mại (`rounded-2xl`).
- **Micro-animations**: Hiệu ứng chuyển động tinh tế (`hover:scale-105`, `animate-fade-in-up`) trên từng thẻ sản phẩm và nút bấm, tạo cảm giác hệ thống sống động và phản hồi nhanh nhạy.

---

## 🛠️ Kiến Trúc & Công Nghệ (`Tech Stack`)

| Thư viện / Công cụ | Phiên bản | Vai trò trong kiến trúc |
| :--- | :--- | :--- |
| **React.js** | `v18.x` | Thư viện UI cốt lõi, cơ chế Virtual DOM và React Hooks |
| **Vite** | `v5.x` | Trình đóng gói (Bundler) siêu tốc, Hot Module Replacement (HMR) tức thì |
| **Tailwind CSS** | `v3.x` | Framework CSS Utility-first, xây dựng hệ thống Design System & Glassmorphism |
| **Zustand** | `v4.x` | Quản lý Global State (`AuthStore`, `CartStore`) tinh gọn, không boilerplate cồng kềnh |
| **React Router** | `v6.x` | Định tuyến phía Client (Client-side Routing), bảo vệ Protected/Admin Routes |
| **Recharts** | `v2.x` | Thư viện vẽ biểu đồ tương tác thời gian thực cho Admin Dashboard |
| **Axios** | `v1.x` | HTTP Client đính kèm JWT Interceptors tự động và xử lý lỗi đồng bộ |
| **Lucide React** | `v0.x` | Bộ biểu tượng (Icons) hiện đại, sắc nét |
| **React Hot Toast** | `v2.x` | Hiển thị thông báo (Toast Notifications) thanh lịch, phản hồi thao tác người dùng |

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (`Quickstart Guide`)

### 1. Yêu cầu tiên quyết
- Node.js `v18+` hoặc `v20+` và trình quản lý gói `npm`.
- Đã khởi chạy máy chủ Backend tại cổng `5000`.

### 2. Cài đặt các thư viện phụ thuộc
Di chuyển vào thư mục frontend và tiến hành cài đặt:
```bash
cd fe
npm install
```
*(Lưu ý: Nếu gặp lỗi liên quan đến `esbuild` trên nền tảng Windows, hãy thử chạy lệnh `npm install --force`)*

### 3. Cấu hình biến môi trường (`.env`)
Tạo file `.env` tại thư mục gốc của `fe/` để kết nối với Backend API:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Khởi chạy máy chủ phát triển (Development Server)
```bash
npm run dev
```
*Trình duyệt sẽ tự động hoặc cho phép bạn truy cập tại đường dẫn `http://localhost:3000` (hoặc `http://localhost:5173`).*

### 5. Đóng gói bản Production (`Build for Production`)
Kiểm tra khả năng biên dịch sạch (`clean compilation`) để chuẩn bị triển khai lên cloud:
```bash
npm run build
```
*Tệp tin tĩnh tối ưu hóa sẽ được sinh ra tại thư mục `dist/` với tốc độ build cực nhanh (~11 giây).*

---

## 📂 Cấu Trúc Thư Mục (`Project Structure`)

```text
src/
├── components/           # Các Component tái sử dụng toàn cục
│   ├── Header.jsx        # Navigation Bar với Giỏ hàng Zustand badge
│   ├── Footer.jsx        # Footer thông tin và bản quyền
│   ├── ProductCard.jsx   # Thẻ sản phẩm với hiệu ứng micro-animations
│   └── Pagination.jsx    # Phân trang mượt mà
├── pages/                # Các Trang giao diện chính
│   ├── admin/            # Phân hệ Quản trị viên (Admin Dashboard)
│   │   ├── AdminDashboard.jsx  # Biểu đồ Recharts Area/Bar/Pie & Low Stock Alerts
│   │   ├── AdminProducts.jsx   # Quản lý Sản phẩm & Tab Kiểm toán Stock Ledger
│   │   ├── AdminOrders.jsx     # Quản lý Đơn hàng & Xuất báo cáo Excel/CSV
│   │   ├── AdminUsers.jsx      # Quản lý Người dùng
│   │   └── AdminReviews.jsx    # Quản lý & Kiểm duyệt đánh giá
│   ├── HomePage.jsx      # Trang chủ Banner & Sản phẩm nổi bật
│   ├── ShopPage.jsx      # Trang cửa hàng với bộ lọc danh mục và giá
│   ├── ProductPage.jsx   # Trang chi tiết & Nhúng Rich Snippets JSON-LD
│   ├── CartPage.jsx      # Trang giỏ hàng và nhập mã ưu đãi Coupon
│   ├── OrderDetailsPage.jsx # Thanh toán SePay VietQR & Stepper 4 bước
│   └── ...               # Trang đăng nhập, đăng ký, quên mật khẩu
├── store/                # Global State Management với Zustand
│   ├── useAuthStore.js   # Quản lý Token, User Profile và quyền Admin
│   └── useCartStore.js   # Quản lý Giỏ hàng và tính toán ưu đãi
├── utils/                # Helper utilities và Axios Interceptors
├── App.jsx               # Định tuyến Router & Phân quyền bảo vệ Route
└── main.jsx              # Entry point khởi tạo React DOM
```

---

## 🔐 Phân Quyền Route Phía Client (`Route Protection`)
Hệ thống sử dụng cơ chế bảo vệ theo 3 tầng rõ rệt trong `App.jsx`:
- **Guest Routes**: `/auth`, `/forgot-password`, `/reset-password` (Tự động chuyển hướng nếu người dùng đã đăng nhập).
- **Protected Routes**: `/profile`, `/orders`, `/cart`, `/checkout` (Yêu cầu phải có Access Token hợp lệ, nếu không sẽ chuyển sang `/auth` và ghi nhớ đường dẫn).
- **Admin Routes**: `/admin/*` (Yêu cầu tài khoản có trường `role === 'admin'`, chặn tuyệt đối khách hàng thường truy cập).

---
<div align="center">
  <i>Tài liệu Chuyên đề Backend • Đồ án Môn học CD Store E-Commerce</i>
</div>
