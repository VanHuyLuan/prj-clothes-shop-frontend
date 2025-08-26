import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
export const metadata = {
  title: "Sale Items - STYLISH",
  description:
    "Shop our sale collection. Find great deals on fashion items with discounts up to 70% off.",
};

// Mock data for sale products
const products = [
  {
    id: "s1",
    name: "Summer Dress",
    price: "$29.99",
    originalPrice: "$59.99",
    discount: "50%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s2",
    name: "Denim Jacket",
    price: "$49.99",
    originalPrice: "$89.99",
    discount: "44%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s3",
    name: "Casual Sneakers",
    price: "$39.99",
    originalPrice: "$69.99",
    discount: "43%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s4",
    name: "Leather Belt",
    price: "$19.99",
    originalPrice: "$34.99",
    discount: "43%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s5",
    name: "Wool Sweater",
    price: "$34.99",
    originalPrice: "$69.99",
    discount: "50%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s6",
    name: "Slim Fit Jeans",
    price: "$29.99",
    originalPrice: "$59.99",
    discount: "50%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s7",
    name: "Cotton T-Shirt",
    price: "$14.99",
    originalPrice: "$24.99",
    discount: "40%",
    image: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "s8",
    name: "Tote Bag",
    price: "$24.99",
    originalPrice: "$49.99",
    discount: "50%",
    image: "/placeholder.svg?height=600&width=400",
  },
];

export default function SalePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title="Sale Collection"
        description="Shop our sale collection. Find great deals on fashion items with discounts up to 70% off."
        image="/placeholder.svg?height=1080&width=1920"
        category="sale"
        isSale
      />

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CategoryFilters showDiscount />
          <div className="md:col-span-3">
            <ProductGrid products={products} showDiscount />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
