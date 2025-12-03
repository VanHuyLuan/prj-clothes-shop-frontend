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

const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ""));
};

const isPriceInRange = (priceString: string, range: PriceRange): boolean => {
  const price = parsePrice(priceString);
  return price >= range.min && (range.max === null || price < range.max);
};

// Mock data for men's products
const allProducts = [
  {
    id: "m1",
    name: "Classic Oxford Shirt",
    price: "$45.99",
    image: getCategoryImageByIndex("men", 0),
  },
  {
    id: "m2",
    name: "Slim Fit Chinos",
    price: "$59.99",
    image: getCategoryImageByIndex("men", 1),
  },
  {
    id: "m3",
    name: "Wool Blazer",
    price: "$129.99",
    image: getCategoryImageByIndex("men", 2),
  },
  {
    id: "m4",
    name: "Graphic T-Shirt",
    price: "$29.99",
    image: getCategoryImageByIndex("men", 3),
  },
  {
    id: "m5",
    name: "Denim Jacket",
    price: "$89.99",
    image: getCategoryImageByIndex("men", 4),
  },
  {
    id: "m6",
    name: "Knit Pullover",
    price: "$55.99",
    image: getCategoryImageByIndex("men", 5),
  },
  {
    id: "m7",
    name: "Tailored Trousers",
    price: "$79.99",
    image: getCategoryImageByIndex("men", 6),
  },
  {
    id: "m8",
    name: "Casual Polo",
    price: "$39.99",
    image: getCategoryImageByIndex("men", 7),
  },
  {
    id: "m9",
    name: "Formal Suit",
    price: "$299.99",
    image: getCategoryImageByIndex("men", 8),
  },
  {
    id: "m10",
    name: "Basic Tee",
    price: "$19.99",
    image: getCategoryImageByIndex("men", 9),
  },
  {
    id: "m11",
    name: "Leather Belt",
    price: "$49.99",
    image: getCategoryImageByIndex("men", 10),
  },
  {
    id: "m12",
    name: "Designer Watch",
    price: "$249.99",
    image: getCategoryImageByIndex("men", 11),
  },
];

export default function MenPage() {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);

  const priceRanges: PriceRange[] = [
    { id: "price1", label: "Under $25", min: 0, max: 25 },
    { id: "price2", label: "$25 - $50", min: 25, max: 50 },
    { id: "price3", label: "$50 - $100", min: 50, max: 100 },
    { id: "price4", label: "$100 - $200", min: 100, max: 200 },
    { id: "price5", label: "$200+", min: 200, max: null },
  ];

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    priceRanges.forEach((range) => {
      counts[range.id] = allProducts.filter((product) =>
        isPriceInRange(product.price, range)
      ).length;
    });
    return counts;
  }, []);

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
        title="Men's Collection"
        description="Explore our men's fashion collection. From formal suits to casual streetwear, elevate your style."
        image={getCategoryHeroImage("men")}
        category="men"
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
