# 📋 PROJECT OVERVIEW - CLOTHES SHOP E-COMMERCE PLATFORM

## 🎯 Giới thiệu dự án

**Tên dự án**: Clothes Shop - E-commerce Platform  
**Loại hình**: Hệ thống thương mại điện tử bán quần áo trực tuyến  
**Công nghệ**: Full-stack Web Application  

Dự án xây dựng một nền tảng thương mại điện tử hoàn chỉnh cho việc mua bán quần áo trực tuyến, bao gồm giao diện khách hàng và hệ thống quản trị admin.

---

## 🏗️ Kiến trúc hệ thống

### **Frontend (Client-side)**
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context API
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form + Zod validation

### **Backend (Server-side)**
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Access Token + Refresh Token)
- **File Upload**: Cloudinary
- **Email Service**: Nodemailer

### **Architecture Pattern**
- **Kiến trúc**: Client-Server (RESTful API)
- **Authentication**: Token-based với refresh token mechanism
- **Authorization**: Role-based access control (RBAC)

---

## 👥 Phân loại người dùng

### 1. **Guest (Khách vãng lai)**
- Xem sản phẩm, danh mục
- Thêm sản phẩm vào giỏ hàng (lưu trong localStorage)
- Thanh toán mà không cần đăng ký

### 2. **Customer (Khách hàng đã đăng ký)**
- Tất cả chức năng của Guest
- Quản lý tài khoản cá nhân
- Xem lịch sử đơn hàng
- Quản lý địa chỉ giao hàng
- Đổi mật khẩu

### 3. **Admin (Quản trị viên)**
- Toàn quyền quản lý hệ thống
- Quản lý sản phẩm, danh mục
- Quản lý đơn hàng
- Quản lý người dùng (admin và customer)
- Xem thống kê, báo cáo

---

## 🔑 Chức năng chính

### **A. Chức năng dành cho Customer**

#### 1. **Authentication & Authorization**
- Đăng ký tài khoản mới
- Đăng nhập (email + password)
- Đăng xuất
- Refresh token tự động
- Xem và cập nhật profile

#### 2. **Quản lý sản phẩm**
- Xem danh sách sản phẩm (có phân trang)
- Lọc sản phẩm theo:
  - Danh mục (category)
  - Thương hiệu (brand)
  - Giá (minPrice, maxPrice)
  - Trạng thái (active/inactive)
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- Xem các biến thể (variants): size, màu sắc, giá

#### 3. **Giỏ hàng (Cart)**
- Thêm sản phẩm vào giỏ
- Cập nhật số lượng
- Xóa sản phẩm khỏi giỏ
- Xóa toàn bộ giỏ hàng
- Hỗ trợ giỏ hàng cho cả guest và user đã đăng nhập

#### 4. **Đặt hàng (Orders)**
- Checkout từ giỏ hàng
- Nhập địa chỉ giao hàng
- Xem lịch sử đơn hàng
- Xem chi tiết đơn hàng
- Hủy đơn hàng

#### 5. **Quản lý địa chỉ**
- Thêm địa chỉ giao hàng
- Cập nhật địa chỉ
- Xóa địa chỉ
- Xem danh sách địa chỉ

### **B. Chức năng dành cho Admin**

#### 1. **Dashboard & Analytics**
- Thống kê doanh thu
- Thống kê đơn hàng
- Thống kê khách hàng
- Biểu đồ phân tích

#### 2. **Quản lý sản phẩm (Products)**
- CRUD sản phẩm (Create, Read, Update, Delete)
- Quản lý variants (size, color, price, stock)
- Upload và quản lý hình ảnh sản phẩm
- Quản lý danh mục sản phẩm
- Theo dõi tồn kho

#### 3. **Quản lý danh mục (Categories)**
- CRUD danh mục
- Hỗ trợ danh mục cha-con (nested categories)
- Quản lý cây danh mục

#### 4. **Quản lý đơn hàng (Orders)**
- Xem tất cả đơn hàng
- Lọc đơn hàng theo trạng thái
- Cập nhật trạng thái đơn hàng:
  - Pending (chờ xử lý)
  - Processing (đang xử lý)
  - Shipped (đã giao vận)
  - Delivered (đã giao hàng)
  - Cancelled (đã hủy)
- Xem chi tiết đơn hàng

#### 5. **Quản lý người dùng Admin (Users)**
- Tạo admin user mới (tự động gửi email với password mặc định)
- Cập nhật thông tin admin user
- Kích hoạt/Vô hiệu hóa tài khoản
- Reset password (gửi email tự động)
- Xóa admin user

#### 6. **Quản lý khách hàng (Customers)**
- Xem danh sách khách hàng
- Tạo customer mới (tự động gửi email)
- Cập nhật thông tin customer
- Kích hoạt/Vô hiệu hóa tài khoản
- Reset password
- Xóa customer
- Xem lịch sử mua hàng của customer

