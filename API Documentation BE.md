# API Documentation - Clothes Shop Backend

Base URL: `http://localhost:4000`  
Swagger UI: `http://localhost:4000/api`

## 📋 Mục Lục

1. [Authentication](#authentication)
2. [Products](#products)
3. [Categories](#categories)
4. [Cart](#cart)
5. [Orders](#orders)
6. [Address](#address)
7. [Upload](#upload)

---

## 🔐 Authentication

### 1. Đăng ký tài khoản mới
```http
POST /identities/createuser
```

**Body:**
```json
{
  "username": "johndoe",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "phone": "+84901234567",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+84901234567"
}
```

### 2. Đăng nhập
```http
POST /identities/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Lưu ý:**
- `accessToken`: Token để truy cập API, hết hạn sau 1 giờ (3600 giây)
- `refreshToken`: Token để làm mới accessToken, hết hạn sau 7 ngày
- `expiresIn`: Thời gian sống của accessToken (giây)
- Lưu cả 2 tokens vào localStorage/sessionStorage

### 3. Làm mới Access Token (Refresh Token)
```http
POST /identities/refresh-token
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Khi nào sử dụng:**
- Khi accessToken hết hạn (API trả về 401)
- Sử dụng refreshToken để lấy accessToken mới mà không cần đăng nhập lại
- Frontend nên tự động refresh token khi nhận 401 error

**Lưu ý:**
- Không cần Authorization header (vì accessToken đã hết hạn)
- RefreshToken chỉ dùng được 1 lần, sau đó cần dùng token mới
- Nếu refreshToken hết hạn/không hợp lệ → redirect về trang login

### 4. Đăng xuất
```http
POST /identities/logout
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Chức năng:**
- Xóa accessToken và refreshToken khỏi server cache
- Token sẽ không còn hợp lệ ngay lập tức
- Frontend cần xóa tokens khỏi localStorage sau khi logout thành công

### 5. Lấy thông tin profile đầy đủ
```http
GET /identities/profile
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+84901234567",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://cloudinary.com/...",
  "status": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z",
  "role": {
    "id": "uuid",
    "name": "user",
    "description": "Regular user role"
  },
  "address": [
    {
      "id": "uuid",
      "street": "123 Nguyễn Huệ",
      "city": "Hồ Chí Minh",
      "state": "Quận 1",
      "zip": "700000",
      "country": "Vietnam"
    }
  ]
}
```

**Lưu ý:** 
- API này trả về đầy đủ thông tin user từ database (không chỉ từ JWT token)
- Bao gồm cả danh sách địa chỉ và thông tin role chi tiết

### 6. Cập nhật thông tin profile (Client)
```http
POST /identities/update-user
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+84901234567",
  "avatar": "https://cloudinary.com/..."
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+84901234567",
    "avatar": "https://..."
  }
}
```

**Lưu ý:**
- User chỉ có thể cập nhật thông tin của chính mình
- Không thể thay đổi: username, email, role
- Tất cả fields đều optional

### 7. Thêm/Cập nhật địa chỉ (Client)
```http
POST /identities/update-address
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "street": "123 Nguyễn Huệ",
  "city": "Hồ Chí Minh",
  "state": "Quận 1",
  "zip": "700000",
  "country": "Vietnam"
}
```

**Response:**
```json
{
  "message": "Address added successfully",
  "address": {
    "id": "uuid",
    "user_id": "uuid",
    "street": "123 Nguyễn Huệ",
    "city": "Hồ Chí Minh",
    "state": "Quận 1",
    "zip": "700000",
    "country": "Vietnam"
  }
}
```

### 8. Đổi mật khẩu
```http
POST /identities/change-password
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

### 9. Tạo user bởi Admin (Admin only) 📧
```http
POST /identities/createuser-by-admin
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "username": "johndoe",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "phone": "+84901234567",
  "role": "user"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+84901234567",
  "role": {
    "name": "user"
  }
}
```

**📧 Tính năng Email:**
- Sau khi tạo user thành công, hệ thống tự động gửi email đến địa chỉ của user
- Email chứa thông tin đăng nhập:
  - Username
  - Email
  - Mật khẩu mặc định: `Clothesshop123@`
- User được khuyến nghị đổi mật khẩu ngay sau lần đăng nhập đầu tiên

### 10. Danh sách người dùng (Admin only)
```http
GET /identities/list-users?page=1&limit=10&role_id=uuid&sortBy=created_at&sortOrder=desc
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (optional): Số trang, mặc định 1
- `limit` (optional): Số lượng items/trang, mặc định 10
- `role_id` (optional): Lọc theo role ID
- `sortBy` (optional): Sắp xếp theo field, mặc định 'created_at'
- `sortOrder` (optional): Thứ tự sắp xếp 'asc' hoặc 'desc', mặc định 'desc'

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "phone": "+84901234567",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://...",
      "status": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z",
      "role": {
        "id": "uuid",
        "name": "user",
        "description": "Regular user"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 11. Cập nhật thông tin user (Admin only)
```http
POST /identities/update-user-by-admin?userId=uuid
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `userId` (required): ID của user cần cập nhật

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+84901234567",
  "avatar": "https://cloudinary.com/...",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+84901234567",
    "avatar": "https://...",
    "role": {
      "name": "user"
    }
  }
}
```

**Lưu ý:**
- Admin có thể cập nhật tất cả thông tin user kể cả role
- Tất cả fields đều optional
- Không thể thay đổi: username, email

### 12. Đặt trạng thái user (Admin only)
```http
POST /identities/set-user-status?userId=uuid&status=true
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `userId` (required): ID của user cần thay đổi trạng thái
- `status` (required): Trạng thái mới - `true` (active) hoặc `false` (inactive)

**Ví dụ:**
```http
POST /identities/set-user-status?userId=abc-123&status=false
```

**Response:**
```json
{
  "message": "User status updated successfully"
}
```

**Chức năng:**
- Kích hoạt (`status=true`) hoặc vô hiệu hóa (`status=false`) tài khoản user
- Khi `status=false`, user không thể đăng nhập vào hệ thống
- Chỉ admin mới có quyền thực hiện

### 13. Reset mật khẩu user (Admin only) 📧
```http
POST /identities/reset-password-by-admin?userId=uuid
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `userId` (required): ID của user cần reset mật khẩu

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

**📧 Tính năng Email:**
- Reset mật khẩu về mặc định: `Clothesshop123@`
- Tự động gửi email thông báo mật khẩu mới cho user
- User được khuyến nghị đổi mật khẩu ngay sau khi nhận được email

**Chức năng:**
- Admin reset mật khẩu user khi user quên mật khẩu
- Mật khẩu sẽ được đặt lại về mặc định
- Chỉ admin mới có quyền thực hiện

### 14. Xóa user (Admin only)
```http
POST /identities/delete-user?userId=uuid
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `userId` (required): ID của user cần xóa

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Cảnh báo:**
- Thao tác này sẽ xóa vĩnh viễn user và tất cả dữ liệu liên quan
- Nên sử dụng API "Đặt trạng thái user" để vô hiệu hóa thay vì xóa
- Chỉ admin mới có quyền thực hiện

---

## 🛍️ Products

### 1. Lấy danh sách sản phẩm
```http
GET /products?page=1&limit=12&category=uuid&minPrice=100000&maxPrice=500000&brand=Nike&status=active
```

**Query Parameters:**
- `page` (optional): Số trang, mặc định 1
- `limit` (optional): Số lượng items/trang, mặc định 12
- `category` (optional): ID của category
- `minPrice` (optional): Giá tối thiểu
- `maxPrice` (optional): Giá tối đa
- `brand` (optional): Thương hiệu
- `status` (optional): Trạng thái (active/inactive)
- `search` (optional): Tìm kiếm theo tên

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Áo thun basic",
      "slug": "ao-thun-basic",
      "description": "Áo thun cotton 100%",
      "brand": "Nike",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "categories": [
        {
          "id": "uuid",
          "name": "Áo thun"
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "size": "M",
          "color": "Đen",
          "sku": "AT-001-M-BLACK",
          "price": "250000",
          "sale_price": "200000",
          "stock_qty": 50
        }
      ],
      "images": [
        {
          "url": "https://...",
          "alt_text": "Áo thun đen",
          "sort": 0
        }
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

### 2. Lấy chi tiết sản phẩm theo ID
```http
GET /products/{id}
```

### 3. Lấy sản phẩm theo slug
```http
GET /products/slug/{slug}
```

**Ví dụ:** `/products/slug/ao-thun-basic`

### 4. Lấy các variant của sản phẩm
```http
GET /products/{id}/variants
```

### 5. Tạo sản phẩm mới (Admin only)
```http
POST /products
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "name": "Áo thun basic",
  "slug": "ao-thun-basic",
  "description": "Áo thun cotton 100%",
  "brand": "Nike",
  "status": "active",
  "categoryIds": ["uuid1", "uuid2"],
  "variants": [
    {
      "size": "M",
      "color": "Đen",
      "sku": "AT-001-M-BLACK",
      "price": 250000,
      "sale_price": 200000,
      "stock_qty": 50
    }
  ],
  "images": [
    {
      "url": "https://cloudinary.com/...",
      "alt_text": "Áo thun đen",
      "sort": 0
    }
  ]
}
```

### 6. Cập nhật sản phẩm (Admin only)
```http
PATCH /products/{id}
Authorization: Bearer {access_token}
```

**Body:** Giống như tạo sản phẩm, nhưng tất cả fields đều optional

### 7. Xóa sản phẩm (Admin only)
```http
DELETE /products/{id}
Authorization: Bearer {access_token}
```

---

## 📂 Categories

### 1. Lấy danh sách categories
```http
GET /categories?includeProducts=true
```

**Query Parameters:**
- `includeProducts` (optional): true/false, mặc định false

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Áo",
      "slug": "ao",
      "description": "Các loại áo",
      "parentId": null,
      "children": [
        {
          "id": "uuid",
          "name": "Áo thun",
          "slug": "ao-thun"
        }
      ]
    }
  ]
}
```

### 2. Lấy cấu trúc cây categories
```http
GET /categories/tree
```

### 3. Lấy category theo slug
```http
GET /categories/slug/{slug}?includeProducts=true
```

### 4. Lấy category theo ID
```http
GET /categories/{id}?includeProducts=true
```

### 5. Lấy sản phẩm theo category
```http
GET /categories/{id}/products?includeSubcategories=true
```

**Query Parameters:**
- `includeSubcategories` (optional): Bao gồm cả sản phẩm từ subcategories, mặc định false

### 6. Tạo category mới (Admin only)
```http
POST /categories
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "name": "Áo thun",
  "slug": "ao-thun",
  "description": "Các loại áo thun",
  "parentId": "uuid-category-cha" // optional
}
```

### 7. Cập nhật category (Admin only)
```http
PATCH /categories/{id}
Authorization: Bearer {access_token}
```

### 8. Xóa category (Admin only)
```http
DELETE /categories/{id}
Authorization: Bearer {access_token}
```

---

## 🛒 Cart

### 1. Lấy giỏ hàng (User đã đăng nhập)
```http
GET /cart
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "items": [
    {
      "id": "uuid",
      "quantity": 2,
      "productVariant": {
        "id": "uuid",
        "size": "M",
        "color": "Đen",
        "price": "250000",
        "sale_price": "200000",
        "stock_qty": 50,
        "product": {
          "name": "Áo thun basic",
          "slug": "ao-thun-basic",
          "images": [
            {
              "url": "https://..."
            }
          ]
        }
      }
    }
  ],
  "totalItems": 2,
  "subtotal": "400000"
}
```

### 2. Lấy giỏ hàng (Guest - chưa đăng nhập)
```http
GET /cart/guest/{cartId}
```

### 3. Thêm sản phẩm vào giỏ (User đã đăng nhập)
```http
POST /cart/add
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "productVariantId": "uuid",
  "quantity": 2
}
```

### 4. Thêm sản phẩm vào giỏ (Guest)
```http
POST /cart/guest/add
Headers:
  x-guest-cart-id: optional-cart-id
