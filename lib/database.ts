// Import mock data directly
import mockDataJson from './mock-data.json';

// Use the imported JSON data
const mockData = mockDataJson;

// Types matching Prisma schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  created_at: string;
  updated_at: string;
  categories: string[];
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  sku: string;
  price: string;
  sale_price?: string | null;
  sale_start?: string | null;
  sale_end?: string | null;
  stock_qty: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  sort: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id?: string | null;
  status: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  order?: Order;
  variant?: ProductVariant;
}

// Database-like query functions
export class MockDatabase {
  // Categories
  static getAllCategories(): Category[] {
    return mockData.categories as Category[];
  }

  static getCategoryBySlug(slug: string): Category | null {
    return (mockData.categories as Category[]).find((cat) => cat.slug === slug) || null;
  }

  static getCategoriesByParentId(parentId: string | null): Category[] {
    return (mockData.categories as Category[]).filter((cat) => cat.parentId === parentId);
  }

  // Products
  static getAllProducts(): Product[] {
    return (mockData.products as Product[]).map((product: Product) => ({
      ...product,
      variants: this.getProductVariants(product.id),
      images: this.getProductImages(product.id)
    }));
  }

  static getProductBySlug(slug: string): Product | null {
    const product = (mockData.products as Product[]).find((prod) => prod.slug === slug);
    if (!product) return null;
    
    return {
      ...product,
      variants: this.getProductVariants(product.id),
      images: this.getProductImages(product.id)
    };
  }

  static getProductsByCategory(categorySlug: string): Product[] {
    const category = this.getCategoryBySlug(categorySlug);
    if (!category) return [];

    return (mockData.products as Product[])
      .filter((prod) => prod.categories.includes(category.id))
      .map((product: Product) => ({
        ...product,
        variants: this.getProductVariants(product.id),
        images: this.getProductImages(product.id)
      }));
  }

  static getProductsByPriceRange(minPrice: number, maxPrice: number): Product[] {
    return this.getAllProducts().filter((product: Product) => {
      if (!product.variants || product.variants.length === 0) return false;
      
      const prices = product.variants.map(v => {
        const salePrice = v.sale_price ? parseFloat(v.sale_price) : null;
        const regularPrice = parseFloat(v.price);
        return salePrice || regularPrice;
      });
      
      const minProductPrice = Math.min(...prices);
      return minProductPrice >= minPrice && minProductPrice <= maxPrice;
    });
  }

  static getFeaturedProducts(limit: number = 6): Product[] {
    // For demo, return first N products with sale prices as "featured"
    return this.getAllProducts()
      .filter(product => 
        product.variants?.some(v => v.sale_price !== null && v.sale_price !== undefined)
      )
      .slice(0, limit);
  }

  // Product Variants
  static getProductVariants(productId: string): ProductVariant[] {
    return (mockData.productVariants as ProductVariant[]).filter((variant) => 
      variant.product_id === productId
    );
  }

  static getVariantById(variantId: string): ProductVariant | null {
    return (mockData.productVariants as ProductVariant[]).find((variant) => 
      variant.id === variantId
    ) || null;
  }

  static getVariantsInStock(productId: string): ProductVariant[] {
    return this.getProductVariants(productId).filter((variant) => 
      variant.stock_qty > 0
    );
  }

  // Product Images
  static getProductImages(productId: string): ProductImage[] {
    return (mockData.productImages as ProductImage[])
      .filter((image) => image.product_id === productId)
      .sort((a, b) => a.sort - b.sort);
  }

  static getPrimaryProductImage(productId: string): ProductImage | null {
    const images = this.getProductImages(productId);
    return images.length > 0 ? images[0] : null;
  }

  // Orders
  static getAllOrders(): Order[] {
    return (mockData.orders as Order[]).map((order) => ({
      ...order,
      items: this.getOrderItems(order.id)
    }));
  }

  static getOrderById(orderId: string): Order | null {
    const order = (mockData.orders as Order[]).find((ord) => ord.id === orderId);
    if (!order) return null;
    
    return {
      ...order,
      items: this.getOrderItems(order.id)
    } as Order;
  }

  static getOrdersByUserId(userId: string): Order[] {
    return (mockData.orders as Order[])
      .filter((order) => order.user_id === userId)
      .map((order) => ({
        ...order,
        items: this.getOrderItems(order.id)
      }));
  }

  static getOrderItems(orderId: string): OrderItem[] {
    return (mockData.orderItems as OrderItem[])
      .filter((item) => item.order_id === orderId)
      .map((item) => ({
        ...item,
        variant: this.getVariantById(item.product_variant_id) || undefined
      }));
  }

  // Search and Filter
  static searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase();
    return this.getAllProducts().filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm)
    );
  }

  static filterProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    inStock?: boolean;
    onSale?: boolean;
  }): Product[] {
    let products = this.getAllProducts();

    if (filters.category) {
      products = this.getProductsByCategory(filters.category);
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const min = filters.minPrice || 0;
      const max = filters.maxPrice || Infinity;
      products = products.filter((product: Product) => {
        if (!product.variants || product.variants.length === 0) return false;
        
        const prices = product.variants.map(v => {
          const salePrice = v.sale_price ? parseFloat(v.sale_price) : null;
          const regularPrice = parseFloat(v.price);
          return salePrice || regularPrice;
        });
        
        const minProductPrice = Math.min(...prices);
        return minProductPrice >= min && minProductPrice <= max;
      });
    }

    if (filters.brand) {
      products = products.filter((product: Product) => 
        product.brand?.toLowerCase() === filters.brand?.toLowerCase()
      );
    }

    if (filters.inStock) {
      products = products.filter((product: Product) =>
        product.variants?.some(v => v.stock_qty > 0)
      );
    }

    if (filters.onSale) {
      products = products.filter((product: Product) =>
        product.variants?.some(v => v.sale_price !== null && v.sale_price !== undefined)
      );
    }

    return products;
  }

  // Statistics
  static getProductCount(): number {
    return mockData.products.length;
  }

  static getCategoryProductCount(categorySlug: string): number {
    return this.getProductsByCategory(categorySlug).length;
  }

  static getTotalRevenue(): number {
    return (mockData.orders as Order[])
      .filter((order) => order.status === 'paid' || order.status === 'shipped')
      .reduce((total: number, order) => total + parseFloat(order.total_amount), 0);
  }

  static getLowStockProducts(threshold: number = 10): Product[] {
    return this.getAllProducts().filter((product: Product) =>
      product.variants?.some(v => v.stock_qty <= threshold && v.stock_qty > 0)
    );
  }
}

export default MockDatabase;