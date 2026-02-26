"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, Clock, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ApiService, type Product } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Search products with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await ApiService.searchProducts(query, { limit: 10 });
        setResults(response.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (product: Product) => {
    saveRecentSearch(query);
    onOpenChange(false);
    router.push(`/client/products/${product.slug}`);
  };

  const handleViewAll = () => {
    if (query.trim()) {
      saveRecentSearch(query);
      onOpenChange(false);
      router.push(`/client/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "/placeholder.jpg";
  };

  const getProductPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      return {
        price: Number(variant.price) || 0,
        salePrice: variant.sale_price ? Number(variant.sale_price) : null,
      };
    }
    return { price: 0, salePrice: null };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-background to-muted/20">
          <DialogTitle className="sr-only">Search Products</DialogTitle>
          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <Search className="h-5 w-5 text-primary" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
            </div>
            <Input
              type="search"
              placeholder="Search for products, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg placeholder:text-muted-foreground/60 bg-transparent"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuery("")}
                className="h-8 w-8 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(85vh-120px)]">
          <div className="px-6 py-5">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">
                      Recent Searches
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="h-auto px-2 py-1 text-xs hover:text-primary"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 px-3 py-1.5 text-sm"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <>
                {results.length > 0 ? (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">
                          Found {results.length} {results.length === 1 ? 'Product' : 'Products'}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewAll}
                        className="h-auto p-0 text-sm font-medium hover:text-primary group"
                      >
                        View all
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                    {results.map((product, index) => {
                      const { price, salePrice } = getProductPrice(product);
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="group flex gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer transition-all duration-300 border border-transparent hover:border-primary/20 hover:shadow-sm"
                          style={{ 
                            animationDelay: `${index * 50}ms`,
                            animation: 'slideIn 0.3s ease-out forwards'
                          }}
                        >
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow ring-1 ring-border/50">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {salePrice && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                Sale
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-semibold truncate text-base group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            {product.brand && (
                              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                {product.brand}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {salePrice ? (
                                <>
                                  <span className="font-bold text-lg text-primary">
                                    ${salePrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${price.toFixed(2)}
                                  </span>
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    Save ${(price - salePrice).toFixed(2)}
                                  </Badge>
                                </>
                              ) : (
                                <span className="font-bold text-lg">
                                  ${price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                  <Search className="relative h-16 w-16 mx-auto text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Search for products
                </h3>
                <p className="text-muted-foreground text-sm">
                  Start typing to discover amazing products, brands, and deals
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <kbd className="px-2 py-1 bg-muted rounded border">Ctrl</kbd>
                  <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded border">K</kbd>
                    <span className="ml-2">to search anytime</span>
                  </div>
                </div>
                  )}
              </>
            )}

            {/* Empty State */}
            {!query && recentSearches.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Start typing to search for products
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
