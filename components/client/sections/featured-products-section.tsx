"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MotionDiv } from "@/components/providers/motion-provider";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { ApiService, Product } from "@/lib/api";

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: string; image: string }>>([]);
  const [fullProducts, setFullProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch first 4 products as featured
        const response = await ApiService.getProducts({
          limit: 4,
          status: 'active'
        });
        
        // Handle both response formats
        const productsArray = Array.isArray(response) ? response : response.data;
        
        // Store full products for modal
        setFullProducts(productsArray);
        
        // Convert to display format
        const displayProducts = productsArray.map(product => {
          interface Variant {
            sale_price?: number | null;
            price: number;
          }

          interface ProductType {
            id: string;
            name: string;
            variants?: Variant[];
            images?: Array<{ url: string }>;
          }

          const prices: number[] = (product as ProductType).variants?.map((variant: Variant): number => {
            const salePrice: number | null = variant.sale_price ? variant.sale_price : null;
            const regularPrice: number = variant.price;
            return salePrice || regularPrice;
          }) || [];
          
          const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
          
          return {
            id: (product as ProductType).id,
            name: product.name,
            price: `$${lowestPrice.toFixed(2)}`,
            image: product.images?.[0]?.url || '/placeholder.jpg'
          };
        });
        
        setProducts(displayProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Set empty array on error to show section without products
        setProducts([]);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="featured" className="w-full py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center space-x-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-sm font-medium uppercase tracking-wider text-primary">
                Featured
              </span>
              <span className="h-px w-8 bg-primary"></span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Featured Products
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Check out our most popular items this season.
            </p>
          </div>
        </MotionDiv>
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
        >
          {loading ? (
            <div className="col-span-full text-center text-muted-foreground">
              Loading featured products...
            </div>
          ) : products.length > 0 ? (
            products.map((product, index) => {
              const fullProduct = fullProducts.find(fp => fp.id === product.id);
              return (
                <MotionDiv key={product.id || index} variants={itemVariants}>
                  <ProductCard 
                    product={product} 
                    image={product.image}
                    fullProduct={fullProduct}
                  />
                </MotionDiv>
              );
            })
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No featured products available
            </div>
          )}
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Link href="/client/products">
            <Button
              size="lg"
              className="
                relative group overflow-hidden rounded-full px-10 py-5 
                font-semibold text-white tracking-wide
                bg-gradient-to-r from-primary to-primary/80
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-out
                hover:scale-105
              "
            >
              {/* Glow Overlay */}
              <span
                className="
                  absolute inset-0 bg-white/20 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300
                "
              />

              {/* Text */}
              <span className="relative z-10">View All Products</span>
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
