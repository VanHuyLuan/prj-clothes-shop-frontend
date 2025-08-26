import { CategoryHero } from "@/components/client/category/category-hero";
import { Footer } from "@/components/client/layout/footer";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
export const metadata = {
  title: "Accessories Collection - STYLISH",
  description:
    "Complete your look with our stylish accessories. From bags to jewelry, find the perfect finishing touch.",
};

// Mock data for accessories
const products = [
  {
    id: "a1",
    name: "Leather Handbag",
    price: "$79.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a2",
    name: "Silver Necklace",
    price: "$45.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a3",
    name: "Woven Belt",
    price: "$29.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a4",
    name: "Silk Scarf",
    price: "$34.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a5",
    name: "Aviator Sunglasses",
    price: "$59.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a6",
    name: "Leather Wallet",
    price: "$49.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a7",
    name: "Beaded Bracelet",
    price: "$19.99",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "a8",
    name: "Fedora Hat",
    price: "$39.99",
    image: "/placeholder.svg?height=600&width=400",
  },
];

export default function AccessoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title="Accessories Collection"
        description="Complete your look with our stylish accessories. From bags to jewelry, find the perfect finishing touch."
        image="/placeholder.svg?height=1080&width=1920"
        category="accessories"
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
