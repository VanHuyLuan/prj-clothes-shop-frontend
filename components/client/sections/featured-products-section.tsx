"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MotionDiv } from "@/components/providers/motion-provider";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import MockDatabase from "@/lib/database";

export function FeaturedProductsSection() {
  // Get featured products from database
  const featuredProducts = MockDatabase.getFeaturedProducts(4);
  
  const products = featuredProducts.map(product => ({
    name: product.name,
    price: `$${Math.min(...(product.variants?.map(v => {
      const salePrice = v.sale_price ? parseFloat(v.sale_price) : null;
      const regularPrice = parseFloat(v.price);
      return salePrice || regularPrice;
    }) || [])).toFixed(2)}`,
    image: product.images?.[0]?.url || '/placeholder.jpg'
  }));

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
          {products.map((product, index) => (
            <MotionDiv key={index} variants={itemVariants}>
              <ProductCard product={product} image={product.image} />
            </MotionDiv>
          ))}
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
