import { CategoryHeader } from "@/components/sections/category-header";

export default function MenPage() {
  return (
    <main>
      <CategoryHeader
        title="Men's Collection"
        description="Explore our men's fashion collection. From formal suits to casual streetwear, find your signature look."
        imageUrl="https://pos.nvncdn.com/fa2431-2286/album/20250417_LZDdKSEp.png"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product grid will be added here */}
        </div>
      </div>
    </main>
  );
}
