"use client";

import { useState, useMemo } from "react";
import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { getCategoryImageByIndex, getCategoryHeroImage } from "@/lib/product-images";

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

// Helper function to parse price string to number
const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ""));
};

// Helper function to check if price is in range
const isPriceInRange = (priceString: string, range: PriceRange): boolean => {
  const price = parsePrice(priceString);
  return price >= range.min && (range.max === null || price < range.max);
};

// Mock data for women's products
const allProducts = [
  {
    id: "w1",
    name: "Floral Summer Dress",
    price: "$49.99",
    image: getCategoryImageByIndex("women", 0),
  },
  {
    id: "w2",
    name: "Slim Fit Jeans",
    price: "$59.99",
    image: getCategoryImageByIndex("women", 1),
  },
  {
    id: "w3",
    name: "Casual Blazer",
    price: "$89.99",
    image: getCategoryImageByIndex("women", 2),
  },
  {
    id: "w4",
    name: "Cotton T-Shirt",
    price: "$24.99",
    image: getCategoryImageByIndex("women", 3),
  },
  {
    id: "w5",
    name: "Leather Jacket",
    price: "$129.99",
    image: getCategoryImageByIndex("women", 4),
  },
  {
    id: "w6",
    name: "Knit Sweater",
    price: "$45.99",
    image: getCategoryImageByIndex("women", 5),
  },
  {
    id: "w7",
    name: "Pleated Skirt",
    price: "$39.99",
    image: getCategoryImageByIndex("women", 6),
  },
  {
    id: "w8",
    name: "Silk Blouse",
    price: "$69.99",
    image: getCategoryImageByIndex("women", 7),
  },
  {
    id: "w9",
    name: "Designer Handbag",
    price: "$199.99",
    image: getCategoryImageByIndex("women", 8),
  },
  {
    id: "w10",
    name: "Evening Gown",
    price: "$249.99",
    image: getCategoryImageByIndex("women", 9),
  },
  {
    id: "w11",
    name: "Casual Sneakers",
    price: "$79.99",
    image: getCategoryImageByIndex("women", 10),
  },
  {
    id: "w12",
    name: "Basic Tank Top",
    price: "$19.99",
    image: getCategoryImageByIndex("women", 11),
  },
];

export default function WomenPage() {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);

  // Define price ranges (must match CategoryFilters)
  const priceRanges: PriceRange[] = [
    { id: "price1", label: "Under $25", min: 0, max: 25 },
    { id: "price2", label: "$25 - $50", min: 25, max: 50 },
    { id: "price3", label: "$50 - $100", min: 50, max: 100 },
    { id: "price4", label: "$100 - $200", min: 100, max: 200 },
    { id: "price5", label: "$200+", min: 200, max: null },
  ];

  // Calculate product counts for each range
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
        title="Women's Collection"
        description="Discover the latest trends in women's fashion. From elegant dresses to casual wear, find your perfect style."
        image={getCategoryHeroImage("women")}
        category="women"
      />

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CategoryFilters 
            onPriceChange={handlePriceChange}
            productCounts={productCounts}
          />
          <div className="md:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {allProducts.length} products
              {selectedPriceRanges.length > 0 && (
                <span className="ml-2">
                  ({selectedPriceRanges.length} price filter{selectedPriceRanges.length > 1 ? 's' : ''} applied)
                </span>
              )}
            </div>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
