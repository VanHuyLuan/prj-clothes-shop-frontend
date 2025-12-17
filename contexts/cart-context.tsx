"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiService } from "@/lib/api";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  size?: string | null;
  color?: string | null;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Helper function to format cart data from API
  const formatCartData = (cartData: any): CartItem[] => {
    if (!cartData?.items || !Array.isArray(cartData.items)) {
      console.log("No items or items is not an array:", cartData);
      return [];
    }

    console.log("Formatting cart items:", cartData.items);

    return cartData.items.map((item: any) => {
      // Try both naming conventions from backend
      const variant = item.productVariant || item.variant || item.product_variant;
      const product = variant?.product;
      const image = product?.images?.[0]?.url || "";
      
      console.log("Item:", item);
      console.log("Variant:", variant);
      console.log("Product:", product);
      
      const formatted = {
        id: item.id,
        productId: variant?.product_id || product?.id || "",
        productName: product?.name || "Unknown Product",
        variantId: item.product_variant_id || item.productVariantId || variant?.id || "",
        size: variant?.size || null,
        color: variant?.color || null,
        sku: variant?.sku || "",
        price: Number(variant?.sale_price || variant?.price || 0),
        quantity: item.quantity || 1,
        image,
      };
      
      console.log("Formatted item:", formatted);
      return formatted;
    });
  };

  // Load cart from backend
  const loadCart = async () => {
    try {
      setIsLoading(true);
      let cartData;

      if (user) {
        // User logged in - get user cart
        cartData = await ApiService.getCart();
        console.log("Cart data from API (user):", cartData);
      } else {
        // Guest - get guest cart
        const guestCartId = localStorage.getItem("guestCartId");
        console.log("Guest cart ID:", guestCartId);
        if (guestCartId) {
          cartData = await ApiService.getGuestCart(guestCartId);
          console.log("Cart data from API (guest):", cartData);
        }
      }

      const formattedItems = formatCartData(cartData);
      setItems(formattedItems);
    } catch (error) {
      console.error("Error loading cart:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart when user changes or on mount
  useEffect(() => {
    loadCart();
  }, [user]);

  const addItem = async (item: Omit<CartItem, "id">) => {
    try {
      setIsLoading(true);
      let cartData;
      
      if (user) {
        // User logged in
        cartData = await ApiService.addToCart({
          productVariantId: item.variantId,
          quantity: item.quantity,
        });
      } else {
        // Guest
        const guestCartId = localStorage.getItem("guestCartId");
        cartData = await ApiService.addToGuestCart({
          productVariantId: item.variantId,
          quantity: item.quantity,
          cart_id: guestCartId || undefined,
        });
        
        // Save guest cart ID
        if (cartData.id) {
          localStorage.setItem("guestCartId", cartData.id);
        }
      }

      // Update cart from API response directly (no need to call loadCart again)
      const formattedItems = formatCartData(cartData);
      setItems(formattedItems);
      
      toast.success("Đã thêm vào giỏ hàng", {
        description: `${item.productName} - ${item.size} / ${item.color}`,
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error("Không thể thêm vào giỏ hàng", {
        description: error.message || "Vui lòng thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      setIsLoading(true);
      let cartData;
      
      if (user) {
        cartData = await ApiService.removeCartItem(id);
      } else {
        cartData = await ApiService.removeGuestCartItem(id);
      }
      
      // Update cart from API response directly
      const formattedItems = formatCartData(cartData);
      setItems(formattedItems);
      
      toast.success("Đã xóa khỏi giỏ hàng");
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast.error("Không thể xóa sản phẩm", {
        description: error.message || "Vui lòng thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      setIsLoading(true);
      let cartData;
      
      if (user) {
        cartData = await ApiService.updateCartItem(id, quantity);
      } else {
        cartData = await ApiService.updateGuestCartItem(id, quantity);
      }
      
      // Update cart from API response directly
      const formattedItems = formatCartData(cartData);
      setItems(formattedItems);
    } catch (error: any) {
      console.error("Error updating cart:", error);
      toast.error("Không thể cập nhật số lượng", {
        description: error.message || "Vui lòng thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        await ApiService.clearCart();
      } else {
        const guestCartId = localStorage.getItem("guestCartId");
        if (guestCartId) {
          await ApiService.clearGuestCart(guestCartId);
          localStorage.removeItem("guestCartId");
        }
      }
      
      setItems([]);
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Không thể xóa giỏ hàng", {
        description: error.message || "Vui lòng thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
