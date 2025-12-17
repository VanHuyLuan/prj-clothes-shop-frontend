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
    // price and sale_price are now numbers from backend
    const salePrice = variant.sale_price ? variant.sale_price : null;
    const regularPrice = variant.price;
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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
        
        // Store full product data for variant filtering
        setAllProducts(productsArray);
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
      counts[range.id] = allProducts.filter((product) => {
        const displayProduct = convertToDisplayProduct(product);
        return isPriceInRange(displayProduct.price, range);
      }).length;
    });
    return counts;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by price
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        const displayProduct = convertToDisplayProduct(product);
        return selectedPriceRanges.some((range) =>
          isPriceInRange(displayProduct.price, range)
        );
      });
    }

    // Filter by size - check if product has any variant with selected size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) => {
        return product.variants?.some((variant) =>
          selectedSizes.includes(variant.size || '')
        );
      });
    }

    // Filter by color - check if product has any variant with selected color
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) => {
        return product.variants?.some((variant) =>
          selectedColors.includes(variant.color || '')
        );
      });
    }

    // Convert to display format
    return filtered.map(convertToDisplayProduct);
  }, [selectedPriceRanges, selectedSizes, selectedColors, allProducts]);

  const handlePriceChange = (ranges: PriceRange[]) => {
    setSelectedPriceRanges(ranges);
  };

  const handleSizeChange = (sizes: string[]) => {
    setSelectedSizes(sizes);
  };

  const handleColorChange = (colors: string[]) => {
    setSelectedColors(colors);
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
            onSizeChange={handleSizeChange}
            onColorChange={handleColorChange}
            productCounts={productCounts}
          />
          <div className="md:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {allProducts.length} products
              {(selectedPriceRanges.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0) && (
                <span className="ml-2">
                  ({selectedPriceRanges.length + selectedSizes.length + selectedColors.length} filter{(selectedPriceRanges.length + selectedSizes.length + selectedColors.length) > 1 ? 's' : ''} applied)
                </span>
              )}
            </div>
            <ProductGrid products={filteredProducts} fullProducts={allProducts} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
