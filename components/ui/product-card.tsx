"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    name: string;
    price: string;
    originalPrice?: string;
    discount?: string;
  };
  image?: string;
  showDiscount?: boolean;
}

export function ProductCard({
  product,
  image = "/placeholder.svg?height=600&width=400",
  showDiscount = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href="#" className="block">
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-muted/30">
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
            <Button
              className="w-full bg-white/90 text-black backdrop-blur-sm hover:bg-white"
              size="sm"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
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
      </Link>
    </motion.div>
  );
}