```

**Body:** Giống như user đã đăng nhập

**Response sẽ trả về `cartId` để lưu vào localStorage:**
```json
{
  "id": "uuid-cart-id",
  "items": [...],
  "message": "Item added to cart"
}
```

### 5. Cập nhật số lượng sản phẩm
```http
PATCH /cart/items/{itemId}
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "quantity": 5
}
```

### 6. Cập nhật số lượng (Guest)
```http
PATCH /cart/guest/items/{itemId}
Headers:
  x-guest-cart-id: cart-id-from-localstorage
```

### 7. Xóa sản phẩm khỏi giỏ
```http
DELETE /cart/items/{itemId}
Authorization: Bearer {access_token}
```

### 8. Xóa sản phẩm khỏi giỏ (Guest)
```http
DELETE /cart/guest/items/{itemId}
Headers:
  x-guest-cart-id: cart-id-from-localstorage
```

### 9. Xóa toàn bộ giỏ hàng
```http
DELETE /cart
Authorization: Bearer {access_token}
```

### 10. Xóa giỏ hàng (Guest)
```http
DELETE /cart/guest/{cartId}
```

---

## 📦 Orders

### 1. Tạo đơn hàng từ giỏ hàng (Checkout - User)
```http
POST /orders/checkout
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Nguyễn Huệ",
    "city": "Hồ Chí Minh",
    "state": "Quận 1",
    "zip": "700000",
    "country": "Vietnam"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "orderNumber": "ORD-20240101-001",
  "userId": "uuid",
  "status": "pending",
  "totalAmount": "400000",
  "shippingAddress": {...},
  "items": [
    {
      "productVariant": {...},
      "quantity": 2,
      "unitPrice": "200000",
      "totalPrice": "400000"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 2. Tạo đơn hàng (Guest)
```http
POST /orders/guest/checkout
```

**Body:**
```json
{
  "cartId": "uuid-guest-cart-id",
  "shippingAddress": {...}
}
```

### 3. Lấy đơn hàng của user hiện tại
```http
GET /orders/my-orders?page=1&limit=10&status=pending
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số items/trang
- `status` (optional): pending, processing, shipped, delivered, cancelled

### 4. Lấy tất cả đơn hàng (Admin only)
```http
GET /orders?page=1&limit=10&status=pending
Authorization: Bearer {access_token}
```

### 5. Lấy chi tiết đơn hàng theo order number
```http
GET /orders/order-number/{orderNumber}
```

**Ví dụ:** `/orders/order-number/ORD-20240101-001`

### 6. Lấy chi tiết đơn hàng theo ID
```http
GET /orders/{id}
Authorization: Bearer {access_token}
```

### 7. Cập nhật trạng thái đơn hàng (Admin only)
```http
PATCH /orders/{id}
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "status": "processing"
}
```

**Các trạng thái hợp lệ:**
- `pending`: Chờ xử lý
- `processing`: Đang xử lý
- `shipped`: Đã giao cho vận chuyển
- `delivered`: Đã giao hàng
- `cancelled`: Đã hủy

### 8. Hủy đơn hàng
```http
DELETE /orders/{id}
Authorization: Bearer {access_token}
```

---

## 📍 Address

**Lưu ý:** Tất cả endpoints address đều yêu cầu authentication

### 1. Lấy địa chỉ của user hiện tại
```http
GET /address
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "street": "123 Nguyễn Huệ",
      "city": "Hồ Chí Minh",
      "state": "Quận 1",
      "zip": "700000",
      "country": "Vietnam"
    }
  ]
}
```

### 2. Tạo địa chỉ mới
```http
POST /address
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "street": "123 Nguyễn Huệ",
  "city": "Hồ Chí Minh",
  "state": "Quận 1",
  "zip": "700000",
  "country": "Vietnam"
}
```

### 3. Lấy chi tiết địa chỉ theo ID
```http
GET /address/{id}
Authorization: Bearer {access_token}
```

### 4. Cập nhật địa chỉ
```http
PATCH /address/{id}
Authorization: Bearer {access_token}
```

**Body:** Giống như tạo mới, tất cả fields đều optional

### 5. Xóa địa chỉ
```http
DELETE /address/{id}
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "message": "Address deleted successfully"
}
```

**Lưu ý:**
- User chỉ có thể xóa địa chỉ của chính mình
- Admin có thể xóa địa chỉ của bất kỳ user nào

### 6. Lấy tất cả địa chỉ (Admin only)
```http
GET /address/all
Authorization: Bearer {access_token}
```

### 7. Thống kê địa chỉ (Admin only)
```http
GET /address/stats
Authorization: Bearer {access_token}
```

---

## 📤 Upload

### 1. Lấy cấu hình upload
```http
GET /upload/config
```

**Response:**
```json
{
  "allowedFormats": ["jpeg", "png", "gif", "webp"],
  "maxFileSize": 5242880,
  "maxFileSizeMB": 5,
  "maxFiles": 10
}
```

### 2. Upload ảnh đơn
```http
POST /upload/image
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File ảnh (jpeg, png, gif, webp, max 5MB)
- `folder`: Tên folder (optional, mặc định: "products")

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/products/abc.jpg",
    "originalName": "product.jpg",
    "size": 245760,
    "mimeType": "image/jpeg"
  }
}
```

### 3. Upload nhiều ảnh
```http
POST /upload/multiple
Content-Type: multipart/form-data
```

**Form Data:**
- `files`: Nhiều file ảnh (tối đa 10 files)
- `folder`: Tên folder (optional)

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": [
    {
      "url": "https://...",
      "originalName": "product1.jpg",
      "size": 245760,
      "mimeType": "image/jpeg"
    },
    {
      "url": "https://...",
      "originalName": "product2.jpg",
      "size": 198432,
      "mimeType": "image/jpeg"
    }
  ]
}
```

