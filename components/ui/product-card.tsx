"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MotionDiv,
} from "@/components/providers/motion-provider";
import { ShoppingBag, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductQuickView } from "@/components/client/product/product-quick-view";

interface ProductVariant {
  id: string;
  size?: string | null;
  color?: string | null;
  sku: string;
  price: number;
  sale_price?: number | null;
  stock_qty: number;
}

interface FullProduct {
  id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  variants?: ProductVariant[];
  images?: Array<{ url: string; alt_text?: string | null }>;
}

interface ProductCardProps {
  product: {
    name: string;
    price: string;
    originalPrice?: string;
    discount?: string;
  };
  image?: string;
  showDiscount?: boolean;
  fullProduct?: FullProduct;
}

export function ProductCard({
  product,
  image = "/placeholder.svg?height=600&width=400",
  showDiscount = false,
  fullProduct,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fullProduct) {
      setShowQuickView(true);
    }
  };

  return (
    <MotionDiv
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl border border-border/40 bg-card p-3 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block cursor-pointer" onClick={handleCardClick}>
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-muted/30">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          />
          <Image
            src={image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isHovered ? "scale-110 blur-[1px]" : "scale-100"
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-4 translate-y-10 opacity-0 transition-all duration-300",
              isHovered && "translate-y-0 opacity-100"
            )}
          >
            <div className="space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm hover:from-purple-600 hover:to-pink-600"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const imageUrl = encodeURIComponent(image || '/placeholder.svg');
                  const productName = encodeURIComponent(product.name);
                  window.location.href = `/client/virtual-tryon?garment=${imageUrl}&name=${productName}`;
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Thử đồ ảo
              </Button>
              <Button
                className="w-full bg-white/90 text-black backdrop-blur-sm hover:bg-white"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (fullProduct) {
                    setShowQuickView(true);
                  }
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-muted-foreground backdrop-blur-sm transition-all hover:bg-white hover:text-primary",
              isFavorite && "text-red-500 hover:text-red-600"
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            <span className="sr-only">Add to favorites</span>
          </Button>

          {showDiscount && product.discount && (
            <div className="absolute left-2 top-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount} OFF
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-medium transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {product.price}
            </p>
            {showDiscount && product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {product.originalPrice}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {fullProduct && (
        <ProductQuickView
          open={showQuickView}
          onOpenChange={setShowQuickView}
          product={fullProduct}
        />
      )}
    </MotionDiv>
  );
}
