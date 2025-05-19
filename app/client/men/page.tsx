import { CategoryHero } from "@/components/category/category-hero";
import { ProductGrid } from "@/components/category/product-grid";
import { CategoryFilters } from "@/components/category/category-filters";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
export const metadata = {
  title: "Men's Collection - STYLISH",
  description:
    "Explore our men's fashion collection. From formal suits to casual streetwear, elevate your style.",
};

// Mock data for men's products
const products = [
  {
    id: "m1",
    name: "Classic Oxford Shirt",
    price: "$45.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m2",
    name: "Slim Fit Chinos",
    price: "$59.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m3",
    name: "Wool Blazer",
    price: "$129.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m4",
    name: "Graphic T-Shirt",
    price: "$29.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m5",
    name: "Denim Jacket",
    price: "$89.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m6",
    name: "Knit Pullover",
    price: "$55.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m7",
    name: "Tailored Trousers",
    price: "$79.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "m8",
    name: "Casual Polo",
    price: "$39.99",
    image: "/placeholder.svg?height=600&width=400",
  },
];

export default function MenPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title="Men's Collection"
        description="Explore our men's fashion collection. From formal suits to casual streetwear, elevate your style."
        image="/placeholder.svg?height=1080&width=1920"
        category="men"
      />

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CategoryFilters />
          <div className="md:col-span-3">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
