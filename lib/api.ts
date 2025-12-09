// API service layer for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://159.223.72.68:31977';

// Types matching the new backend schema
export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  role_id: string;
  status: boolean;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  role?: Role;
  address?: Address[];
}

export interface Address {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  brand?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string | null;
  color?: string | null;
  sku: string;
  price: string;
  sale_price?: string | null;
  stock_qty: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

// Request DTOs
export interface CreateProductDto {
  name: string;
  slug?: string;
  description: string;
  brand?: string;
  status: string;
  categoryIds?: string[];
  variants: {
    size?: string;
    color?: string;
    sku: string;
    price: string;
    sale_price?: string;
    stock_qty: number;
  }[];
  images?: {
    url: string;
    alt_text?: string;
    sort: number;
  }[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  sort: number;
}

export interface Cart {
  id: string;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
  subtotal?: number;
  totalQuantity?: number;
  itemCount?: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_variant_id: string;
  quantity: number;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  user_id?: string | null;
  order_number: string;
  status: string;
  total_amount: string;
  shipping_address?: any;
  created_at: string;
  updated_at: string;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  variant?: ProductVariant;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Utility function to get auth headers
const getAuthHeaders = async () => {
  const token = localStorage.getItem("token");
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// API Service Class
export class ApiService {
  // Generic API request method
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?expired=true';
        }
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authenticated request method
  private static async authenticatedRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await getAuthHeaders();
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  }

