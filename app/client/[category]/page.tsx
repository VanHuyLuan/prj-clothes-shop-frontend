import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { CategoryHero } from "@/components/client/category/category-hero";

// Thêm interface để định nghĩa kiểu dữ liệu cho Product
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  originalPrice?: string;
  discount?: string;
}

// Dynamically import heavy components
const ProductGrid = dynamic(
  () =>
    import("@/components/client/category/product-grid").then((mod) => mod.ProductGrid),
  {
    loading: () => (
      <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
    ),
  }
);

const CategoryFilters = dynamic(
  () =>
    import("@/components/client/category/category-filters").then(
      (mod) => mod.CategoryFilters
    ),
  {
    loading: () => (
      <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
    ),
  }
);

// Áp dụng kiểu dữ liệu Product[] cho biến products
const products: Product[] = [
  // ... bạn có thể thêm dữ liệu sản phẩm giả ở đây nếu cần
  {
    id: "c1",
    name: "Sample Product",
    price: "$99.99",
    image: "/placeholder.svg?height=600&width=400",
  },
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