#### 7. **Quản lý Upload**
- Upload ảnh lên Cloudinary
- Upload multiple images
- Xóa ảnh
- Giới hạn file size (5MB)
- Hỗ trợ format: jpeg, png, gif, webp

---

## 🔐 Hệ thống Authentication

### **JWT Token System**
- **Access Token**: 
  - Thời gian sống: 1 giờ (3600 giây)
  - Dùng để xác thực các API request
  
- **Refresh Token**: 
  - Thời gian sống: 7 ngày
  - Dùng để làm mới access token khi hết hạn

### **Authentication Flow**
1. User đăng nhập → Nhận access token + refresh token
2. Mỗi API request gửi kèm access token trong header
3. Khi access token hết hạn (401) → Tự động refresh
4. Nếu refresh token hết hạn → Redirect về login

### **Authorization (RBAC)**
- **Admin role**: Toàn quyền truy cập admin panel
- **Customer/User role**: Chỉ truy cập chức năng customer
- Middleware kiểm tra role trước khi cho phép truy cập

---

## 📊 Database Schema

### **Entities chính**

#### **User**
- id, username, email, phone
- firstName, lastName, avatar
- role_id (foreign key to Role)
- status (active/inactive)
- created_at, updated_at

#### **Role**
- id, name, description
- Roles: admin, user/customer

#### **Product**
- id, name, slug
- description, brand, status
- Many-to-many với Category
- One-to-many với ProductVariant
- One-to-many với ProductImage

#### **ProductVariant**
- id, product_id
- size, color, sku
- price, sale_price, stock_qty

#### **ProductImage**
- id, product_id
- url, alt_text, sort

#### **Category**
- id, name, slug
- description, parentId
- Hỗ trợ nested categories (cây phân cấp)

#### **Cart**
- id, userId (nullable cho guest)
- One-to-many với CartItem

#### **CartItem**
- id, cart_id, product_variant_id
- quantity

#### **Order**
- id, orderNumber, userId (nullable cho guest)
- status, totalAmount
- shippingAddress (JSON)
- One-to-many với OrderItem

#### **OrderItem**
- id, order_id, product_variant_id
- quantity, unit_price, total_price

#### **Address**
- id, user_id
- street, city, state, zip, country

---

## 🌐 API Endpoints (Summary)

### **Authentication APIs**
```
POST /identities/createuser           - Đăng ký
POST /identities/login                - Đăng nhập
POST /identities/refresh-token        - Refresh token
POST /identities/logout               - Đăng xuất
GET  /identities/profile              - Lấy profile
POST /identities/change-password      - Đổi password
POST /identities/update-user          - Cập nhật profile
```

### **Admin User Management APIs**
```
POST /identities/createuser-by-admin     - Tạo user (admin only)
POST /identities/update-user-by-admin    - Cập nhật user (admin only)
POST /identities/set-user-status         - Set trạng thái user
POST /identities/reset-password-by-admin - Reset password
POST /identities/delete-user             - Xóa user
GET  /identities/list-users              - Danh sách users
```

### **Products APIs**
```
GET    /products                    - Danh sách sản phẩm
GET    /products/:id                - Chi tiết sản phẩm
GET    /products/slug/:slug         - Sản phẩm theo slug
POST   /products                    - Tạo sản phẩm (admin)
PATCH  /products/:id                - Cập nhật sản phẩm (admin)
DELETE /products/:id                - Xóa sản phẩm (admin)
GET    /products/:id/variants       - Lấy variants
```

### **Categories APIs**
```
GET    /categories                  - Danh sách categories
GET    /categories/tree             - Cây categories
GET    /categories/:id              - Chi tiết category
GET    /categories/slug/:slug       - Category theo slug
POST   /categories                  - Tạo category (admin)
PATCH  /categories/:id              - Cập nhật category (admin)
DELETE /categories/:id              - Xóa category (admin)
```

### **Cart APIs**
```
GET    /cart                        - Giỏ hàng user
GET    /cart/guest/:cartId          - Giỏ hàng guest
POST   /cart/add                    - Thêm vào giỏ
POST   /cart/guest/add              - Thêm vào giỏ (guest)
PATCH  /cart/items/:itemId          - Cập nhật số lượng
DELETE /cart/items/:itemId          - Xóa item
DELETE /cart                        - Xóa giỏ hàng
```

### **Orders APIs**
```
POST   /orders/checkout             - Checkout (user)
POST   /orders/guest/checkout       - Checkout (guest)
GET    /orders/my-orders            - Đơn hàng của user
GET    /orders                      - Tất cả đơn hàng (admin)
GET    /orders/:id                  - Chi tiết đơn hàng
PATCH  /orders/:id                  - Cập nhật đơn hàng (admin)
DELETE /orders/:id                  - Hủy đơn hàng
```