### 4. Xóa ảnh từ Cloudinary
```http
DELETE /upload/delete?url=https://res.cloudinary.com/.../abc.jpg
```

**Query Parameters:**
- `url`: URL đầy đủ của ảnh cần xóa

---

## 🔑 Authentication Flow cho Frontend

### Cho User đã đăng nhập:

1. **Đăng nhập:**
   - POST `/identities/login`
   - Lưu `accessToken` và `refreshToken` vào localStorage
   ```javascript
   const { accessToken, refreshToken, expiresIn } = await login(email, password);
   localStorage.setItem('access_token', accessToken);
   localStorage.setItem('refresh_token', refreshToken);
   ```

2. **Sử dụng API:**
   - Thêm header: `Authorization: Bearer {access_token}`

3. **Xử lý khi Access Token hết hạn (401):**
   ```javascript
   // Interceptor xử lý 401 error
   api.interceptors.response.use(
     response => response,
     async error => {
       if (error.response?.status === 401) {
         const refreshToken = localStorage.getItem('refresh_token');
         
         try {
           // Refresh token
           const { accessToken } = await refreshAccessToken(refreshToken);
           localStorage.setItem('access_token', accessToken);
           
           // Retry request với token mới
           error.config.headers.Authorization = `Bearer ${accessToken}`;
           return api.request(error.config);
         } catch (refreshError) {
           // Refresh token cũng hết hạn → redirect login
           localStorage.clear();
           window.location.href = '/login';
         }
       }
       return Promise.reject(error);
     }
   );
   ```

