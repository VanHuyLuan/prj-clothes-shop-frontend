"use client";

import { useState, useMemo, useEffect } from "react";
import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { getCategoryHeroImage } from "@/lib/product-images";
import { ApiService, Product } from "@/lib/api";

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
  
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
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

export default function MenPage() {
  const [allProducts, setAllProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);

  const priceRanges: PriceRange[] = [
    { id: "price1", label: "Under $10", min: 0, max: 10 },
    { id: "price2", label: "$10 - $25", min: 10, max: 25 },
    { id: "price3", label: "$25 - $50", min: 25, max: 50 },
    { id: "price4", label: "$50 - $100", min: 50, max: 100 },
    { id: "price5", label: "$100+", min: 100, max: null },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get the "men" category to get its ID
        const category = await ApiService.getCategoryBySlug("men");
        
        // Then fetch products for this category
        const response = await ApiService.getCategoryProducts(category.id, {
          includeSubcategories: true,
          limit: 1000 // Get all products
        });
        
        // Handle both response formats: array or object with data property
        const productsArray = Array.isArray(response) ? response : response.data;
        
        // Convert to display format
        const displayProducts = productsArray.map(convertToDisplayProduct);
        setAllProducts(displayProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    priceRanges.forEach((range) => {
      counts[range.id] = allProducts.filter((product) =>
        isPriceInRange(product.price, range)
      ).length;
    });
    return counts;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedPriceRanges.length === 0) {
      return allProducts;
    }
    return allProducts.filter((product) => {
      return selectedPriceRanges.some((range) =>
        isPriceInRange(product.price, range)
      );
    });
  }, [selectedPriceRanges, allProducts]);

  const handlePriceChange = (ranges: PriceRange[]) => {
    setSelectedPriceRanges(ranges);
  };

  // Show loading state
  if (loading) {
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
          <div className="text-center text-muted-foreground">
            Loading products...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
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
          <div className="text-center text-red-500">
            Error: {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
