"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search");
  const [searchInput, setSearchInput] = useState(searchQuery || "");
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

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If there's a search query, use search API
        if (searchQuery) {
          const response = await ApiService.searchProducts(searchQuery, {
            limit: 1000
          });
          const productsArray = Array.isArray(response) ? response : response.data;
          setAllProducts(productsArray);
        } else {
          // Otherwise fetch all products
          const response = await ApiService.getProducts({
            limit: 1000
          });
          const productsArray = Array.isArray(response) ? response : response.data;
          setAllProducts(productsArray);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(searchQuery || "");
  }, [searchQuery]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/client/products?search=${encodeURIComponent(searchInput)}`);
    } else {
      router.push("/client/products");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push("/client/products");
  };

  // Count products per price range
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

  // Filtered products
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

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants?.some(variant =>
          selectedSizes.includes(variant.size || '')
        )
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants?.some(variant =>
          selectedColors.includes(variant.color || '')
        )
      );
    }

    // Convert to display format after filtering
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
        {!searchQuery && (
          <CategoryHero
            title="All Products"
            description="Explore our full collection across all categories. Find styles for every occasion and every member of your family."
            image={getCategoryHeroImage("women")}
            category="all"
          />
        )}
        <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
          {searchQuery && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Search Results for "{searchQuery}"</h1>
              <p className="text-muted-foreground">Finding products matching "{searchQuery}"</p>
            </div>
          )}
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
        {!searchQuery && (
          <CategoryHero
            title="All Products"
            description="Explore our full collection across all categories. Find styles for every occasion and every member of your family."
            image={getCategoryHeroImage("women")}
            category="all"
          />
        )}
        <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
          {searchQuery && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Search Results for "{searchQuery}"</h1>
              <p className="text-muted-foreground">Showing results for "{searchQuery}"</p>
            </div>
          )}
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

      {/* HERO BANNER - Only show for All Products */}
      {!searchQuery && (
        <CategoryHero
          title="All Products"
          description="Explore our full collection across all categories. Find styles for every occasion and every member of your family."
          image={getCategoryHeroImage("women")}
          category="all"
        />
      )}

      {/* CONTENT */}
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        {/* SEARCH RESULTS HEADER */}
        {searchQuery && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Results for "{searchQuery}"</h1>
            <p className="text-muted-foreground">Found {allProducts.length} {allProducts.length === 1 ? 'product' : 'products'} matching your search</p>
          </div>
        )}
        {/* SEARCH BAR */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-12 pr-12 h-12 text-base bg-background border-2 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                />
                {searchInput && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 rounded-xl font-semibold"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* FILTERS */}
          <CategoryFilters 
            onPriceChange={handlePriceChange}
            onSizeChange={handleSizeChange}
            onColorChange={handleColorChange}
            productCounts={productCounts}
          />

          {/* PRODUCT GRID */}
          <div className="md:col-span-3">
            <div className="mb-4 text-sm text-muted-foreground">
              {searchQuery && (
                <div className="mb-2 font-medium text-foreground">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              )}
              Showing {filteredProducts.length} of {allProducts.length} products
              {(selectedPriceRanges.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0) && (
                <span className="ml-2">
                  ({selectedPriceRanges.length + selectedSizes.length + selectedColors.length} filter{(selectedPriceRanges.length + selectedSizes.length + selectedColors.length) > 1 ? 's' : ''} applied)
                </span>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}"`
                    : "No products found with the selected filters"
                  }
                </p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} fullProducts={allProducts} />
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
