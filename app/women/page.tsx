import { CategoryHeader } from "@/components/sections/category-header";

export default function WomenPage() {
  return (
    <main>
      <CategoryHeader
        title="Women's Collection"
        description="Discover the latest trends in women's fashion. From elegant dresses to casual wear, find your perfect style."
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
