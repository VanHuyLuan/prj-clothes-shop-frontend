"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MotionDiv } from "@/components/providers/motion-provider";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";

export function FeaturedProductsSection() {
  const products = [
    { name: "Classic White Tee", price: "$29.99" },
    { name: "Slim Fit Jeans", price: "$59.99" },
    { name: "Casual Blazer", price: "$89.99" },
    { name: "Summer Dress", price: "$49.99" },
  ];

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
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Link href="#">
            <Button
              size="lg"
              className="group relative overflow-hidden rounded-full px-8 transition-all duration-300 hover:shadow-md"
            >
              <span className="relative z-10">View All Products</span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-100 transition-all duration-300 group-hover:opacity-80"></span>
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
