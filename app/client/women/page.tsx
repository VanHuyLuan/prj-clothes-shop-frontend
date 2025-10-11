import { CategoryHero } from "@/components/client/category/category-hero";
import { ProductGrid } from "@/components/client/category/product-grid";
import { CategoryFilters } from "@/components/client/category/category-filters";
import { Header } from "@/components/client/layout/header";
import { Footer } from "@/components/client/layout/footer";
import { getCategoryImageByIndex, getCategoryHeroImage } from "@/lib/product-images";

export const metadata = {
  title: "Women's Collection - STYLISH",
  description:
    "Discover our latest women's fashion collection. From elegant dresses to casual wear, find your perfect style.",
};

// Mock data for women's products
const products = [
  {
    id: "w1",
    name: "Floral Summer Dress",
    price: "$49.99",
    image: getCategoryImageByIndex("women", 0),
  },
  {
    id: "w2",
    name: "Slim Fit Jeans",
    price: "$59.99",
    image: getCategoryImageByIndex("women", 1),
  },
  {
    id: "w3",
    name: "Casual Blazer",
    price: "$89.99",
    image: getCategoryImageByIndex("women", 2),
  },
  {
    id: "w4",
    name: "Cotton T-Shirt",
    price: "$24.99",
    image: getCategoryImageByIndex("women", 3),
  },
  {
    id: "w5",
    name: "Leather Jacket",
    price: "$129.99",
    image: getCategoryImageByIndex("women", 4),
  },
  {
    id: "w6",
    name: "Knit Sweater",
    price: "$45.99",
    image: getCategoryImageByIndex("women", 5),
  },
  {
    id: "w7",
    name: "Pleated Skirt",
    price: "$39.99",
    image: getCategoryImageByIndex("women", 6),
  },
  {
    id: "w8",
    name: "Silk Blouse",
    price: "$69.99",
    image: getCategoryImageByIndex("women", 7),
  },
];

export default function WomenPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryHero
        title="Women's Collection"
        description="Discover the latest trends in women's fashion. From elegant dresses to casual wear, find your perfect style."
        image={getCategoryHeroImage("women")}
        category="women"
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
