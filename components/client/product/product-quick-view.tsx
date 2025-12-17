"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Check, Star, Package } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";

interface ProductVariant {
  id: string;
  size?: string | null;
  color?: string | null;
  sku: string;
  price: number;
  sale_price?: number | null;
  stock_qty: number;
}

interface ProductQuickViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    description?: string | null;
    brand?: string | null;
    variants?: ProductVariant[];
    images?: Array<{ url: string; alt_text?: string | null }>;
  } | null;
}

export function ProductQuickView({ open, onOpenChange, product }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();
  const router = useRouter();

  if (!product) return null;

  // Get unique sizes and colors
  const availableSizes = Array.from(new Set(
    product.variants?.map(v => v.size).filter(Boolean) || []
  ));
  
  const availableColors = Array.from(new Set(
    product.variants?.map(v => v.color).filter(Boolean) || []
  ));

  // Find variant based on selected size and color
  const selectedVariant = product.variants?.find(v => {
    const sizeMatch = !selectedSize || v.size === selectedSize;
    const colorMatch = !selectedColor || v.color === selectedColor;
    return sizeMatch && colorMatch;
  }) || null;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const getCurrentPrice = (): number => {
    if (selectedVariant) {
      return selectedVariant.sale_price || selectedVariant.price;
    }
    const prices = product.variants?.map(v => v.sale_price || v.price).filter(p => p != null) || [];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getOriginalPrice = (): number | null => {
    if (selectedVariant && selectedVariant.sale_price) {
      return selectedVariant.price;
    }
    return null;
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    const maxQty = selectedVariant?.stock_qty || 99;
    if (newQty >= 1 && newQty <= maxQty) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      price: selectedVariant.sale_price || selectedVariant.price,
      quantity,
      image: product.images?.[0]?.url,
    });

    onOpenChange(false);
    // Reset selections
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      price: selectedVariant.sale_price || selectedVariant.price,
      quantity,
      image: product.images?.[0]?.url,
    });

    onOpenChange(false);
    router.push("/client/cart");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="space-y-4 p-6">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.images?.[currentImageIndex]?.url || "/placeholder.svg"}
                alt={product.images?.[currentImageIndex]?.alt_text || product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
                      currentImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-border"
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text || `${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col p-8">
            <div className="space-y-4">
              {/* Title & Brand */}
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  {product.name}
                </h2>
                {product.brand && (
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Brand: {product.brand}
                  </p>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4",
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  35 đánh giá
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 py-2">
                <span className="text-4xl font-bold text-red-600">
                  ${Math.floor(getCurrentPrice())}<sup className="text-xl">.{((getCurrentPrice() % 1) * 100).toFixed(0).padStart(2, '0')}</sup>
                </span>
                {(() => {
                  const originalPrice = getOriginalPrice();
                  const currentPrice = getCurrentPrice();
                  if (originalPrice && typeof originalPrice === 'number' && originalPrice > currentPrice) {
                    return (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                        <Badge variant="destructive" className="text-xs px-2">
                          -{Math.round((1 - currentPrice / originalPrice) * 100)}%
                        </Badge>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
              
              {/* SKU */}
              {selectedVariant && (
                <p className="text-sm text-muted-foreground">
                  Mã SP: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
                </p>
              )}
            </div>

            {product.description && (
              <div className="py-4">
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3 py-4 border-t">
                <label className="text-sm font-semibold block">
                  Chọn size của bạn
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size as string)}
                        className={cn(
                          "min-w-[56px] h-11 px-4 rounded-md text-sm font-semibold transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-muted-foreground italic">
                    Bạn không nhớ size của mình? Mời bạn xem hướng dẫn chọn size.
                  </p>
                )}
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3 py-4 border-t">
                <label className="text-sm font-semibold block">
                  Chọn màu yêu thích
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color as string)}
                        className={cn(
                          "group relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={color as string}
                            fill
                            className="object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Check className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium capitalize">{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3 py-4 border-t">
              <label className="text-sm font-semibold block">Số lượng:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-14 h-10 text-center font-semibold border-x-2 bg-background"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (selectedVariant?.stock_qty || 99)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedVariant && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {selectedVariant.stock_qty} sản phẩm có sẵn
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 mt-auto">
              <Button
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock_qty === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                THÊM VÀO GIỎ HÀNG
              </Button>

              <Button
                className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md"
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.stock_qty === 0}
              >
                MUA NGAY
              </Button>

              {/* Stock & Selection Status */}
              <div className="flex flex-col gap-2 text-sm">
                {selectedVariant ? (
                  selectedVariant.stock_qty > 0 ? (
                    <div className="flex items-center gap-2 text-green-600 justify-center">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Còn hàng - Sẵn sàng giao</span>
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium text-center">Hết hàng</div>
                  )
                ) : (
                  <p className="text-center text-muted-foreground">
                    Vui lòng chọn size và màu sắc
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