### **Upload APIs**
```
GET    /upload/config               - Cấu hình upload
POST   /upload/image                - Upload 1 ảnh
POST   /upload/multiple             - Upload nhiều ảnh
DELETE /upload/delete               - Xóa ảnh
```

---

## 🎨 Giao diện người dùng

### **Client Pages (Customer)**
- `/` - Trang chủ
- `/login` - Đăng nhập
- `/signup` - Đăng ký
- `/products` - Danh sách sản phẩm
- `/products/:slug` - Chi tiết sản phẩm
- `/client/:category` - Sản phẩm theo danh mục
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán
- `/orders` - Lịch sử đơn hàng
- `/profile` - Thông tin cá nhân

### **Admin Pages**
- `/admin/` - Redirect to dashboard
- `/admin/dashboard` - Tổng quan thống kê
- `/admin/products` - Quản lý sản phẩm
- `/admin/categories` - Quản lý danh mục
- `/admin/orders` - Quản lý đơn hàng
- `/admin/users` - Quản lý admin users
- `/admin/customers` - Quản lý customers
- `/admin/analytics` - Phân tích & báo cáo
- `/admin/settings` - Cài đặt hệ thống

---

## 🔒 Security Features

1. **Authentication Security**
   - Password hashing (bcrypt)
   - JWT token với expiry
   - Refresh token rotation
   - Token invalidation on logout

2. **Authorization**
   - Role-based access control
   - Route protection (middleware)
   - API endpoint protection
   - Admin panel access control

3. **Data Validation**
   - Input validation (Zod, class-validator)
   - SQL injection prevention (Prisma ORM)
   - XSS protection
   - CSRF protection

4. **File Upload Security**
   - File type validation
   - File size limits (5MB)
   - Cloudinary secure upload

---

## 📧 Email Features

### **Automated Email Notifications**

1. **Admin tạo user mới**
   - Gửi email chứa thông tin đăng nhập
   - Username và email
   - Password mặc định: `Clothesshop123@`
   - Khuyến nghị đổi password

2. **Reset password bởi admin**
   - Reset về password mặc định
   - Gửi email thông báo password mới
   - Khuyến nghị đổi password ngay

---

## 🚀 Tech Stack Summary

### **Frontend**
- Next.js 15, React 19, TypeScript
- Tailwind CSS, Shadcn/ui
- Framer Motion, React Hook Form
- Axios, Zod

### **Backend**
- NestJS, TypeScript
- PostgreSQL, Prisma ORM
- JWT, bcrypt
- Cloudinary, Nodemailer

### **DevOps**
- Git, GitHub
- npm/pnpm
- ESLint, Prettier

---

## 📦 Project Structure

```
prj-clothes-shop-frontend/
├── app/                        # Next.js App Router
│   ├── admin/                 # Admin pages
│   ├── client/                # Client pages
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   └── layout.tsx             # Root layout
├── components/                # React components
│   ├── admin/                # Admin components
│   ├── auth/                 # Auth components
│   ├── client/               # Client components
│   └── ui/                   # Shadcn UI components
├── lib/                       # Utilities
│   ├── api.ts                # API service layer
│   └── utils.ts              # Helper functions
├── hooks/                     # Custom React hooks
└── public/                    # Static assets
```

---

## 🎯 Tính năng nổi bật

1. **Full-stack E-commerce Solution**
   - Hoàn chỉnh từ frontend đến backend
   - RESTful API architecture
   - Real-time data updates

2. **Modern Tech Stack**
   - Latest Next.js 15 với App Router
   - React 19 với TypeScript
   - NestJS backend framework

3. **User Experience**
   - Responsive design (mobile-first)
   - Fast page loads (Next.js optimization)
   - Smooth animations (Framer Motion)
   - Intuitive UI/UX

4. **Admin Dashboard**
   - Comprehensive management tools
   - Real-time analytics
   - Efficient product management
   - Order tracking system

5. **Security First**
   - JWT authentication
   - Role-based authorization
   - Secure file upload
   - Input validation

6. **Scalability**
   - Modular architecture
   - Database optimization with Prisma
   - Cloud-based file storage
   - Efficient state management

---

## 📝 Notes

- **Môi trường**: Development
- **Backend URL**: http://159.223.72.68:31977
- **Database**: PostgreSQL (hosted)
- **File Storage**: Cloudinary
- **Email Service**: Configured với Nodemailer

---

## 🎓 Kết luận

Đây là một dự án e-commerce hoàn chỉnh với đầy đủ chức năng cần thiết cho một cửa hàng quần áo trực tuyến. Hệ thống được xây dựng với kiến trúc hiện đại, bảo mật tốt, và khả năng mở rộng cao. Phù hợp cho mục đích học tập, nghiên cứu, hoặc triển khai thực tế cho doanh nghiệp vừa và nhỏ.
