# E-commerce Backend API Documentation

## Tổng quan
Backend API cho website bán quần áo được xây dựng bằng NestJS, Prisma ORM và PostgreSQL.

## Modules đã được triển khai

### 1. Products Module (`/products`)
Quản lý sản phẩm, biến thể sản phẩm và hình ảnh.

**Endpoints chính:**
- `GET /products` - Lấy danh sách sản phẩm với phân trang và filter
- `GET /products/:id` - Lấy thông tin sản phẩm theo ID
- `GET /products/slug/:slug` - Lấy sản phẩm theo slug
- `POST /products` - Tạo sản phẩm mới (Admin only)
- `PATCH /products/:id` - Cập nhật sản phẩm (Admin only)
- `DELETE /products/:id` - Xóa sản phẩm (Admin only)
- `GET /products/:id/variants` - Lấy các biến thể của sản phẩm
- `PATCH /products/:id/variants/:variantId/stock` - Cập nhật tồn kho (Admin only)

**Query Parameters:**
- `search` - Tìm kiếm theo tên, mô tả, brand
- `categoryId` - Filter theo danh mục
- `brand` - Filter theo thương hiệu
- `status` - Filter theo trạng thái (active/inactive)
- `page` - Trang (default: 1)
- `limit` - Số lượng mỗi trang (default: 10)
- `sortBy` - Sắp xếp theo field (default: created_at)
- `sortOrder` - Thứ tự sắp xếp (asc/desc, default: desc)

### 2. Categories Module (`/categories`)
Quản lý danh mục sản phẩm với cấu trúc cây (parent-child).

**Endpoints chính:**
- `GET /categories` - Lấy danh sách danh mục
- `GET /categories/tree` - Lấy cấu trúc cây danh mục
- `GET /categories/:id` - Lấy thông tin danh mục theo ID
- `GET /categories/slug/:slug` - Lấy danh mục theo slug
- `GET /categories/:id/products` - Lấy sản phẩm trong danh mục
- `POST /categories` - Tạo danh mục mới (Admin only)
- `PATCH /categories/:id` - Cập nhật danh mục (Admin only)
- `DELETE /categories/:id` - Xóa danh mục (Admin only)

**Query Parameters:**
- `search` - Tìm kiếm theo tên, mô tả
- `parentId` - Filter theo danh mục cha
- `includeProducts` - Bao gồm thông tin sản phẩm (true/false)
- `onlyParents` - Chỉ lấy danh mục cha (true/false)
- `includeSubcategories` - Bao gồm sản phẩm từ danh mục con (true/false)

### 3. Cart Module (`/cart`)
Quản lý giỏ hàng cho cả user đã đăng nhập và guest.

**Endpoints chính:**
- `GET /cart` - Lấy giỏ hàng của user đã đăng nhập
- `GET /cart/guest/:cartId` - Lấy giỏ hàng guest
- `POST /cart/add` - Thêm sản phẩm vào giỏ hàng (user)
- `POST /cart/guest/add` - Thêm sản phẩm vào giỏ hàng guest
- `PATCH /cart/items/:itemId` - Cập nhật số lượng item (user)
- `PATCH /cart/guest/items/:itemId` - Cập nhật số lượng item guest
- `DELETE /cart/items/:itemId` - Xóa item khỏi giỏ hàng (user)
- `DELETE /cart/guest/items/:itemId` - Xóa item khỏi giỏ hàng guest
- `DELETE /cart/clear` - Xóa toàn bộ giỏ hàng (user)
- `DELETE /cart/guest/:cartId/clear` - Xóa toàn bộ giỏ hàng guest
- `POST /cart/merge/:guestCartId` - Merge giỏ hàng guest với user sau khi đăng nhập

**Headers:**
- `x-guest-cart-id` - ID giỏ hàng cho guest user

### 4. Orders Module (`/orders`)
Quản lý đơn hàng và checkout process.

**Endpoints chính:**
- `POST /orders` - Tạo đơn hàng trực tiếp
- `POST /orders/checkout` - Tạo đơn hàng từ giỏ hàng (user)
- `POST /orders/guest/checkout` - Tạo đơn hàng từ giỏ hàng guest
- `GET /orders` - Lấy tất cả đơn hàng (Admin only)
- `GET /orders/my-orders` - Lấy đơn hàng của user hiện tại
- `GET /orders/:id` - Lấy thông tin đơn hàng theo ID
- `GET /orders/order-number/:orderNumber` - Lấy đơn hàng theo order number
- `PATCH /orders/:id` - Cập nhật trạng thái đơn hàng
- `PATCH /orders/admin/:id` - Cập nhật đơn hàng (Admin only)

**Order Status:**
- `pending` - Chờ xử lý
- `confirmed` - Đã xác nhận
- `shipped` - Đã giao vận
- `delivered` - Đã giao hàng
- `cancelled` - Đã hủy

### 5. Address Module (`/address`)
Quản lý địa chỉ giao hàng của user.

**Endpoints chính:**
- `GET /address` - Lấy địa chỉ của user hiện tại
- `GET /address/all` - Lấy tất cả địa chỉ (Admin only)
- `GET /address/stats` - Thống kê địa chỉ (Admin only)
- `GET /address/:id` - Lấy địa chỉ theo ID
- `POST /address` - Tạo địa chỉ mới
- `PATCH /address/:id` - Cập nhật địa chỉ
- `DELETE /address/:id` - Xóa địa chỉ

## Authentication & Authorization

### Guards:
- `AuthGuard` - Xác thực JWT token
- `RolesGuard` - Phân quyền theo role (admin/user)

### Roles:
- `admin` - Full access to all endpoints
- `user` - Limited access, only own data

### Headers:
- `Authorization: Bearer <jwt_token>` - Required for authenticated endpoints
- `x-guest-cart-id` - Optional for cart operations without authentication

## Data Models

### Product
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "description": "string",
  "brand": "string",
  "status": "active|inactive",
  "categories": [Category],
  "variants": [ProductVariant],
  "images": [ProductImage]
}
```

### ProductVariant
```json
{
  "id": "uuid",
  "size": "string",
  "color": "string", 
  "sku": "string",
  "price": "decimal",
  "sale_price": "decimal",
  "stock_qty": "number"
}
```

### Category
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "description": "string",
  "parentId": "uuid",
  "children": [Category],
  "products": [Product]
}
```

### Order
```json
{
  "id": "uuid",
  "order_number": "string",
  "status": "pending|confirmed|shipped|delivered|cancelled",
  "total_amount": "decimal",
  "shipping_address": "json",
  "items": [OrderItem]
}
```

### Cart
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "items": [CartItem],
  "subtotal": "number",
  "totalQuantity": "number",
  "itemCount": "number"
}
```

## Error Handling

API sử dụng HTTP status codes chuẩn:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

Error response format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Features

### Stock Management
- Tự động giảm tồn kho khi tạo đơn hàng
- Khôi phục tồn kho khi hủy đơn hàng
- Kiểm tra tồn kho trước khi thêm vào giỏ hàng

### Guest Support
- Giỏ hàng cho guest user
- Checkout không cần đăng nhập
- Merge giỏ hàng khi đăng nhập

### Business Logic
- Slug unique cho products và categories
- Category hierarchy (parent-child)
- Product variants với size, color, pricing
- Order number generation tự động
- Shipping address JSON storage

## API Documentation
Swagger UI có thể truy cập tại `/api` khi chạy development server.

## Next Steps
1. Implement payment integration
2. Add email notifications
3. Implement product reviews
4. Add coupon/discount system
5. Implement shipping methods
6. Add inventory alerts
7. Implement analytics and reporting