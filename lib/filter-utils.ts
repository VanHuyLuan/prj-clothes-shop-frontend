interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

interface Product {
  price: number;
  [key: string]: any;
}

/**
 * Filter products by selected price ranges
 * @param products - Array of products to filter
 * @param selectedRanges - Array of selected price ranges
 * @returns Filtered array of products
 */
export function filterProductsByPrice<T extends Product>(
  products: T[],
  selectedRanges: PriceRange[]
): T[] {
  // If no price ranges selected, return all products
  if (selectedRanges.length === 0) {
    return products;
  }

  return products.filter((product) => {
    return selectedRanges.some((range) => {
      const price = product.price;
      const inRange =
        price >= range.min && (range.max === null || price < range.max);
      return inRange;
    });
  });
}

/**
 * Check if a product price falls within a specific range
 * @param price - Product price
 * @param range - Price range to check
 * @returns Boolean indicating if price is in range
 */
export function isPriceInRange(price: number, range: PriceRange): boolean {
  return price >= range.min && (range.max === null || price < range.max);
}

/**
 * Get the count of products in each price range
 * @param products - Array of products
 * @param priceRanges - Array of price ranges
 * @returns Object with count for each range id
 */
export function getProductCountByPriceRange<T extends Product>(
  products: T[],
  priceRanges: PriceRange[]
): Record<string, number> {
  const counts: Record<string, number> = {};

  priceRanges.forEach((range) => {
    counts[range.id] = products.filter((product) =>
      isPriceInRange(product.price, range)
    ).length;
  });

  return counts;
}
