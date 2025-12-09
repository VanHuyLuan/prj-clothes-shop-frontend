"use client";

import { useState, useMemo } from "react";
import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { getCategoryHeroImage } from "@/lib/product-images";
import MockDatabase, { Product } from "@/lib/database";

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

// Convert Product to display format
interface DisplayProduct {
  id: string;
  name: string;
  price: string;
  image: string;
}

const convertToDisplayProduct = (product: Product): DisplayProduct => {
  // Get the lowest price from variants (considering sale prices)
  const prices = product.variants?.map(variant => {
    const salePrice = variant.sale_price ? parseFloat(variant.sale_price) : null;
    const regularPrice = parseFloat(variant.price);
    return salePrice || regularPrice;
  }) || [];
  
  const lowestPrice = Math.min(...prices);
  const primaryImage = product.images?.[0]?.url || '/placeholder.jpg';
  
  return {
    id: product.id,
    name: product.name,
    price: `$${lowestPrice.toFixed(2)}`,
    image: primaryImage
  };
};

const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ""));
};

const isPriceInRange = (priceString: string, range: PriceRange): boolean => {
  const price = parsePrice(priceString);
  return price >= range.min && (range.max === null || price < range.max);
};

// Get products from database
const rawProducts = MockDatabase.getProductsByCategory('men');
const allProducts: DisplayProduct[] = rawProducts.map(convertToDisplayProduct);

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