4. **Đăng xuất:**
   - POST `/identities/logout`
   - Xóa tokens khỏi localStorage
   ```javascript
   await logout();
   localStorage.removeItem('access_token');
   localStorage.removeItem('refresh_token');
   ```

### Cho Guest (chưa đăng nhập):

1. **Sử dụng giỏ hàng:**
   - POST `/cart/guest/add` lần đầu
   - Lưu `cartId` trả về vào localStorage
   - Các lần sau thêm header: `x-guest-cart-id: {cartId}`

2. **Checkout:**
   - POST `/orders/guest/checkout` với `cartId`

3. **Khi đăng nhập:**
   - Gọi API merge cart (nếu có) hoặc clear guest cart

---

## 💡 Lưu ý quan trọng

1. **CORS:** API đã enable CORS với `origin: '*'`, phù hợp cho development

2. **Validation:** Tất cả endpoints đều có validation, sẽ trả về 400 Bad Request nếu dữ liệu không hợp lệ

3. **Pagination:** Các endpoints list đều support pagination với `page` và `limit`

4. **File Upload:**
   - Max file size: 5MB
   - Allowed formats: jpeg, png, gif, webp
   - Max files: 10 files/request

5. **Authorization:**
   - Endpoints có `(Admin only)` chỉ admin mới truy cập được
   - Endpoints có `Authorization: Bearer {access_token}` yêu cầu đăng nhập

