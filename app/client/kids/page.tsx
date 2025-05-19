import { CategoryHero } from "@/components/category/category-hero";
import { ProductGrid } from "@/components/category/product-grid";
import { CategoryFilters } from "@/components/category/category-filters";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
export const metadata = {
  title: "Kids' Collection - STYLISH",
  description:
    "Discover our playful and comfortable kids' clothing collection. Quality clothes for all ages.",
};

// Mock data for kids' products
const products = [
  {
    id: "k1",
    name: "Dinosaur T-Shirt",
    price: "$19.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k2",
    name: "Denim Overalls",
    price: "$34.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k3",
    name: "Colorful Hoodie",
    price: "$29.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k4",
    name: "Floral Dress",
    price: "$32.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k5",
    name: "Cargo Shorts",
    price: "$24.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k6",
    name: "Patterned Leggings",
    price: "$18.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k7",
    name: "School Uniform Set",
    price: "$45.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "k8",
    name: "Rain Jacket",
    price: "$39.99",
    image: "/placeholder.svg?height=600&width=400",
  },
];

export default function KidsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title="Kids' Collection"
        description="Discover our playful and comfortable kids' clothing collection. Quality clothes for all ages."
        image="/placeholder.svg?height=1080&width=1920"
        category="kids"
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
