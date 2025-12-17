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

// Helper function to parse price string to number
const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[$,]/g, ""));
};

// Helper function to check if price is in range
const isPriceInRange = (priceString: string, range: PriceRange): boolean => {
  const price = parsePrice(priceString);
  return price >= range.min && (range.max === null || price < range.max);
};

export default function WomenPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Define price ranges (must match CategoryFilters)
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
        
        // First get the "women" category to get its ID
        const category = await ApiService.getCategoryBySlug("women");
        
        // Then fetch products for this category
        const response = await ApiService.getCategoryProducts(category.id, {
          includeSubcategories: true,
          limit: 1000 // Get all products
        });
        
        // Handle both response formats: array or object with data property
        const productsArray = Array.isArray(response) ? response : response.data;
        
        // Store original products
        setAllProducts(productsArray);
        
        // Convert to display format for filtering
        const converted = productsArray.map(convertToDisplayProduct);
        setDisplayProducts(converted);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate product counts for each range
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    priceRanges.forEach((range) => {
      counts[range.id] = displayProducts.filter((product) =>
        isPriceInRange(product.price, range)
      ).length;
    });
    return counts;
  }, [displayProducts]);

  // Filter products based on selected price ranges, sizes, and colors
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      // Find original product to access variants
      const originalProduct = allProducts.find(p => p.id === product.id);
      if (!originalProduct) return false;

      // Price filter
      const priceMatch = selectedPriceRanges.length === 0 || 
        selectedPriceRanges.some((range) => isPriceInRange(product.price, range));

      // Size filter - check if any variant has the selected size
      const sizeMatch = selectedSizes.length === 0 || 
        originalProduct.variants?.some(variant => 
          variant.size && selectedSizes.includes(variant.size.toUpperCase())
        ) || false;

      // Color filter - check if any variant has the selected color
      const colorMatch = selectedColors.length === 0 || 
        originalProduct.variants?.some(variant => 
          variant.color && selectedColors.some(selectedColor => 
            variant.color?.toLowerCase().includes(selectedColor.toLowerCase())
          )
        ) || false;

      return priceMatch && sizeMatch && colorMatch;
    });
  }, [selectedPriceRanges, selectedSizes, selectedColors, displayProducts, allProducts]);

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
          title="Women's Collection"
          description="Discover the latest trends in women's fashion. From elegant dresses to casual wear, find your perfect style."
          image={getCategoryHeroImage("women")}
          category="women"
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
          title="Women's Collection"
          description="Discover the latest trends in women's fashion. From elegant dresses to casual wear, find your perfect style."
          image={getCategoryHeroImage("women")}
          category="women"
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
        title="Women's Collection"
        description="Discover the latest trends in women's fashion. From elegant dresses to casual wear, find your perfect style."
        image={getCategoryHeroImage("women")}
        category="women"
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
                  (Filters: 
                  {selectedPriceRanges.length > 0 && ` ${selectedPriceRanges.length} price`}
                  {selectedSizes.length > 0 && ` ${selectedSizes.length} size`}
                  {selectedColors.length > 0 && ` ${selectedColors.length} color`}
                  )
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
