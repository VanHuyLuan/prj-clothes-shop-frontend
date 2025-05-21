import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CategoryHero } from "@/components/category/category-hero";

// Dynamically import heavy components
const ProductGrid = dynamic(
  () =>
    import("@/components/category/product-grid").then((mod) => mod.ProductGrid),
  {
    loading: () => (
      <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
    ),
  }
);

const CategoryFilters = dynamic(
  () =>
    import("@/components/category/category-filters").then(
      (mod) => mod.CategoryFilters
    ),
  {
    loading: () => (
      <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
    ),
  }
);

// Mock data for products
const products = [
  // ... your products data
];

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title={`${title}'s Collection`}
        description={`Explore our ${category}'s fashion collection. From formal suits to casual streetwear, elevate your style.`}
        image={`/images/categories/${category}.jpg`}
        category={category}
      />

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Suspense
            fallback={
              <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
            }
          >
            <CategoryFilters />
          </Suspense>
          <div className="md:col-span-3">
            <Suspense
              fallback={
                <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
              }
            >
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
