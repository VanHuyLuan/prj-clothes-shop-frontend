"use client";

import { useState, useMemo } from "react";
import {
  MotionDiv,
} from "@/components/providers/motion-provider";
import { ProductCard } from "@/components/ui/product-card";
import { SlidersHorizontal, Grid3x3, LayoutGrid } from "lucide-react";
import { Product as FullProduct } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
  discount?: string;
}

interface ProductGridProps {
  products: Product[];
  showDiscount?: boolean;
  fullProducts?: FullProduct[];
}

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc" | "discount";
type GridColumns = 3 | 4;

export function ProductGrid({
  products,
  showDiscount = false,
  fullProducts,
}: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridColumns, setGridColumns] = useState<GridColumns>(4);

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[$,]/g, ""));
          const priceB = parseFloat(b.price.replace(/[$,]/g, ""));
          return priceA - priceB;
        });
      
      case "price-desc":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[$,]/g, ""));
          const priceB = parseFloat(b.price.replace(/[$,]/g, ""));
          return priceB - priceA;
        });
      
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case "discount":
        if (!showDiscount) return sorted;
        return sorted.sort((a, b) => {
          const discountA = a.discount ? parseFloat(a.discount.replace("%", "")) : 0;
          const discountB = b.discount ? parseFloat(b.discount.replace("%", "")) : 0;
          return discountB - discountA;
        });
      
      default:
        return sorted;
    }
  }, [products, sortBy, showDiscount]);

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 8, products.length));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const gridClass = gridColumns === 3 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {visibleProducts < products.length 
              ? `Showing ${visibleProducts} of ${products.length}` 
              : "Showing all products"}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Grid Layout Toggle */}
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <button
              onClick={() => setGridColumns(3)}
              className={`p-2 rounded transition-colors ${
                gridColumns === 3 
                  ? "bg-primary text-white" 
                  : "hover:bg-muted"
              }`}
              title="3 columns"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setGridColumns(4)}
              className={`p-2 rounded transition-colors ${
                gridColumns === 4 
                  ? "bg-primary text-white" 
                  : "hover:bg-muted"
              }`}
              title="4 columns"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <SlidersHorizontal size={18} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 sm:flex-initial rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              {showDiscount && <option value="discount">Best Discount</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <SlidersHorizontal size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <MotionDiv
            variants={container}
            initial="hidden"
            animate="show"
            className={`grid ${gridClass}`}
          >
            {sortedProducts.slice(0, visibleProducts).map((product) => {
              const fullProduct = fullProducts?.find(fp => fp.id === product.id);
              return (
                <MotionDiv key={product.id} variants={item}>
                  <ProductCard
                    product={{
                      name: product.name,
                      price: product.price,
                      ...(showDiscount &&
                        product.originalPrice && {
                          originalPrice: product.originalPrice,
                          discount: product.discount,
                        }),
                    }}
                    image={product.image}
                    showDiscount={showDiscount}
                    fullProduct={fullProduct}
                  />
                </MotionDiv>
              );
            })}
          </MotionDiv>

          {/* Load More Button */}
          {visibleProducts < products.length && (
            <div className="flex flex-col items-center gap-3 mt-12">
              <p className="text-sm text-muted-foreground">
                Showing {visibleProducts} of {products.length} products
              </p>
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all hover:shadow-lg transform hover:scale-105"
              >
                Load More ({Math.min(8, products.length - visibleProducts)} more)
              </button>
            </div>
          )}

          {/* All Products Loaded Message */}
          {visibleProducts >= products.length && products.length > 12 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                ✨ You've reached the end! All {products.length} products shown.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
