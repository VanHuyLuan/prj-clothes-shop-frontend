"use client";

import { useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { ProductCard } from "@/components/ui/product-card";

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
}

export function ProductGrid({
  products,
  showDiscount = false,
}: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState(8);

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{products.length} Products</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            {showDiscount && <option>Discount</option>}
          </select>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.slice(0, visibleProducts).map((product) => (
          <motion.div key={product.id} variants={item}>
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
            />
          </motion.div>
        ))}
      </motion.div>

      {visibleProducts < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