6. **Status Codes:**
   - `200`: Success
   - `201`: Created
   - `400`: Bad Request (validation error)
   - `401`: Unauthorized (chưa đăng nhập hoặc token hết hạn)
   - `403`: Forbidden (không có quyền)
   - `404`: Not Found
   - `409`: Conflict (trùng lặp dữ liệu)

---

## 🚀 Quick Start cho Frontend

### Ví dụ sử dụng với Axios:

```javascript
// Cấu hình axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor thêm token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ví dụ: Lấy danh sách sản phẩm
const getProducts = async (page = 1, limit = 12) => {
  try {
    const response = await api.get('/products', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data);
  }
};

// Ví dụ: Thêm vào giỏ hàng
const addToCart = async (productVariantId, quantity) => {
  try {
    const response = await api.post('/cart/add', {
      productVariantId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data);
  }
};

// Ví dụ: Upload ảnh
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'products');

  try {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data);
  }
};
```

### Ví dụ với Fetch API:

```javascript
// Login
async function login(email, password) {
  const response = await fetch('http://localhost:4000/identities/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.accessToken) {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
  }
  
  return data;
}

// Refresh Token
async function refreshAccessToken(refreshToken) {
  const response = await fetch('http://localhost:4000/identities/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });
  
  return await response.json();
}

// Logout
async function logout() {
  const token = localStorage.getItem('access_token');
  
  await fetch('http://localhost:4000/identities/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// Get Products
async function getProducts(page = 1) {
  const response = await fetch(
    `http://localhost:4000/products?page=${page}&limit=12`
  );
  return await response.json();
}

// Add to Cart (with auth)
async function addToCart(productVariantId, quantity) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:4000/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productVariantId, quantity })
  });
  
  return await response.json();
}
```

---

## 📊 Database Schema Chính

### User
- id, username, email, phone
- firstName, lastName, avatar
- role_id, status
- created_at, updated_at

### Product
- id, name, slug
- description, brand, status
- categories (many-to-many)
- variants (one-to-many)
- images (one-to-many)

### ProductVariant
- id, product_id
- size, color, sku
- price, sale_price, stock_qty

### Category
- id, name, slug
- description, parentId
- Hỗ trợ nested categories (tree structure)

### Cart
- id, userId (nullable cho guest)
- items (one-to-many CartItem)

### Order
- id, orderNumber, userId (nullable)
- status, totalAmount
- shippingAddress (JSON)
- items (one-to-many OrderItem)

---

Để xem chi tiết đầy đủ về request/response, hãy truy cập Swagger UI tại: `http://localhost:4000/api`
