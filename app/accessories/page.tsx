import { CategoryHeader } from "@/components/sections/category-header";

export default function AccessoriesPage() {
  return (
    <main>
      <CategoryHeader
        title="Accessories Collection"
        description="Complete your look with our stylish accessories. From bags to jewelry, find the perfect finishing touch."
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
