"use client";

import { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { CategoryHero } from "@/components/client/category/category-hero";
import { getProductImageByIndex } from "@/lib/product-images";

// Thêm interface để định nghĩa kiểu dữ liệu cho Product
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
  discount?: string;
}

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

// Dynamically import heavy components
const ProductGrid = dynamic(
  () =>
    import("@/components/client/category/product-grid").then((mod) => mod.ProductGrid),
  {
    loading: () => (
      <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
    ),
  }
);

const CategoryFilters = dynamic(
  () =>
    import("@/components/client/category/category-filters").then(
      (mod) => mod.CategoryFilters
    ),
  {
    loading: () => (
      <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
    ),
  }
);

// Helper function to parse price string to number
const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ""));
};

// Helper function to check if price is in range
const isPriceInRange = (priceString: string, range: PriceRange): boolean => {
  const price = parsePrice(priceString);
  return price >= range.min && (range.max === null || price < range.max);
};

// Áp dụng kiểu dữ liệu Product[] cho biến products
const allProducts: Product[] = [
  {
    id: "p1",
    name: "Classic T-Shirt",
    price: "$19.99",
    image: getProductImageByIndex(1),
  },
  {
    id: "p2",
    name: "Slim Fit Jeans",
    price: "$45.00",
    image: getProductImageByIndex(2),
  },
  {
    id: "p3",
    name: "Cotton Hoodie",
    price: "$65.00",
    image: getProductImageByIndex(3),
  },
  {
    id: "p4",
    name: "Premium Jacket",
    price: "$150.00",
    image: getProductImageByIndex(4),
  },
  {
    id: "p5",
    name: "Designer Coat",
    price: "$250.00",
    image: getProductImageByIndex(5),
  },
  {
    id: "p6",
    name: "Basic Tee",
    price: "$15.00",
    image: getProductImageByIndex(6),
  },
  {
    id: "p7",
    name: "Casual Shirt",
    price: "$35.00",
    image: getProductImageByIndex(7),
  },
  {
    id: "p8",
    name: "Sport Pants",
    price: "$55.00",
    image: getProductImageByIndex(8),
  },
  {
    id: "p9",
    name: "Formal Blazer",
    price: "$180.00",
    image: getProductImageByIndex(9),
  },
  {
    id: "p10",
    name: "Leather Shoes",
    price: "$120.00",
    image: getProductImageByIndex(10),
  },
  {
    id: "p11",
    name: "Summer Dress",
    price: "$75.00",
    image: getProductImageByIndex(11),
  },
  {
    id: "p12",
    name: "Winter Scarf",
    price: "$22.00",
    image: getProductImageByIndex(12),
  },
];

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);

  // Define price ranges (same as in CategoryFilters)
  const priceRanges: PriceRange[] = [
    { id: "price1", label: "Under $25", min: 0, max: 25 },
    { id: "price2", label: "$25 - $50", min: 25, max: 50 },
    { id: "price3", label: "$50 - $100", min: 50, max: 100 },
    { id: "price4", label: "$100 - $200", min: 100, max: 200 },
    { id: "price5", label: "$200+", min: 200, max: null },
  ];

  // Calculate product count for each price range
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    priceRanges.forEach((range) => {
      counts[range.id] = allProducts.filter((product) => 
        isPriceInRange(product.price, range)
      ).length;
    });
    return counts;
  }, []);

  // Filter products based on selected price ranges
  const filteredProducts = useMemo(() => {
    if (selectedPriceRanges.length === 0) {
      return allProducts;
    }

    return allProducts.filter((product) => {
      return selectedPriceRanges.some((range) => 
        isPriceInRange(product.price, range)
      );
    });
  }, [selectedPriceRanges]);

  const handlePriceChange = (ranges: PriceRange[]) => {
    setSelectedPriceRanges(ranges);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title={`${title}'s Collection`}
        description={`Explore our ${category}'s fashion collection. From formal suits to casual streetwear, elevate your style.`}
        image={`/images/categories/${category}.jpg`}
        category={category}
      />

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Suspense
            fallback={
              <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
            }
          >
            <CategoryFilters 
              onPriceChange={handlePriceChange}
              productCounts={productCounts}
            />
          </Suspense>
          <div className="md:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {allProducts.length} products
              {selectedPriceRanges.length > 0 && (
                <span className="ml-2">
                  ({selectedPriceRanges.length} filter{selectedPriceRanges.length > 1 ? 's' : ''} applied)
                </span>
              )}
            </div>
            <Suspense
              fallback={
                <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
              }
            >
              <ProductGrid products={filteredProducts} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