  // ============ PRODUCTS API ============
  static async getProducts(params?: {
    search?: string;
    categoryId?: string;
    brand?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  static async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  static async getProductBySlug(slug: string): Promise<Product> {
    return this.request<Product>(`/products/slug/${slug}`);
  }

  static async createProduct(data: CreateProductDto): Promise<Product> {
    return this.authenticatedRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    return this.authenticatedRequest<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteProduct(id: string): Promise<void> {
    return this.authenticatedRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  static async getProductVariants(id: string): Promise<ProductVariant[]> {
    return this.request<ProductVariant[]>(`/products/${id}/variants`);
  }

  static async updateVariantStock(
    productId: string, 
    variantId: string, 
    stockQty: number
  ): Promise<ProductVariant> {
    return this.authenticatedRequest<ProductVariant>(
      `/products/${productId}/variants/${variantId}/stock`, 
      {
        method: 'PATCH',
        body: JSON.stringify({ stock_qty: stockQty }),
      }
    );
  }

  // ============ CATEGORIES API ============
  static async getCategories(params?: {
    search?: string;
    parentId?: string;
    includeProducts?: boolean;
    onlyParents?: boolean;
  }): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request<Category[]>(endpoint);
  }

  static async getCategoryTree(): Promise<Category[]> {
    return this.request<Category[]>('/categories/tree');
  }

  static async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  static async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/categories/slug/${slug}`);
  }

  static async getCategoryProducts(
    id: string,
    params?: {
      includeSubcategories?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/categories/${id}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  static async createCategory(data: Partial<Category>): Promise<Category> {
    return this.authenticatedRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return this.authenticatedRequest<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteCategory(id: string): Promise<void> {
    return this.authenticatedRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ ORDERS API ============
  static async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  }): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.authenticatedRequest<PaginatedResponse<Order>>(endpoint);
  }

  static async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/orders/my-orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.authenticatedRequest<PaginatedResponse<Order>>(endpoint);
  }

  static async getOrder(id: string): Promise<Order> {
    return this.authenticatedRequest<Order>(`/orders/${id}`);
  }

  static async getOrderByNumber(orderNumber: string): Promise<Order> {
    return this.request<Order>(`/orders/order-number/${orderNumber}`);
  }

  static async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.authenticatedRequest<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  static async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    return this.authenticatedRequest<Order>(`/orders/admin/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async createOrder(data: {
    items: { product_variant_id: string; quantity: number }[];
    shipping_address?: any;
    user_id?: string;
  }): Promise<Order> {
    return this.authenticatedRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async checkout(data?: { shipping_address?: any }): Promise<Order> {
    return this.authenticatedRequest<Order>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  static async guestCheckout(data: {
    cart_id: string;
    shipping_address: any;
  }): Promise<Order> {
    return this.request<Order>('/orders/guest/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============ CART API ============
  static async getCart(): Promise<Cart> {
    return this.authenticatedRequest<Cart>('/cart');
  }

  static async getGuestCart(cartId: string): Promise<Cart> {
    return this.request<Cart>(`/cart/guest/${cartId}`);
  }

  static async addToCart(data: {
    product_variant_id: string;
    quantity: number;
  }): Promise<Cart> {
    return this.authenticatedRequest<Cart>('/cart/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async addToGuestCart(data: {
    product_variant_id: string;
    quantity: number;
    cart_id?: string;
  }): Promise<Cart> {
    return this.request<Cart>('/cart/guest/add', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-guest-cart-id': data.cart_id || '',
      },
    });
  }

  static async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    return this.authenticatedRequest<Cart>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  static async updateGuestCartItem(itemId: string, quantity: number): Promise<Cart> {
    return this.request<Cart>(`/cart/guest/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  static async removeCartItem(itemId: string): Promise<Cart> {
    return this.authenticatedRequest<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  static async removeGuestCartItem(itemId: string): Promise<Cart> {
    return this.request<Cart>(`/cart/guest/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  static async clearCart(): Promise<void> {
    return this.authenticatedRequest<void>('/cart/clear', {
      method: 'DELETE',
    });
  }

  static async clearGuestCart(cartId: string): Promise<void> {
    return this.request<void>(`/cart/guest/${cartId}/clear`, {
      method: 'DELETE',
    });
  }

  static async mergeCart(guestCartId: string): Promise<Cart> {
    return this.authenticatedRequest<Cart>(`/cart/merge/${guestCartId}`, {
      method: 'POST',
    });
  }

  // ============ ADDRESS API ============
  static async getAddresses(): Promise<Address[]> {
    return this.authenticatedRequest<Address[]>('/address');
  }

  static async getAllAddresses(): Promise<Address[]> {
    return this.authenticatedRequest<Address[]>('/address/all');
  }

  static async getAddressStats(): Promise<any> {
    return this.authenticatedRequest<any>('/address/stats');
  }

  static async getAddress(id: string): Promise<Address> {
    return this.authenticatedRequest<Address>(`/address/${id}`);
  }

  static async createAddress(data: Partial<Address>): Promise<Address> {
    return this.authenticatedRequest<Address>('/address', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateAddress(id: string, data: Partial<Address>): Promise<Address> {
    return this.authenticatedRequest<Address>(`/address/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteAddress(id: string): Promise<void> {
    return this.authenticatedRequest<void>(`/address/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ ADMIN DASHBOARD STATS ============
  static async getDashboardStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    conversionRate: number;
    recentOrders: Order[];
    topProducts: (Product & { sales: number })[];
    lowStockProducts: ProductVariant[];
  }> {
    return this.authenticatedRequest<any>('/admin/dashboard/stats');
  }



  static async createRole(data: Partial<Role>): Promise<Role> {
    return this.authenticatedRequest<Role>('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    return this.authenticatedRequest<Role>(`/admin/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteRole(id: string): Promise<void> {
    return this.authenticatedRequest<void>(`/admin/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ SEARCH API ============
  static async searchProducts(query: string, params?: {
    categoryId?: string;
    brand?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams({ search: query });
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/products?${queryParams.toString()}`;
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  // ============ FEATURED PRODUCTS ============
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    const response = await this.getProducts({ 
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    return response.data;
  }

  // ============ INVENTORY MANAGEMENT ============
  static async getLowStockProducts(threshold: number = 10): Promise<ProductVariant[]> {
    const response = await this.getProducts({ limit: 1000 });
    const allProducts = response.data;
    
    const lowStockVariants: ProductVariant[] = [];
    allProducts.forEach(product => {
      if (product.variants) {
        const lowStock = product.variants.filter(variant => 
          variant.stock_qty <= threshold && variant.stock_qty > 0
        );
        lowStockVariants.push(...lowStock);
      }
    });
    
    return lowStockVariants;
  }

  // ============ UPLOAD API ============
  static async uploadImage(file: File, folder: string = 'products'): Promise<{
    url: string;
    originalName: string;
    size: number;
    mimeType: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    return result.data;
  }

  static async uploadMultipleImages(files: File[], folder: string = 'products'): Promise<Array<{
    url: string;
    originalName: string;
    size: number;
    mimeType: string;
  }>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to upload images');
    }

    const result = await response.json();
    return result.data;
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    return this.authenticatedRequest<void>('/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({ imageUrl }),
    });
  }

  // ============ USERS API (Admin Management - Only Admin Role Users) ============
  static async getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    // Always filter for admin role users only
    queryParams.append('role_id', '61c4815d-9b78-4493-911b-126ec6fe291d');
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `/identities/list-users?${queryParams.toString()}`;
    return this.authenticatedRequest<PaginatedResponse<User> | User[]>(endpoint) as Promise<any>;
  }

  static async getUserById(userId: string): Promise<User> {
    return this.authenticatedRequest<User>(`/users/${userId}`);
  }

  static async createUser(data: {
    username: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    password: string;
    role_id: string;
    status?: boolean;
  }): Promise<User> {
    return this.authenticatedRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateUser(userId: string, data: {
    username?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    role_id?: string;
    status?: boolean;
    avatar?: string;
  }): Promise<User> {
    return this.authenticatedRequest<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteUser(userId: string): Promise<void> {
    return this.authenticatedRequest<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  static async updateUserStatus(userId: string, status: boolean): Promise<User> {
    return this.authenticatedRequest<User>(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  static async changeUserPassword(userId: string, data: {
    oldPassword?: string;
    newPassword: string;
  }): Promise<void> {
    return this.authenticatedRequest<void>(`/users/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============ ROLES API ============
  static async getRoles(): Promise<Role[]> {
    return this.authenticatedRequest<Role[]>('/roles');
  }

  static async getRoleById(roleId: string): Promise<Role> {
    return this.authenticatedRequest<Role>(`/roles/${roleId}`);
  }

  // ============ CUSTOMERS API (Regular Users - Customer/User Role Only) ============
  static async getCustomers(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    // Filter to only get customer/user role (not admin)
    queryParams.append('role_id', '34fa9429-f7ef-4dcc-8b8d-06b3734456cb');

    const endpoint = `/identities/list-users?${queryParams.toString()}`;
    return this.authenticatedRequest<PaginatedResponse<User> | User[]>(endpoint) as Promise<any>;
  }

  static async getCustomerById(customerId: string): Promise<User & {
    totalOrders?: number;
    totalSpent?: number;
    lastOrderDate?: string;
    addresses?: Address[];
  }> {
    return this.authenticatedRequest(`/users/${customerId}?includeStats=true`);
  }

  static async getCustomerOrders(customerId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    return this.authenticatedRequest(`/users/${customerId}/orders?${queryParams.toString()}`);
  }

  static async getCustomerAddresses(customerId: string): Promise<Address[]> {
    return this.authenticatedRequest<Address[]>(`/users/${customerId}/addresses`);
  }

  static async updateCustomerStatus(customerId: string, status: boolean): Promise<User> {
    return this.authenticatedRequest<User>(`/users/${customerId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export default ApiService;
