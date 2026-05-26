"use client";

import { useState, useMemo, useEffect } from "react";
import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { getCategoryHeroImage } from "@/lib/product-images";
import { ApiService, Product } from "@/lib/api";
import { formatVND } from "@/lib/utils";

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

interface DisplayProduct {
  id: string;
  name: string;
  price: string;
  image: string;
}

const convertToDisplayProduct = (product: Product): DisplayProduct => {
  const prices = product.variants?.map((variant) => {
    const salePrice = variant.sale_price ? variant.sale_price : null;
    const regularPrice = variant.price;
    return salePrice || regularPrice;
  }) || [];

  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const primaryImage = product.images?.[0]?.url || "/placeholder.jpg";

  return {
    id: product.id,
    name: product.name,
    price: formatVND(lowestPrice),
    image: primaryImage,
  };
};

const parsePrice = (priceString: string): number =>
  parseFloat(
    priceString.replace(/[₫\s]/g, "").replace(/\./g, "").replace(",", ".")
  ) || 0;

const isPriceInRange = (priceString: string, range: PriceRange): boolean => {
  const price = parsePrice(priceString);
  return price >= range.min && (range.max === null || price < range.max);
};

export default function AccessoriesPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const priceRanges: PriceRange[] = [
    { id: "price1", label: "Under 100,000₫",       min: 0,       max: 100000 },
    { id: "price2", label: "100,000 – 300,000₫",   min: 100000,  max: 300000 },
    { id: "price3", label: "300,000 – 500,000₫",   min: 300000,  max: 500000 },
    { id: "price4", label: "500,000 – 1,000,000₫", min: 500000,  max: 1000000 },
    { id: "price5", label: "Over 1,000,000₫",      min: 1000000, max: null },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const category = await ApiService.getCategoryBySlug("accessory");
        const response = await ApiService.getCategoryProducts(category.id, {
          includeSubcategories: true,
          limit: 1000,
        });

        const productsArray = Array.isArray(response) ? response : response.data;
        setAllProducts(productsArray);
        setDisplayProducts(productsArray.map(convertToDisplayProduct));
      } catch (err) {
        console.error("Error fetching accessories products:", err);
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
      counts[range.id] = displayProducts.filter((p) =>
        isPriceInRange(p.price, range)
      ).length;
    });
    return counts;
  }, [displayProducts]);

  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      const original = allProducts.find((p) => p.id === product.id);
      if (!original) return false;

      const priceMatch =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => isPriceInRange(product.price, range));

      const sizeMatch =
        selectedSizes.length === 0 ||
        original.variants?.some(
          (v) => v.size && selectedSizes.includes(v.size.toUpperCase())
        ) ||
        false;

      const colorMatch =
        selectedColors.length === 0 ||
        original.variants?.some((v) =>
          v.color &&
          selectedColors.some((c) => v.color?.toLowerCase().includes(c.toLowerCase()))
        ) ||
        false;

      return priceMatch && sizeMatch && colorMatch;
    });
  }, [selectedPriceRanges, selectedSizes, selectedColors, displayProducts, allProducts]);

  const hero = (
    <CategoryHero
      title="Accessories Collection"
      description="Complete your look with our stylish accessories. From bags to jewelry, find the perfect finishing touch."
      image={getCategoryHeroImage("accessories")}
      category="accessories"
    />
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        {hero}
        <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
          <div className="text-center text-muted-foreground">Loading products...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        {hero}
        <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {hero}

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CategoryFilters
            onPriceChange={setSelectedPriceRanges}
            onSizeChange={setSelectedSizes}
            onColorChange={setSelectedColors}
            productCounts={productCounts}
          />
          <div className="md:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {allProducts.length} products
              {(selectedPriceRanges.length > 0 ||
                selectedSizes.length > 0 ||
                selectedColors.length > 0) && (
                <span className="ml-2">
                  (Filters:
                  {selectedPriceRanges.length > 0 &&
                    ` ${selectedPriceRanges.length} price`}
                  {selectedSizes.length > 0 && ` ${selectedSizes.length} size`}
                  {selectedColors.length > 0 &&
                    ` ${selectedColors.length} color`}
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
